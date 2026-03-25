import { NextRequest, NextResponse } from "next/server";

const ALLOWED = [
  "https://realeyes.ai",
  "https://browser.facetec.com",
];

const CLICK_SCRIPT = `
<script>
(function() {
  document.addEventListener('click', function() {
    window.parent.postMessage({ type: 'CLICK' }, '*');
  }, true);
})();
</script>`;

export async function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  if (!ALLOWED.some((a) => targetUrl.startsWith(a))) {
    return new NextResponse("URL not allowed", { status: 403 });
  }

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
    });
  } catch (err) {
    return new NextResponse(`Fetch failed: ${err}`, { status: 502 });
  }

  const contentType = response.headers.get("content-type") || "text/html";

  if (!contentType.includes("text/html")) {
    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, { headers: { "Content-Type": contentType } });
  }

  let html = await response.text();

  // Inject base tag so relative URLs resolve to the original domain
  const { protocol, host } = new URL(targetUrl);
  const baseTag = `<base href="${protocol}//${host}/">`;

  if (html.includes("<head>")) {
    html = html.replace("<head>", `<head>${baseTag}${CLICK_SCRIPT}`);
  } else {
    html = baseTag + CLICK_SCRIPT + html;
  }

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Intentionally omitting X-Frame-Options and Content-Security-Policy
    },
  });
}
