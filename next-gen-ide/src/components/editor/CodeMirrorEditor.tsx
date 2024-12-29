import React, { useEffect } from 'react';
import { EditorView } from '@codemirror/view';
import { useCodeMirror } from '../../hooks/useCodeMirror';

interface CodeMirrorEditorProps {
  initialDoc?: string;
  language?: string;
  onChange?: (value: string) => void;
}

export const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({
  initialDoc = '',
  language = 'javascript',
  onChange,
}) => {
  const { ref, setElement, view } = useCodeMirror({
    initialDoc,
    language,
  });

  useEffect(() => {
    if (ref.current) {
      setElement(ref.current);
    }
  }, [ref.current]);

  useEffect(() => {
    if (view && onChange) {
      const listener = view.state.field(EditorView.updateListener, false);
      if (listener) {
        onChange(view.state.doc.toString());
      }
    }
  }, [view?.state.doc.toString()]);

  return (
    <div
      ref={ref}
      style={{
        flex: 1,
        overflow: 'auto',
        backgroundColor: '#282c34',
        fontSize: '14px',
      }}
    />
  );
};
