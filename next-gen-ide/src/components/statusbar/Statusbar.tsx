import React from 'react';

export const Statusbar: React.FC = () => {
  return (
    <div className="statusbar" style={{
      height: '22px',
      backgroundColor: '#007acc',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      padding: '0 8px',
      fontSize: '12px'
    }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <span>Ready</span>
        <span>Line: 1, Column: 1</span>
        <span>UTF-8</span>
        <span>TypeScript React</span>
      </div>
    </div>
  );
};
