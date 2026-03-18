import EditorPanel from "./components/EditorPanel";
import DiffPanel from "./components/DiffPanel";
import Toolbar from "./components/Toolbar";
import useConverter from "./hooks/useConverter";
import useTheme from "./hooks/useTheme";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";

export default function App() {
  const {
    inputValue,
    setInputValue,
    inputFormat,
    resolvedInputFormat,
    outputFormat,
    outputValue,
    error,
    inputErrors,
    handleInputFormatChange,
    handleOutputFormatChange,
    swap,
    loadSample,
    diffMode,
    diffOriginal,
    diffModified,
    toggleDiff,
  } = useConverter();

  const { theme, toggleTheme } = useTheme();

  useKeyboardShortcuts({
    onSwap: swap,
    onToggleDiff: toggleDiff,
    onClear: () => setInputValue(""),
  });

  const langMap = { json: "json", yaml: "yaml", toml: "plaintext" };

  const displayInput = resolvedInputFormat.toUpperCase();
  const displayOutput =
    resolvedInputFormat === outputFormat
      ? ["json", "yaml", "toml"]
          .find((f) => f !== resolvedInputFormat)
          ?.toUpperCase()
      : outputFormat.toUpperCase();

  return (
    <div
      className="h-screen flex flex-col"
      style={{
        background: "var(--fc-bg-primary)",
        color: "var(--fc-text-primary)",
      }}
    >
      {/* 상단 헤더 */}
      <header
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{
          background: "var(--fc-bg-secondary)",
          borderColor: "var(--fc-border)",
        }}
      >
        <h1 className="text-lg font-bold" style={{ color: "var(--fc-accent)" }}>
          🔄 Format Converter
        </h1>
        <div className="flex items-center gap-2">
          {/* 단축키 힌트 */}
          <span
            className="text-xs hidden md:inline"
            style={{ color: "var(--fc-text-muted)" }}
          >
            Ctrl+E 스왑 · Ctrl+D Diff
          </span>
          <button
            onClick={toggleTheme}
            className="px-3 py-1 text-xs font-medium rounded transition-colors"
            style={{
              background: "var(--fc-bg-primary)",
              color: "var(--fc-text-secondary)",
            }}
          >
            {theme === "dark" ? "☀️ 라이트" : "🌙 다크"}
          </button>
          <button
            onClick={toggleDiff}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              diffMode ? "bg-amber-500 text-white" : ""
            }`}
            style={
              !diffMode
                ? {
                    background: "var(--fc-bg-primary)",
                    color: "var(--fc-text-secondary)",
                  }
                : undefined
            }
          >
            {diffMode ? "🔍 Diff ON" : "🔍 Diff"}
          </button>
          <button
            onClick={loadSample}
            className="px-3 py-1 text-xs font-medium rounded transition-colors"
            style={{
              background: "var(--fc-bg-primary)",
              color: "var(--fc-text-secondary)",
            }}
          >
            📋 샘플
          </button>
        </div>
      </header>

      {/* 툴바 */}
      {!diffMode && (
        <Toolbar
          inputValue={inputValue}
          outputValue={outputValue}
          resolvedInputFormat={resolvedInputFormat}
          outputFormat={outputFormat}
          onClear={setInputValue}
          error={error}
        />
      )}

      {/* 메인 영역 */}
      <main className="flex flex-1 min-h-0">
        {diffMode ? (
          <DiffPanel
            original={diffOriginal}
            modified={diffModified}
            language={langMap[outputFormat]}
            theme={theme}
          />
        ) : (
          <>
            <EditorPanel
              title="📝 Input"
              value={inputValue}
              onChange={(val) => setInputValue(val || "")}
              language={langMap[resolvedInputFormat]}
              formats={["auto", "json", "yaml", "toml"]}
              selectedFormat={inputFormat}
              onFormatChange={handleInputFormatChange}
              errors={inputErrors}
              resolvedFormat={resolvedInputFormat}
              theme={theme}
            />

            <div
              className="flex flex-col items-center justify-center w-12 border-x"
              style={{
                background: "var(--fc-bg-secondary)",
                borderColor: "var(--fc-border)",
              }}
            >
              <button
                onClick={swap}
                className="p-2 rounded transition-colors hover:opacity-80"
                style={{ color: "var(--fc-accent)" }}
                title="입출력 스왑 (Ctrl+E)"
              >
                ⇄
              </button>
            </div>

            <EditorPanel
              title="📄 Output"
              value={outputValue}
              language={langMap[outputFormat]}
              readOnly
              formats={["json", "yaml", "toml"]}
              selectedFormat={outputFormat}
              onFormatChange={handleOutputFormatChange}
              theme={theme}
            />
          </>
        )}
      </main>

      {/* 하단 상태바 */}
      <footer
        className="flex items-center justify-between px-4 py-1.5 border-t text-xs"
        style={{
          background: "var(--fc-bg-secondary)",
          borderColor: "var(--fc-border)",
          color: "var(--fc-text-muted)",
        }}
      >
        <span>
          {displayInput} → {displayOutput}
          {inputFormat === "auto" && " · 🔍 자동 감지"}
          {diffMode && " · 📊 Diff 모드"}
          {error && " · ❌ 변환 실패"}
          {!error && !diffMode && inputValue.trim() && " · ✅ 변환 성공"}
        </span>
        <span>백엔드 없이 브라우저에서 동작합니다</span>
      </footer>
    </div>
  );
}
