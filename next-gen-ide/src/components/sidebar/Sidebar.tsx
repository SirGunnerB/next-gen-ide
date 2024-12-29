import React, { useState } from 'react';
import { FiFolder, FiSearch, FiGitBranch, FiTerminal } from 'react-icons/fi';
import { FileExplorer } from './FileExplorer';
import { Terminal } from '../terminal/Terminal';

type ViewType = 'files' | 'search' | 'git' | 'terminal';

export const Sidebar: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('files');

  const renderContent = () => {
    switch (activeView) {
      case 'files':
        return <FileExplorer />;
      case 'search':
        return <div>Search (Coming Soon)</div>;
      case 'git':
        return <div>Git (Coming Soon)</div>;
      case 'terminal':
        return <Terminal />;
      default:
        return null;
    }
  };

  return (
    <div className="sidebar" style={{ 
      height: '100%', 
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1e1e1e',
      color: '#fff' 
    }}>
      <div className="sidebar-icons" style={{
        width: '48px',
        borderRight: '1px solid #333',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8px 0'
      }}>
        <IconButton 
          icon={<FiFolder />} 
          isActive={activeView === 'files'}
          onClick={() => setActiveView('files')} 
        />
        <IconButton 
          icon={<FiSearch />} 
          isActive={activeView === 'search'}
          onClick={() => setActiveView('search')} 
        />
        <IconButton 
          icon={<FiGitBranch />} 
          isActive={activeView === 'git'}
          onClick={() => setActiveView('git')} 
        />
        <IconButton 
          icon={<FiTerminal />} 
          isActive={activeView === 'terminal'}
          onClick={() => setActiveView('terminal')} 
        />
      </div>
      <div className="sidebar-content" style={{
        flex: 1,
        padding: '8px',
        overflow: 'hidden'
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

interface IconButtonProps {
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, isActive, onClick }) => {
  return (
    <button
      style={{
        background: 'none',
        border: 'none',
        color: isActive ? '#fff' : '#858585',
        padding: '8px',
        cursor: 'pointer',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '20px',
        position: 'relative',
        ':hover': {
          color: '#fff'
        }
      }}
      onClick={onClick}
    >
      {icon}
      {isActive && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '20%',
            bottom: '20%',
            width: '2px',
            backgroundColor: '#fff',
            borderRadius: '0 2px 2px 0'
          }}
        />
      )}
    </button>
  );
};
