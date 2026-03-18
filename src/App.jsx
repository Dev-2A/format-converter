import EditorPanel from './components/EditorPanel';
import useConverter from './hooks/useConverter';

const SAMPLE_JSON = `{
  "name": "format-converter",
  "version": "0.1.0",
  "description": "JSON, YAML, TOML 만능 변환기",
  "features": [
    "실시간 변환",
    "문법 검증",
    "diff 뷰"
  ],
  "author": {
    "name": "Dev-2A",
    "github": "https://github.com/Dev-2A"
  }
}`;

export default function App() {
  const {
    inputValue,
    setInputValue,
    inputFormat,
    outputFormat,
    outputValue,
    error,
    handleInputFormatChange,
    handleOutputFormatChange,
    swap,
  } = useConverter(SAMPLE_JSON);

  const langMap = { json: 'json', yaml: 'yaml', toml: 'plaintext' };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-center px-6 py-3 bg-gray-800 border-b border-gray-700">
        <h1 className="text-lg font-bold text-emerald-400">
          🔄 Format Converter
        </h1>
      </header>

      {/* 에러 배너 */}
      {error && (
        <div className="px-4 py-2 bg-red-900/50 border-b border-red-700 text-red-300 text-sm font-mono">
          ⚠️ {error}
        </div>
      )}

      {/* 메인 2패널 */}
      <main className="flex flex-1 min-h-0">
        {/* 왼쪽: 입력 */}
        <EditorPanel
          title="📝 Input"
          value={inputValue}
          onChange={(val) => setInputValue(val || '')}
          language={langMap[inputFormat]}
          formats={['json', 'yaml', 'toml']}
          selectedFormat={inputFormat}
          onFormatChange={handleInputFormatChange}
        />

        {/* 중앙 구분선 + 스왑 버튼 */}
        <div className="flex flex-col items-center justify-center w-12 bg-gray-800 border-x border-gray-700 gap-2">
          <button
            onClick={swap}
            className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-gray-700 rounded transition-colors"
            title="입출력 스왑"
          >
            ⇄
          </button>
        </div>

        {/* 오른쪽: 출력 */}
        <EditorPanel
          title="📄 Output"
          value={outputValue}
          language={langMap[outputFormat]}
          readOnly
          formats={['json', 'yaml', 'toml']}
          selectedFormat={outputFormat}
          onFormatChange={handleOutputFormatChange}
        />
      </main>

      {/* 하단 상태바 */}
      <footer className="flex items-center justify-between px-4 py-1.5 bg-gray-800 border-t border-gray-700 text-xs text-gray-500">
        <span>
          {inputFormat.toUpperCase()} → {outputFormat.toUpperCase()}
          {error && ' · ❌ 변환 실패'}
          {!error && inputValue.trim() && ' · ✅ 변환 성공'}
        </span>
        <span>백엔드 없이 브라우저에서 동작합니다</span>
      </footer>
    </div>
  );
}