import React, { useState, useEffect } from 'react';
import { FiChevronRight, FiChevronDown, FiFile, FiFolder } from 'react-icons/fi';
import { useIde } from '../../context/IdeContext';
import { FileEntry } from '../../plugins/types';

interface FileTreeItem extends FileEntry {
  children?: FileTreeItem[];
  isExpanded?: boolean;
}

export const FileExplorer: React.FC = () => {
  const { workspace, fileSystem } = useIde();
  const [treeData, setTreeData] = useState<FileTreeItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWorkspace = async () => {
      const workspacePath = workspace.getWorkspaceFolder();
      if (workspacePath) {
        await loadDirectory(workspacePath);
      }
    };

    loadWorkspace();
  }, [workspace]);

  const loadDirectory = async (path: string) => {
    setLoading(true);
    try {
      const entries = await fileSystem.readDirectory(path);
      const sortedEntries = entries.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      setTreeData(sortedEntries);
    } catch (error) {
      console.error('Failed to load directory:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDirectory = async (item: FileTreeItem) => {
    if (item.type === 'directory') {
      const updatedTree = [...treeData];
      const updateNode = (nodes: FileTreeItem[], targetPath: string): boolean => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].path === targetPath) {
            if (!nodes[i].children && !nodes[i].isExpanded) {
              // Load children
              fileSystem.readDirectory(targetPath).then(children => {
                const sortedChildren = children.sort((a, b) => {
                  if (a.type !== b.type) {
                    return a.type === 'directory' ? -1 : 1;
                  }
                  return a.name.localeCompare(b.name);
                });
                nodes[i].children = sortedChildren;
                nodes[i].isExpanded = true;
                setTreeData([...updatedTree]);
              });
            } else {
              nodes[i].isExpanded = !nodes[i].isExpanded;
            }
            return true;
          }
          if (nodes[i].children) {
            if (updateNode(nodes[i].children, targetPath)) {
              return true;
            }
          }
        }
        return false;
      };

      updateNode(updatedTree, item.path);
      setTreeData(updatedTree);
    }
  };

  const renderTreeItem = (item: FileTreeItem, level: number = 0) => {
    const paddingLeft = level * 20;

    return (
      <div key={item.path}>
        <div
          className="tree-item"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '4px 8px',
            paddingLeft: `${paddingLeft}px`,
            cursor: 'pointer',
            userSelect: 'none',
            backgroundColor: 'transparent',
            transition: 'background-color 0.1s',
            ':hover': {
              backgroundColor: '#2a2d2e'
            }
          }}
          onClick={() => toggleDirectory(item)}
        >
          <span style={{ marginRight: '4px', display: 'flex', alignItems: 'center' }}>
            {item.type === 'directory' ? (
              <>
                {item.isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                <FiFolder style={{ marginLeft: '4px', color: '#e8ab53' }} />
              </>
            ) : (
              <FiFile style={{ marginLeft: '20px', color: '#cccccc' }} />
            )}
          </span>
          <span style={{ marginLeft: '4px' }}>{item.name}</span>
        </div>
        {item.children && item.isExpanded && (
          <div className="tree-children">
            {item.children.map(child => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="file-explorer" style={{ height: '100%', overflow: 'auto' }}>
      {loading ? (
        <div style={{ padding: '8px' }}>Loading...</div>
      ) : (
        <div className="tree-container">
          {treeData.map(item => renderTreeItem(item))}
        </div>
      )}
    </div>
  );
};
