import React from 'react';

export const Toolbar: React.FC = () => {
  return (
    <div className="toolbar" style={{
      height: '30px',
      backgroundColor: '#333',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      padding: '0 8px'
    }}>
      <div className="menu-items" style={{ display: 'flex', gap: '16px' }}>
        <MenuItem label="File" />
        <MenuItem label="Edit" />
        <MenuItem label="View" />
        <MenuItem label="Run" />
        <MenuItem label="Terminal" />
        <MenuItem label="Help" />
      </div>
    </div>
  );
};

const MenuItem: React.FC<{ label: string }> = ({ label }) => {
  return (
    <button style={{
      background: 'none',
      border: 'none',
      color: '#fff',
      padding: '4px 8px',
      cursor: 'pointer'
    }}>
      {label}
    </button>
  );
};
