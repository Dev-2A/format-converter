import EditorPanel from "./components/EditorPanel";
import DiffPanel from "./components/DiffPanel";
import useConverter from "./hooks/useConverter";

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

  const langMap = { json: "json", yaml: "yaml", toml: "plaintext" };

  const displayInput = resolvedInputFormat.toUpperCase();
  const displayOutput =
    resolvedInputFormat === outputFormat
      ? ["json", "yaml", "toml"]
          .find((f) => f !== resolvedInputFormat)
          ?.toUpperCase()
      : outputFormat.toUpperCase();

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between px-6 py-3 bg-gray-800 border-b border-gray-700">
        <h1 className="text-lg font-bold text-emerald-400">
          🔄 Format Converter
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDiff}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              diffMode
                ? "bg-amber-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
            }`}
          >
            {diffMode ? "🔍 Diff ON" : "🔍 Diff"}
          </button>
          <button
            onClick={loadSample}
            className="px-3 py-1 text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white rounded transition-colors"
          >
            📋 샘플 데이터
          </button>
        </div>
      </header>

      {/* 메인 영역 */}
      <main className="flex flex-1 min-h-0">
        {diffMode ? (
          /* Diff 뷰 모드 */
          <DiffPanel
            original={diffOriginal}
            modified={diffModified}
            language={langMap[outputFormat]}
          />
        ) : (
          /* 일반 변환 모드 */
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
            />

            <div className="flex flex-col items-center justify-center w-12 bg-gray-800 border-x border-gray-700 gap-2">
              <button
                onClick={swap}
                className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-gray-700 rounded transition-colors"
                title="입출력 스왑"
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
            />
          </>
        )}
      </main>

      {/* 하단 상태바 */}
      <footer className="flex items-center justify-between px-4 py-1.5 bg-gray-800 border-t border-gray-700 text-xs text-gray-500">
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
