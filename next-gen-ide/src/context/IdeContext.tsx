import React, { createContext, useContext, useEffect, useState } from 'react';
import { WorkspaceService } from '../services/WorkspaceService';
import { FileSystemService } from '../services/FileSystemService';
import { EditorService } from '../services/EditorService';
import { PluginManager } from '../plugins/PluginManager';
import { TypeScriptPlugin } from '../plugins/typescript/TypeScriptPlugin';
import { FormatterPlugin } from '../plugins/formatter/FormatterPlugin';
import { FileExplorerPlugin } from '../plugins/explorer/FileExplorerPlugin';
import { PythonPlugin } from '../plugins/python/PythonPlugin';
import { HtmlPlugin } from '../plugins/html/HtmlPlugin';
import { TerminalPlugin } from '../plugins/terminal/TerminalPlugin';
import { StatusBarAPI, CommandRegistry } from '../plugins/types';

interface IdeContextType {
  workspace: WorkspaceService;
  fileSystem: FileSystemService;
  editor: EditorService;
  pluginManager: PluginManager;
}

const IdeContext = createContext<IdeContextType | undefined>(undefined);

export const useIde = () => {
  const context = useContext(IdeContext);
  if (!context) {
    throw new Error('useIde must be used within an IdeProvider');
  }
  return context;
};

interface IdeProviderProps {
  children: React.ReactNode;
}

export const IdeProvider: React.FC<IdeProviderProps> = ({ children }) => {
  const [services] = useState(() => {
    const workspace = new WorkspaceService();
    const fileSystem = new FileSystemService();
    const editor = new EditorService();
    
    const statusBar: StatusBarAPI = {
      setMessage: (message: string) => {
        console.log('Status:', message);
      },
      setError: (error: string) => {
        console.error('Error:', error);
      },
      addItem: (item) => ({
        dispose: () => {
          // Remove status bar item
        }
      })
    };

    const commands: CommandRegistry = {
      registerCommand: (command) => ({
        dispose: () => {
          // Unregister command
        }
      }),
      executeCommand: async (commandId: string, ...args: any[]) => {
        // Execute command
      }
    };

    const pluginContext = {
      subscriptions: [],
      workspace,
      editor,
      fileSystem,
      statusBar,
      commands
    };

    const pluginManager = new PluginManager(pluginContext);

    return {
      workspace,
      fileSystem,
      editor,
      pluginManager
    };
  });

  useEffect(() => {
    // Register built-in plugins
    const plugins = [
      new TypeScriptPlugin(),
      new FormatterPlugin(),
      new FileExplorerPlugin(),
      new PythonPlugin(),
      new HtmlPlugin(),
      new TerminalPlugin()
    ];

    plugins.forEach(plugin => {
      services.pluginManager.registerPlugin(plugin).catch(error => {
        console.error(`Failed to register plugin ${plugin.id}:`, error);
      });
    });
  }, []);

  return (
    <IdeContext.Provider value={services}>
      {children}
    </IdeContext.Provider>
  );
};
