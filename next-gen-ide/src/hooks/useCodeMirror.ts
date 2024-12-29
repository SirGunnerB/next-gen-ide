import { useEffect, useRef, useState } from 'react';
import { EditorState, Extension } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { php } from '@codemirror/lang-php';
import { sql } from '@codemirror/lang-sql';

interface UseCodeMirrorProps {
  initialDoc?: string;
  language?: string;
}

const languageExtensions: { [key: string]: () => Extension } = {
  javascript: javascript,
  typescript: () => javascript({ typescript: true }),
  python: python,
  html: html,
  css: css,
  php: php,
  sql: sql,
};

export const useCodeMirror = ({ initialDoc = '', language = 'javascript' }: UseCodeMirrorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!element) return;

    // Get language extension
    const langExt = languageExtensions[language] ? languageExtensions[language]() : [];

    const extensions = [
      lineNumbers(),
      highlightActiveLineGutter(),
      history(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      oneDark,
      EditorState.tabSize.of(2),
      langExt,
    ];

    const state = EditorState.create({
      doc: initialDoc,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: element,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [element, initialDoc, language]);

  const setContent = (content: string) => {
    if (viewRef.current) {
      const transaction = viewRef.current.state.update({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: content,
        },
      });
      viewRef.current.dispatch(transaction);
    }
  };

  return { ref: editorRef, setElement, setContent, view: viewRef.current };
};
