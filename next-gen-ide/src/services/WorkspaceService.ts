import { WorkspaceAPI, Disposable } from '../plugins/types';

export class WorkspaceService implements WorkspaceAPI {
  private workspaceFolder: string | undefined;
  private listeners: ((path: string) => void)[] = [];

  constructor() {
    // Initialize with no workspace
  }

  setWorkspaceFolder(path: string) {
    this.workspaceFolder = path;
    this.notifyListeners(path);
  }

  getWorkspaceFolder(): string | undefined {
    return this.workspaceFolder;
  }

  onDidChangeWorkspaceFolder(listener: (path: string) => void): Disposable {
    this.listeners.push(listener);
    return {
      dispose: () => {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
          this.listeners.splice(index, 1);
        }
      },
    };
  }

  private notifyListeners(path: string) {
    this.listeners.forEach(listener => listener(path));
  }
}
