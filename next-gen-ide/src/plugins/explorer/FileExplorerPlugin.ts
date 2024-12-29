import { IdePlugin, PluginContext, FileEntry } from '../types';

export class FileExplorerPlugin implements IdePlugin {
  id = 'file-explorer';
  name = 'File Explorer';
  version = '1.0.0';
  description = 'Provides file explorer functionality';

  private context?: PluginContext;

  async activate(context: PluginContext): Promise<void> {
    this.context = context;

    // Watch for workspace changes
    const workspaceDisposable = context.workspace.onDidChangeWorkspaceFolder(
      async (path: string) => {
        await this.refreshExplorer(path);
      }
    );
    context.subscriptions.push(workspaceDisposable);

    // Initial load if workspace is already set
    const currentWorkspace = context.workspace.getWorkspaceFolder();
    if (currentWorkspace) {
      await this.refreshExplorer(currentWorkspace);
    }
  }

  private async refreshExplorer(path: string) {
    if (!this.context) return;

    try {
      const entries = await this.context.fileSystem.readDirectory(path);
      await this.displayEntries(entries);
    } catch (error) {
      console.error('Failed to refresh explorer:', error);
      this.context.statusBar.setError('Failed to refresh file explorer');
    }
  }

  private async displayEntries(entries: FileEntry[]) {
    if (!this.context) return;

    // Sort entries: directories first, then files, both alphabetically
    const sortedEntries = entries.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    // In a real implementation, you would update the UI
    // For now, we'll just log the entries
    console.log('File Explorer Contents:', sortedEntries);
  }

  async deactivate(): Promise<void> {
    // Cleanup will be handled by disposing subscriptions
  }
}
