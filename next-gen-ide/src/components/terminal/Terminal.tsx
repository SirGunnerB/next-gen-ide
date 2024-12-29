import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { SearchAddon } from 'xterm-addon-search';
import { useIde } from '../../context/IdeContext';
import 'xterm/css/xterm.css';

interface TerminalTabProps {
  id: string;
  title: string;
}

export const Terminal: React.FC = () => {
  const { pluginManager } = useIde();
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<XTerm | null>(null);
  const [tabs, setTabs] = useState<TerminalTabProps[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (terminalRef.current && !terminal) {
      const term = new XTerm({
        theme: {
          background: '#1e1e1e',
          foreground: '#d4d4d4',
          cursor: '#d4d4d4',
          selection: '#264f78',
          black: '#1e1e1e',
          red: '#f44747',
          green: '#6a9955',
          yellow: '#d7ba7d',
          blue: '#569cd6',
          magenta: '#c586c0',
          cyan: '#4dc9b0',
          white: '#d4d4d4',
          brightBlack: '#808080',
          brightRed: '#f44747',
          brightGreen: '#6a9955',
          brightYellow: '#d7ba7d',
          brightBlue: '#569cd6',
          brightMagenta: '#c586c0',
          brightCyan: '#4dc9b0',
          brightWhite: '#d4d4d4',
        },
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontSize: 14,
        lineHeight: 1.2,
        cursorBlink: true,
        cursorStyle: 'block',
      });

      // Add addons
      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();
      const searchAddon = new SearchAddon();

      term.loadAddon(fitAddon);
      term.loadAddon(webLinksAddon);
      term.loadAddon(searchAddon);

      term.open(terminalRef.current);
      fitAddon.fit();

      // Handle window resize
      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
      });
      resizeObserver.observe(terminalRef.current);

      setTerminal(term);

      // Create initial terminal session
      createNewTerminal();

      return () => {
        term.dispose();
        resizeObserver.disconnect();
      };
    }
  }, [terminalRef.current]);

  const createNewTerminal = async () => {
    try {
      const terminalPlugin = pluginManager.getPlugin('terminal');
      if (terminalPlugin) {
        const sessionId = await terminalPlugin.createTerminalSession();
        const newTab: TerminalTabProps = {
          id: sessionId,
          title: `Terminal ${tabs.length + 1}`,
        };
        setTabs(prev => [...prev, newTab]);
        setActiveTab(sessionId);
      }
    } catch (error) {
      console.error('Failed to create terminal session:', error);
    }
  };

  const closeTerminal = async (tabId: string) => {
    try {
      const terminalPlugin = pluginManager.getPlugin('terminal');
      if (terminalPlugin) {
        await terminalPlugin.closeTerminalSession(tabId);
        setTabs(prev => prev.filter(tab => tab.id !== tabId));
        if (activeTab === tabId) {
          setActiveTab(tabs[0]?.id || null);
        }
      }
    } catch (error) {
      console.error('Failed to close terminal session:', error);
    }
  };

  return (
    <div className="terminal-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="terminal-tabs" style={{
        display: 'flex',
        backgroundColor: '#252526',
        borderBottom: '1px solid #333',
        padding: '4px'
      }}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            style={{
              padding: '4px 12px',
              backgroundColor: activeTab === tab.id ? '#1e1e1e' : '#2d2d2d',
              cursor: 'pointer',
              borderRadius: '4px 4px 0 0',
              marginRight: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.title}</span>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#858585',
                cursor: 'pointer',
                padding: '2px',
                fontSize: '12px'
              }}
              onClick={(e) => {
                e.stopPropagation();
                closeTerminal(tab.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#858585',
            cursor: 'pointer',
            padding: '4px 8px'
          }}
          onClick={createNewTerminal}
        >
          +
        </button>
      </div>
      <div ref={terminalRef} style={{ flex: 1 }} />
    </div>
  );
};
