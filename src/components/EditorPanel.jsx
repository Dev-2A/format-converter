import { useRef, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";

const FORMAT_LABELS = {
  auto: "Auto",
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
  errors = [],
  resolvedFormat,
}) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }, []);

  // 에러 마커를 useEffect 안에서만 업데이트
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    const model = editor.getModel();
    if (!model) return;

    const markers = errors.map((err) => ({
      severity: monaco.MarkerSeverity.Error,
      startLineNumber: err.line,
      startColumn: err.column,
      endLineNumber: err.line,
      endColumn: err.column + 10,
      message: err.message,
    }));

    monaco.editor.setModelMarkers(model, "validator", markers);
  }, [errors]);

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-300">{title}</span>
          {!readOnly && value?.trim() && (
            <span
              className={`w-2 h-2 rounded-full ${
                errors.length > 0 ? "bg-red-500" : "bg-emerald-500"
              }`}
              title={errors.length > 0 ? "문법 오류 있음" : "문법 정상"}
            />
          )}
          {/* Auto 모드일 때 감지된 포맷 표시 */}
          {selectedFormat === "auto" && resolvedFormat && value?.trim() && (
            <span className="text-xs text-emerald-400 font-mono">
              → {resolvedFormat.toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {formats.map((fmt) => (
            <button
              key={fmt}
              onClick={() => onFormatChange(fmt)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                selectedFormat === fmt
                  ? fmt === "auto"
                    ? "bg-blue-500 text-white"
                    : "bg-emerald-500 text-white"
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
          onMount={handleEditorDidMount}
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
            glyphMargin: !readOnly,
          }}
        />
      </div>

      {/* 에러 요약 */}
      {errors.length > 0 && (
        <div className="px-3 py-1.5 bg-red-900/30 border-t border-red-800 text-xs text-red-400 truncate">
          ❌ Line {errors[0].line}: {errors[0].message}
        </div>
      )}
    </div>
  );
}
