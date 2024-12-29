import { FileSystemAPI, FileEntry, FileChangeEvent, Disposable } from '../plugins/types';
import { invoke } from '@tauri-apps/api/tauri';
import { readTextFile, writeTextFile } from '@tauri-apps/api/fs';
import { listen } from '@tauri-apps/api/event';

export class FileSystemService implements FileSystemAPI {
  private watchers: Map<string, Set<(event: FileChangeEvent) => void>> = new Map();

  async readFile(path: string): Promise<string> {
    try {
      return await readTextFile(path);
    } catch (error) {
      console.error('Failed to read file:', error);
      throw error;
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    try {
      await writeTextFile(path, content);
    } catch (error) {
      console.error('Failed to write file:', error);
      throw error;
    }
  }

  async readDirectory(path: string): Promise<FileEntry[]> {
    try {
      const entries = await invoke<any[]>('read_dir', { path });
      return entries.map(entry => ({
        name: entry.name,
        path: entry.path,
        type: entry.isFile ? 'file' : 'directory'
      }));
    } catch (error) {
      console.error('Failed to read directory:', error);
      throw error;
    }
  }

  watch(path: string, callback: (event: FileChangeEvent) => void): Disposable {
    if (!this.watchers.has(path)) {
      this.watchers.set(path, new Set());
      this.setupWatcher(path);
    }

    const pathWatchers = this.watchers.get(path)!;
    pathWatchers.add(callback);

    return {
      dispose: () => {
        const watchers = this.watchers.get(path);
        if (watchers) {
          watchers.delete(callback);
          if (watchers.size === 0) {
            this.watchers.delete(path);
          }
        }
      }
    };
  }

  private async setupWatcher(path: string) {
    try {
      const unlisten = await listen('fs-event', (event: any) => {
        const watchers = this.watchers.get(path);
        if (watchers && event.payload.path.startsWith(path)) {
          const fsEvent: FileChangeEvent = {
            type: event.payload.type,
            path: event.payload.path
          };
          watchers.forEach(callback => callback(fsEvent));
        }
      });

      // Start watching the directory
      await invoke('watch_path', { path });

      return unlisten;
    } catch (error) {
      console.error('Failed to setup file watcher:', error);
      throw error;
    }
  }
}
