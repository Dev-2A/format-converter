import { useRef, useCallback } from "react";
import { DiffEditor } from "@monaco-editor/react";

export default function DiffPanel({
  original,
  modified,
  language,
  theme = "dark",
}) {
  const diffEditorRef = useRef(null);

  const handleEditorDidMount = useCallback((editor) => {
    diffEditorRef.current = editor;
  }, []);

  const monacoTheme = theme === "dark" ? "vs-dark" : "light";

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full">
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{
          background: "var(--fc-bg-secondary)",
          borderColor: "var(--fc-border)",
        }}
      >
        <div className="flex items-center gap-4">
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--fc-text-primary)" }}
          >
            🔍 Diff View
          </span>
          <div
            className="flex items-center gap-3 text-xs"
            style={{ color: "var(--fc-text-muted)" }}
          >
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-red-900/60 border border-red-700" />
              삭제됨
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-emerald-900/60 border border-emerald-700" />
              추가됨
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <DiffEditor
          height="100%"
          language={language}
          original={original}
          modified={modified}
          theme={monacoTheme}
          onMount={handleEditorDidMount}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 12 },
            renderSideBySide: true,
            enableSplitViewResizing: true,
          }}
        />
      </div>
    </div>
  );
}
