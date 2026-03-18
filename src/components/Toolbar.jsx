import { useState, useCallback } from "react";

export default function Toolbar({
  inputValue,
  outputValue,
  resolvedInputFormat,
  outputFormat,
  onClear,
  error,
}) {
  const [copyFeedback, setCopyFeedback] = useState(null);

  const showFeedback = useCallback((msg) => {
    setCopyFeedback(msg);
    setTimeout(() => setCopyFeedback(null), 1500);
  }, []);

  // 출력 결과 클립보드 복사
  const handleCopyOutput = async () => {
    if (!outputValue.trim()) return;
    try {
      await navigator.clipboard.writeText(outputValue);
      showFeedback("✅ 출력 복사 완료!");
    } catch {
      showFeedback("❌ 복사 실패");
    }
  };

  // 입력 내용 클립보드 복사
  const handleCopyInput = async () => {
    if (!inputValue.trim()) return;
    try {
      await navigator.clipboard.writeText(inputValue);
      showFeedback("✅ 입력 복사 완료!");
    } catch {
      showFeedback("❌ 복사 실패");
    }
  };

  // 파일 확장자 매핑
  const extMap = { json: "json", yaml: "yaml", toml: "toml" };

  // 출력 결과 파일 다운로드
  const handleDownload = () => {
    if (!outputValue.trim()) return;
    const ext = extMap[outputFormat] || "txt";
    const blob = new Blob([outputValue], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showFeedback(`✅ converted.${ext} 다운로드!`);
  };

  // 파일 업로드 (입력에 로드)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        onClear(text);
        showFeedback(`✅ ${file.name} 로드 완료!`);
      }
    };
    reader.readAsText(file);
    // input 초기화 (같은 파일 다시 선택 가능)
    e.target.value = "";
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
      {/* 왼쪽: 입력 관련 */}
      <div className="flex items-center gap-1">
        <label className="px-2.5 py-1 text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white rounded transition-colors cursor-pointer">
          📂 파일 열기
          <input
            type="file"
            accept=".json,.yaml,.yml,.toml,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        <button
          onClick={handleCopyInput}
          disabled={!inputValue.trim()}
          className="px-2.5 py-1 text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          📋 입력 복사
        </button>
        <button
          onClick={() => onClear("")}
          disabled={!inputValue.trim()}
          className="px-2.5 py-1 text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          🗑️ 클리어
        </button>
      </div>

      {/* 가운데: 피드백 메시지 */}
      {copyFeedback && (
        <span className="text-xs text-emerald-400 font-medium animate-pulse">
          {copyFeedback}
        </span>
      )}

      {/* 오른쪽: 출력 관련 */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleCopyOutput}
          disabled={!outputValue.trim() || !!error}
          className="px-2.5 py-1 text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          📋 출력 복사
        </button>
        <button
          onClick={handleDownload}
          disabled={!outputValue.trim() || !!error}
          className="px-2.5 py-1 text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          💾 다운로드
        </button>
      </div>
    </div>
  );
}
