import { Editor } from "@monaco-editor/react";

const FORMAT_LABELS = {
  json: "JSON",
  yaml: "YAML",
  toml: "TOML",
};

export default function EditorPanel({
  title,
  value,
  onChange,
  language,
  readOnly = false,
  formats,
  selectedFormat,
  onFormatChange,
}) {
  return (
    <div className="flex flex-col flex-1 min-w-0 h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-sm font-semibold text-gray-300">{title}</span>
        <div className="flex gap-1">
          {formats.map((fmt) => (
            <button
              key={fmt}
              onClick={() => onFormatChange(fmt)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                selectedFormat === fmt
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-200"
              }`}
            >
              {FORMAT_LABELS[fmt]}
            </button>
          ))}
        </div>
      </div>

      {/* 에디터 */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={onChange}
          theme="vs-dark"
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 12 },
          }}
        />
      </div>
    </div>
  );
}
