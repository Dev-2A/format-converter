import { useRef, useCallback } from "react";
import { DiffEditor } from "@monaco-editor/react";

export default function DiffPanel({ original, modified, language }) {
  const diffEditorRef = useRef(null);

  const handleEditorDidMount = useCallback((editor) => {
    diffEditorRef.current = editor;
  }, []);

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-300">
            🔍 Diff View
          </span>
          <div className="flex items-center gap-3 text-xs text-gray-500">
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

      {/* Diff 에디터 */}
      <div className="flex-1 min-h-0">
        <DiffEditor
          height="100%"
          language={language}
          original={original}
          modified={modified}
          theme="vs-dark"
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
