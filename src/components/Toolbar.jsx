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

  const handleCopyOutput = async () => {
    if (!outputValue.trim()) return;
    try {
      await navigator.clipboard.writeText(outputValue);
      showFeedback("✅ 출력 복사 완료!");
    } catch {
      showFeedback("❌ 복사 실패");
    }
  };

  const handleCopyInput = async () => {
    if (!inputValue.trim()) return;
    try {
      await navigator.clipboard.writeText(inputValue);
      showFeedback("✅ 입력 복사 완료!");
    } catch {
      showFeedback("❌ 복사 실패");
    }
  };

  const extMap = { json: "json", yaml: "yaml", toml: "toml" };

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
    e.target.value = "";
  };

  const btnBase =
    "px-2.5 py-1 text-xs font-medium rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed";

  return (
    <div
      className="flex items-center justify-between px-4 py-2 border-b"
      style={{
        background: "var(--fc-bg-secondary)",
        borderColor: "var(--fc-border)",
      }}
    >
      {/* 왼쪽 */}
      <div className="flex items-center gap-1">
        <label
          className={`${btnBase} cursor-pointer`}
          style={{
            background: "var(--fc-bg-primary)",
            color: "var(--fc-text-secondary)",
          }}
        >
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
          className={btnBase}
          style={{
            background: "var(--fc-bg-primary)",
            color: "var(--fc-text-secondary)",
          }}
        >
          📋 입력 복사
        </button>
        <button
          onClick={() => onClear("")}
          disabled={!inputValue.trim()}
          className={btnBase}
          style={{
            background: "var(--fc-bg-primary)",
            color: "var(--fc-text-secondary)",
          }}
        >
          🗑️ 클리어
        </button>
      </div>

      {/* 가운데: 피드백 */}
      {copyFeedback && (
        <span
          className="text-xs font-medium animate-fade-in-out"
          style={{ color: "var(--fc-accent)" }}
        >
          {copyFeedback}
        </span>
      )}

      {/* 오른쪽 */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleCopyOutput}
          disabled={!outputValue.trim() || !!error}
          className={btnBase}
          style={{
            background: "var(--fc-bg-primary)",
            color: "var(--fc-text-secondary)",
          }}
        >
          📋 출력 복사
        </button>
        <button
          onClick={handleDownload}
          disabled={!outputValue.trim() || !!error}
          className={btnBase}
          style={{
            background: "var(--fc-bg-primary)",
            color: "var(--fc-text-secondary)",
          }}
        >
          💾 다운로드
        </button>
      </div>
    </div>
  );
}
