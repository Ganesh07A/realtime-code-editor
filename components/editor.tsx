"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { useRoom } from "./room-provider";
import { yCollab } from "y-codemirror.next";
import * as Y from "yjs";

import { Extension } from "@codemirror/state";

const languageExtensions: Record<string, Extension> = {
  javascript: javascript({ jsx: true, typescript: true }),
  python: python(),
  java: java(),
  cpp: cpp(),
};

export function Editor() {
  const { provider, doc: yDoc } = useRoom();
  const searchParams = useSearchParams();
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!provider || !yDoc) return;

    const configMap = yDoc.getMap("config");
    
    const updateLanguage = () => {
      // Logic for updating language remains but we don't need a local state variable
      // if it's only used inside the extension rebuilder.
    };

    configMap.observe(updateLanguage);
    updateLanguage();

    const ytext = yDoc.getText("codemirror");
    const undoManager = new Y.UndoManager(ytext);

    // Setup random color for cursor, but use provided name
    const username = searchParams.get("name") || ('User ' + Math.floor(Math.random() * 100));
    const color = '#' + Math.floor(Math.random()*16777215).toString(16);
    provider.awareness.setLocalStateField('user', {
      name: username,
      color: color,
      colorLight: color + '33',
    });

    const collabExtension = yCollab(ytext, provider.awareness, { undoManager });

    // Use a function to rebuild extensions when language changes
    const rebuildExtensions = () => {
      const currentLang = (configMap.get("language") as string) || "javascript";
      setExtensions([
        languageExtensions[currentLang] || languageExtensions.javascript,
        collabExtension
      ]);
    };

    configMap.observe(rebuildExtensions);
    rebuildExtensions();

    return () => {
      configMap.unobserve(updateLanguage);
      configMap.unobserve(rebuildExtensions);
    };
  }, [provider, yDoc, searchParams]);

  if (!mounted) return null;

  return (
    <div className="w-full h-full relative border-t lg:border-t-0 lg:border-l border-slate-200">
      {!provider && (
        <div className="absolute inset-0 z-10 bg-white/50 flex items-center justify-center backdrop-blur-sm">
          <span className="text-slate-500 font-medium">Connecting...</span>
        </div>
      )}
      <CodeMirror
        height="100%"
        theme="light"
        extensions={extensions}
        className="h-full text-sm font-mono overflow-auto bg-white [&_.cm-editor]:h-full [&_.cm-scroller]:font-mono"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
    </div>
  );
}
