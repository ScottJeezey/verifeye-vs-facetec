"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const URLS: Record<string, string> = {
  verifEye: "https://realeyes.ai/try-demo/#demo",
  facetec: "https://browser.facetec.com/",
};

function PopupContent() {
  const params = useSearchParams();
  const platform = params.get("platform") as "verifEye" | "facetec" | null;

  const [isLocal, setIsLocal] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "completed">("idle");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [result, setResult] = useState<"passed" | "failed" | null>(null);

  useEffect(() => {
    setIsLocal(window.location.hostname === "localhost");
  }, []);

  // Timer tick
  useEffect(() => {
    if (status === "running" && startTime) {
      const id = setInterval(() => setElapsed(Date.now() - startTime), 10);
      return () => clearInterval(id);
    }
  }, [status, startTime]);

  // Listen for clicks forwarded from the proxied iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "CLICK" && status === "running") {
        setClicks((c) => c + 1);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [status]);

  const startTimer = useCallback(() => {
    setStatus("running");
    setStartTime(Date.now());
    setElapsed(0);
    setClicks(0);
  }, []);

  const stopTimer = useCallback(
    (r: "passed" | "failed") => {
      const finalElapsed = startTime ? Date.now() - startTime : elapsed;
      setResult(r);
      setStatus("completed");

      window.opener?.postMessage(
        { type: "VERIFICATION_RESULT", platform, elapsed: finalElapsed, clicks, result: r },
        window.location.origin
      );

      setTimeout(() => window.close(), 1800);
    },
    [startTime, elapsed, clicks, platform]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === "Space") {
        e.preventDefault();
        if (status === "idle") startTimer();
      }
      if ((e.key === "c" || e.key === "C") && status === "running") {
        setClicks((c) => c + 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [status, startTimer]);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const d = Math.floor((ms % 1000) / 100);
    return `${s}.${d}s`;
  };

  if (!platform) return <div className="p-8 text-gray-500">Missing platform parameter.</div>;

  const targetUrl = URLS[platform];
  const iframeSrc = isLocal ? `/api/proxy?url=${encodeURIComponent(targetUrl)}` : targetUrl;
  const isVerifEye = platform === "verifEye";
  const headerBg = isVerifEye ? "bg-blue-800" : "bg-gray-700";

  return (
    <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">
      {/* Control bar */}
      <div className={`flex items-center justify-between px-4 py-2 ${headerBg} shrink-0`}>
        {/* Left: label + timer + click counter */}
        <div className="flex items-center gap-4">
          <span className="text-white font-bold text-base">
            {isVerifEye ? "VerifEye" : "FaceTec"}
          </span>

          <span
            className={`text-2xl font-bold tabular-nums ${
              status === "running"
                ? "text-yellow-300"
                : status === "completed" && result === "passed"
                ? "text-green-400"
                : status === "completed" && result === "failed"
                ? "text-red-400"
                : "text-white/40"
            }`}
          >
            {formatTime(elapsed)}
          </span>

          <div className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-1">
            <span className="text-white/60 text-xs uppercase tracking-wide">Clicks</span>
            <span className="text-white font-bold text-lg tabular-nums">{clicks}</span>
            {status === "running" && (
              <button
                onClick={() => setClicks((c) => c + 1)}
                className="ml-1 bg-white/20 hover:bg-white/30 text-white text-xs px-2 py-0.5 rounded transition"
              >
                +1
              </button>
            )}
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2">
          {status === "idle" && (
            <button
              onClick={startTimer}
              className="bg-green-500 hover:bg-green-400 text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition"
            >
              ▶ Start <span className="opacity-60 text-xs ml-1">[Space]</span>
            </button>
          )}
          {status === "running" && (
            <>
              <button
                onClick={() => stopTimer("passed")}
                className="bg-green-500 hover:bg-green-400 text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition"
              >
                ✓ Passed
              </button>
              <button
                onClick={() => stopTimer("failed")}
                className="bg-red-500 hover:bg-red-400 text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition"
              >
                ✗ Failed
              </button>
              <span className="text-white/40 text-xs ml-1">[C] = +click</span>
            </>
          )}
          {status === "completed" && (
            <span
              className={`font-semibold text-sm px-4 py-1.5 rounded-lg ${
                result === "passed" ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {result === "passed" ? "✓ Passed" : "✗ Failed"} — closing…
            </span>
          )}
        </div>
      </div>

      {/* Iframe */}
      <div className="flex-1 relative">
        <iframe
          src={iframeSrc}
          className="w-full h-full border-0"
          allow="camera; microphone; autoplay"
          title={`${platform} verification demo`}
        />
        {!isLocal && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/95">
            <div className="text-center text-white p-8 max-w-sm">
              <div className="text-4xl mb-4">🔒</div>
              <p className="text-lg font-semibold mb-2">iframe blocked</p>
              <p className="text-gray-400 text-sm">
                {isVerifEye ? "realeyes.ai" : "facetec.com"} blocks iframe embedding.
                Run locally to use the proxy, or ask engineering to whitelist this domain.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PopupPage() {
  return (
    <Suspense>
      <PopupContent />
    </Suspense>
  );
}
