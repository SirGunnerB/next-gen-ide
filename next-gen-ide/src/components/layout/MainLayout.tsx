import React from 'react';
import SplitPane from 'react-split-pane';
import { Sidebar } from '../sidebar/Sidebar';
import { Editor } from '../editor/Editor';
import { Toolbar } from '../toolbar/Toolbar';
import { Statusbar } from '../statusbar/Statusbar';

export const MainLayout: React.FC = () => {
  return (
    <div className="ide-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <SplitPane
          split="vertical"
          minSize={200}
          defaultSize={250}
          style={{ position: 'relative' }}
        >
          <Sidebar />
          <Editor />
        </SplitPane>
      </div>
      <Statusbar />
    </div>
  );
};
