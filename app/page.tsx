"use client";

import { useState, useEffect } from "react";

type TestStatus = "idle" | "ready" | "running" | "completed";
type TestResult = "passed" | "failed" | null;

interface TestState {
  status: TestStatus;
  startTime: number | null;
  endTime: number | null;
  elapsed: number;
  result: TestResult;
}

export default function Home() {
  const [currentTest, setCurrentTest] = useState<"verifEye" | "facetec" | null>(
    null
  );

  const [verifEye, setVerifEye] = useState<TestState>({
    status: "idle",
    startTime: null,
    endTime: null,
    elapsed: 0,
    result: null,
  });

  const [facetec, setFacetec] = useState<TestState>({
    status: "idle",
    startTime: null,
    endTime: null,
    elapsed: 0,
    result: null,
  });

  // Timer effect for VerifEye
  useEffect(() => {
    if (verifEye.status === "running" && verifEye.startTime) {
      const interval = setInterval(() => {
        setVerifEye((prev) => ({
          ...prev,
          elapsed: Date.now() - (prev.startTime || 0),
        }));
      }, 10);
      return () => clearInterval(interval);
    }
  }, [verifEye.status, verifEye.startTime]);

  // Timer effect for FaceTec
  useEffect(() => {
    if (facetec.status === "running" && facetec.startTime) {
      const interval = setInterval(() => {
        setFacetec((prev) => ({
          ...prev,
          elapsed: Date.now() - (prev.startTime || 0),
        }));
      }, 10);
      return () => clearInterval(interval);
    }
  }, [facetec.status, facetec.startTime]);

  // Keyboard shortcut: Spacebar to start timer
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        if (verifEye.status === "ready") {
          startTimer("verifEye");
        } else if (facetec.status === "ready") {
          startTimer("facetec");
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [verifEye.status, facetec.status]);

  const openPopup = (platform: "verifEye" | "facetec") => {
    setCurrentTest(platform);
    const setState = platform === "verifEye" ? setVerifEye : setFacetec;

    // Set to ready state (popup opened, but timer not started)
    setState({
      status: "ready",
      startTime: null,
      endTime: null,
      elapsed: 0,
      result: null,
    });

    // Open popup window
    const url = platform === "verifEye"
      ? "https://realeyes.ai/try-demo/#demo"
      : "https://browser.facetec.com/";
    const name = platform === "verifEye" ? "verifEyePopup" : "facetecPopup";

    window.open(url, name);
  };

  const startTimer = (platform: "verifEye" | "facetec") => {
    const setState = platform === "verifEye" ? setVerifEye : setFacetec;
    setState((prev) => ({
      ...prev,
      status: "running",
      startTime: Date.now(),
      elapsed: 0,
    }));
  };

  const stopTest = (platform: "verifEye" | "facetec", result: TestResult) => {
    const setState = platform === "verifEye" ? setVerifEye : setFacetec;
    setState((prev) => ({
      ...prev,
      status: "completed",
      endTime: Date.now(),
      result,
    }));
    setCurrentTest(null);
  };

  const resetAll = () => {
    setVerifEye({
      status: "idle",
      startTime: null,
      endTime: null,
      elapsed: 0,
      result: null,
    });
    setFacetec({
      status: "idle",
      startTime: null,
      endTime: null,
      elapsed: 0,
      result: null,
    });
    setCurrentTest(null);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const deciseconds = Math.floor((ms % 1000) / 100);
    return `${seconds}.${deciseconds}s`;
  };

  const bothCompleted = verifEye.status === "completed" && facetec.status === "completed";
  const verifEyeWon = bothCompleted && verifEye.result === "passed" &&
    (facetec.result === "failed" || verifEye.elapsed < facetec.elapsed);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Face Verification Comparison
          </h1>
          <p className="mt-2 text-gray-600">
            Compare VerifEye and FaceTec verification experiences side-by-side
          </p>
        </div>
      </div>

      {/* Main Comparison Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* VerifEye Panel */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-verifEye-blue text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">VerifEye</h2>
                {verifEye.status === "completed" && verifEye.result === "passed" && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ Winner
                  </span>
                )}
              </div>
            </div>

            {/* Timer Display */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {verifEye.status === "idle" && "Ready to test"}
                  {verifEye.status === "ready" && "Popup opened - start when ready"}
                  {verifEye.status === "running" && "Testing in progress..."}
                  {verifEye.status === "completed" && "Test completed"}
                </span>
                <div className={`text-3xl font-bold tabular-nums ${
                  verifEye.status === "running" ? "text-verifEye-blue animate-pulse" :
                  verifEye.status === "completed" && verifEye.result === "passed" ? "text-green-600" :
                  verifEye.status === "completed" && verifEye.result === "failed" ? "text-red-600" :
                  "text-gray-400"
                }`}>
                  {formatTime(verifEye.elapsed)}
                </div>
              </div>
            </div>

            {/* Popup Placeholder */}
            <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center" style={{ height: "500px" }}>
              {verifEye.status === "idle" && (
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-verifEye-blue rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Opens in New Window</h3>
                  <p className="text-gray-600 text-sm">VerifEye will launch in a popup window for security</p>
                </div>
              )}
              {verifEye.status === "ready" && (
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Popup Opened</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    1. Select your UX mode in the popup<br />
                    2. Press <kbd className="px-2 py-1 bg-gray-200 rounded font-mono text-xs mx-1">SPACE</kbd> when verification begins
                  </p>
                  <div className="inline-block bg-white px-6 py-3 rounded-lg shadow-sm border-2 border-yellow-400">
                    <p className="text-sm font-semibold text-yellow-700">⏸️ Timer ready - press SPACE to start</p>
                  </div>
                </div>
              )}
              {verifEye.status === "running" && (
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-verifEye-blue rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Verification in Progress</h3>
                  <p className="text-gray-600 text-sm mb-4">Complete the verification in the popup window</p>
                  <div className="inline-block bg-white px-4 py-2 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">⏱️ Timer Running</p>
                    <p className="text-3xl font-bold text-verifEye-blue tabular-nums">
                      {formatTime(verifEye.elapsed)}
                    </p>
                  </div>
                </div>
              )}
              {verifEye.status === "completed" && (
                <div className="text-center p-8">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    verifEye.result === "passed" ? "bg-green-500" : "bg-red-500"
                  }`}>
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {verifEye.result === "passed" ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      )}
                    </svg>
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${
                    verifEye.result === "passed" ? "text-green-800" : "text-red-800"
                  }`}>
                    {verifEye.result === "passed" ? "Verification Passed" : "Verification Failed"}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 tabular-nums">{formatTime(verifEye.elapsed)}</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              {verifEye.status === "idle" && (
                <button
                  onClick={() => openPopup("verifEye")}
                  disabled={currentTest !== null}
                  suppressHydrationWarning
                  className="w-full bg-verifEye-blue text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  🚀 Open VerifEye Popup
                </button>
              )}

              {verifEye.status === "ready" && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center font-medium">
                    📱 Select UX mode in popup, then:
                  </p>
                  <button
                    onClick={() => startTimer("verifEye")}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    ▶️ Start Timer (when you begin verification)
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    💡 Tip: Press <kbd className="px-2 py-1 bg-gray-200 rounded font-mono text-xs">SPACE</kbd> to start timer instantly
                  </p>
                </div>
              )}

              {verifEye.status === "running" && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center font-medium">
                    ⚠️ Complete verification in the popup window, then mark the result:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => stopTest("verifEye", "passed")}
                      className="bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      ✓ Passed
                    </button>
                    <button
                      onClick={() => stopTest("verifEye", "failed")}
                      className="bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                      ✗ Failed
                    </button>
                  </div>
                </div>
              )}

              {verifEye.status === "completed" && (
                <div className={`p-4 rounded-lg ${
                  verifEye.result === "passed" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${
                      verifEye.result === "passed" ? "text-green-800" : "text-red-800"
                    }`}>
                      {verifEye.result === "passed" ? "✓ Verification Passed" : "✗ Verification Failed"}
                    </span>
                    <span className="text-2xl font-bold tabular-nums">
                      {formatTime(verifEye.elapsed)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FaceTec Panel */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-600 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">FaceTec</h2>
                {facetec.status === "completed" && facetec.result === "passed" && !verifEyeWon && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ Winner
                  </span>
                )}
              </div>
            </div>

            {/* Timer Display */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {facetec.status === "idle" && (verifEye.status === "completed" ? "Ready to test" : "Complete VerifEye first")}
                  {facetec.status === "ready" && "Popup opened - start when ready"}
                  {facetec.status === "running" && "Testing in progress..."}
                  {facetec.status === "completed" && "Test completed"}
                </span>
                <div className={`text-3xl font-bold tabular-nums ${
                  facetec.status === "running" ? "text-gray-600 animate-pulse" :
                  facetec.status === "completed" && facetec.result === "passed" ? "text-green-600" :
                  facetec.status === "completed" && facetec.result === "failed" ? "text-red-600" :
                  "text-gray-400"
                }`}>
                  {formatTime(facetec.elapsed)}
                </div>
              </div>
            </div>

            {/* Popup Placeholder */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center" style={{ height: "500px" }}>
              {facetec.status === "idle" && (
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-600 rounded-full flex items-center justify-center opacity-50">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Opens in New Window</h3>
                  <p className="text-gray-600 text-sm">
                    {verifEye.status === "completed"
                      ? "FaceTec will launch in a popup window"
                      : "Complete VerifEye test first"}
                  </p>
                </div>
              )}
              {facetec.status === "ready" && (
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Popup Opened</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    1. Fill in the form in the popup<br />
                    2. Press <kbd className="px-2 py-1 bg-gray-200 rounded font-mono text-xs mx-1">SPACE</kbd> when verification begins
                  </p>
                  <div className="inline-block bg-white px-6 py-3 rounded-lg shadow-sm border-2 border-yellow-400">
                    <p className="text-sm font-semibold text-yellow-700">⏸️ Timer ready - press SPACE to start</p>
                  </div>
                </div>
              )}
              {facetec.status === "running" && (
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-600 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Verification in Progress</h3>
                  <p className="text-gray-600 text-sm mb-4">Complete the verification in the popup window</p>
                  <div className="inline-block bg-white px-4 py-2 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">⏱️ Timer Running</p>
                    <p className="text-3xl font-bold text-gray-600 tabular-nums">
                      {formatTime(facetec.elapsed)}
                    </p>
                  </div>
                </div>
              )}
              {facetec.status === "completed" && (
                <div className="text-center p-8">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    facetec.result === "passed" ? "bg-green-500" : "bg-red-500"
                  }`}>
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {facetec.result === "passed" ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      )}
                    </svg>
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${
                    facetec.result === "passed" ? "text-green-800" : "text-red-800"
                  }`}>
                    {facetec.result === "passed" ? "Verification Passed" : "Verification Failed"}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 tabular-nums">{formatTime(facetec.elapsed)}</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              {facetec.status === "idle" && (
                <button
                  onClick={() => openPopup("facetec")}
                  disabled={currentTest !== null || verifEye.status !== "completed"}
                  suppressHydrationWarning
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {verifEye.status === "completed" ? "🚀 Open FaceTec Popup" : "Complete VerifEye Test First"}
                </button>
              )}

              {facetec.status === "ready" && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center font-medium">
                    📝 Fill in the form in popup, then:
                  </p>
                  <button
                    onClick={() => startTimer("facetec")}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    ▶️ Start Timer (when you begin verification)
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    💡 Tip: Press <kbd className="px-2 py-1 bg-gray-200 rounded font-mono text-xs">SPACE</kbd> to start timer instantly
                  </p>
                </div>
              )}

              {facetec.status === "running" && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center font-medium">
                    ⚠️ Complete verification in the popup window, then mark the result:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => stopTest("facetec", "passed")}
                      className="bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      ✓ Passed
                    </button>
                    <button
                      onClick={() => stopTest("facetec", "failed")}
                      className="bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                      ✗ Failed
                    </button>
                  </div>
                </div>
              )}

              {facetec.status === "completed" && (
                <div className={`p-4 rounded-lg ${
                  facetec.result === "passed" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${
                      facetec.result === "passed" ? "text-green-800" : "text-red-800"
                    }`}>
                      {facetec.result === "passed" ? "✓ Verification Passed" : "✗ Verification Failed"}
                    </span>
                    <span className="text-2xl font-bold tabular-nums">
                      {formatTime(facetec.elapsed)}
                    </span>
                  </div>
                  {facetec.result === "failed" && (
                    <p className="text-sm text-red-600 mt-2">
                      Common issue: Face not detected
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comparison Summary */}
        {bothCompleted && (
          <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-verifEye-blue to-gray-600 text-white px-6 py-4">
              <h2 className="text-2xl font-bold">Comparison Results</h2>
            </div>
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Metric
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-verifEye-blue">
                      VerifEye
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-600">
                      FaceTec
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-700">
                      Time to Complete
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className={`text-2xl font-bold tabular-nums ${
                        verifEye.result === "passed" && verifEye.elapsed < facetec.elapsed ? "text-green-600" : "text-gray-900"
                      }`}>
                        {formatTime(verifEye.elapsed)}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className={`text-2xl font-bold tabular-nums ${
                        facetec.result === "passed" && facetec.elapsed < verifEye.elapsed ? "text-green-600" : "text-gray-900"
                      }`}>
                        {facetec.result === "failed" ? "N/A" : formatTime(facetec.elapsed)}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-700">
                      Result
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        verifEye.result === "passed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {verifEye.result === "passed" ? "✓ Passed" : "✗ Failed"}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        facetec.result === "passed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {facetec.result === "passed" ? "✓ Passed" : "✗ Failed"}
                      </span>
                    </td>
                  </tr>
                  {verifEye.result === "passed" && facetec.result === "passed" && (
                    <tr>
                      <td className="py-4 px-4 font-medium text-gray-700">
                        Speed Advantage
                      </td>
                      <td className="text-center py-4 px-4" colSpan={2}>
                        <span className="text-lg font-bold text-verifEye-blue">
                          VerifEye is {((facetec.elapsed / verifEye.elapsed)).toFixed(1)}x faster
                        </span>
                      </td>
                    </tr>
                  )}
                  {verifEye.result === "passed" && facetec.result === "failed" && (
                    <tr>
                      <td className="py-4 px-4 font-medium text-gray-700">
                        Robustness
                      </td>
                      <td className="text-center py-4 px-4" colSpan={2}>
                        <span className="text-lg font-bold text-verifEye-blue">
                          VerifEye succeeded where FaceTec failed
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={resetAll}
                  className="bg-gray-200 text-gray-800 py-3 px-8 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  ↻ Run New Comparison
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
