import React, { useState, useEffect } from 'react';
import { CodeMirrorEditor } from './CodeMirrorEditor';
import { useIde } from '../../context/IdeContext';
import { EditorInstance, Position, Selection } from '../../plugins/types';

interface Tab {
  id: string;
  title: string;
  language: string;
  content: string;
  path?: string;
}

class EditorInstanceImpl implements EditorInstance {
  constructor(
    private id: string,
    private path: string | undefined,
    private language: string,
    private content: string,
    private onChange: (content: string) => void
  ) {}

  getId = () => this.id;
  getPath = () => this.path;
  getLanguage = () => this.language;
  getValue = () => this.content;
  setValue = (value: string) => {
    this.content = value;
    this.onChange(value);
  };
  getSelection = (): Selection => ({ start: { line: 0, column: 0 }, end: { line: 0, column: 0 } });
  setSelection = (selection: Selection) => {};
  focus = () => {};
}

export const Editor: React.FC = () => {
  const { editor } = useIde();
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      title: 'example.ts',
      language: 'typescript',
      content: '// Welcome to Next-Gen IDE\n\nfunction hello() {\n  console.log("Hello, World!");\n}\n',
    },
  ]);
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  useEffect(() => {
    // Register the editor instance with the editor service
    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (currentTab) {
      const instance = new EditorInstanceImpl(
        currentTab.id,
        currentTab.path,
        currentTab.language,
        currentTab.content,
        (content: string) => {
          setTabs(tabs.map(tab =>
            tab.id === activeTab ? { ...tab, content } : tab
          ));
        }
      );
      editor.registerEditor(instance);
      editor.setActiveEditor(instance.getId());

      return () => {
        editor.unregisterEditor(instance.getId());
      };
    }
  }, [activeTab, tabs]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="editor-container" style={{
      height: '100%',
      backgroundColor: '#1e1e1e',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="editor-tabs" style={{
        height: '35px',
        backgroundColor: '#252526',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        gap: '2px'
      }}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            style={{
              padding: '4px 12px',
              backgroundColor: tab.id === activeTab ? '#1e1e1e' : '#2d2d2d',
              cursor: 'pointer',
              borderRadius: '4px 4px 0 0',
              fontSize: '13px'
            }}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.title}
          </div>
        ))}
      </div>
      <div className="editor-content" style={{ flex: 1, overflow: 'hidden' }}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            style={{
              display: tab.id === activeTab ? 'block' : 'none',
              height: '100%'
            }}
          >
            <CodeMirrorEditor
              initialDoc={tab.content}
              language={tab.language}
              onChange={(content) => {
                setTabs(tabs.map(t =>
                  t.id === tab.id ? { ...t, content } : t
                ));
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
