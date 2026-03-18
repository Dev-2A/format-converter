import { useState } from "react";
import EditorPanel from "./components/EditorPanel";

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
  const [inputFormat, setInputFormat] = useState("json");
  const [outputFormat, setOutputFormat] = useState("yaml");
  const [inputValue, setInputValue] = useState(SAMPLE_JSON);
  const [outputValue, setOutputValue] = useState(
    "// 변환 결과가 여기에 표시됩니다",
  );

  // 입력 포맷 변경 시 출력 포맷이 같으면 자동 전환
  const handleInputFormatChange = (fmt) => {
    setInputFormat(fmt);
    if (fmt === outputFormat) {
      const formats = ["json", "yaml", "toml"];
      const other = formats.find((f) => f !== fmt);
      setOutputFormat(other);
    }
  };

  const handleOutputFormatChange = (fmt) => {
    setOutputFormat(fmt);
    if (fmt === inputFormat) {
      const formats = ["json", "yaml", "toml"];
      const other = formats.find((f) => f !== fmt);
      setInputFormat(other);
    }
  };

  // Monaco language 매핑
  const langMap = { json: "json", yaml: "yaml", toml: "plaintext" };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-center px-6 py-3 bg-gray-800 border-b border-gray-700">
        <h1 className="text-lg font-bold text-emerald-400">
          🔄 Format Converter
        </h1>
      </header>

      {/* 메인 2패널 */}
      <main className="flex flex-1 min-h-0">
        {/* 왼쪽: 입력 */}
        <EditorPanel
          title="📝 Input"
          value={inputValue}
          onChange={(val) => setInputValue(val || "")}
          language={langMap[inputFormat]}
          formats={["json", "yaml", "toml"]}
          selectedFormat={inputFormat}
          onFormatChange={handleInputFormatChange}
        />

        {/* 중앙 구분선 + 변환 버튼 */}
        <div className="flex flex-col items-center justify-center w-12 bg-gray-800 border-x border-gray-700">
          <button
            className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-gray-700 rounded transition-colors"
            title="변환"
          >
            →
          </button>
        </div>

        {/* 오른쪽: 출력 */}
        <EditorPanel
          title="📄 Output"
          value={outputValue}
          language={langMap[outputFormat]}
          readOnly
          formats={["json", "yaml", "toml"]}
          selectedFormat={outputFormat}
          onFormatChange={handleOutputFormatChange}
        />
      </main>

      {/* 하단 상태바 */}
      <footer className="flex items-center justify-between px-4 py-1.5 bg-gray-800 border-t border-gray-700 text-xs text-gray-500">
        <span>
          {inputFormat.toUpperCase()} → {outputFormat.toUpperCase()}
        </span>
        <span>백엔드 없이 브라우저에서 동작합니다</span>
      </footer>
    </div>
  );
}
