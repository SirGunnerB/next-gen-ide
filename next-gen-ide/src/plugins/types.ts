import { Extension } from '@codemirror/state';

export interface Position {
  line: number;
  column: number;
}

export interface Selection {
  start: Position;
  end: Position;
}

export interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
}

export interface FileChangeEvent {
  type: 'created' | 'deleted' | 'modified';
  path: string;
}

export interface EditorInstance {
  getId(): string;
  getPath(): string | undefined;
  getLanguage(): string;
  getValue(): string;
  setValue(value: string): void;
  getSelection(): Selection;
  setSelection(selection: Selection): void;
  focus(): void;
}

export interface CompletionItem {
  label: string;
  kind: number;
  detail?: string;
  documentation?: string;
  insertText: string;
}

export interface CompletionProvider {
  triggerCharacters: string[];
  provideCompletions(document: string, position: Position): CompletionItem[];
}

export interface LanguageSupport {
  name: string;
  extensions: string[];
  getExtension(): Extension;
}

export interface CodeFormatter {
  languages: string[];
  format(document: string, options?: any): Promise<string>;
}

export interface Command {
  id: string;
  title: string;
  execute: (...args: any[]) => Promise<void>;
}

export interface CommandRegistry {
  registerCommand(command: Command): Disposable;
  executeCommand(commandId: string, ...args: any[]): Promise<void>;
}

export interface StatusBarItem {
  id: string;
  text: string;
  tooltip?: string;
  command?: string;
  priority?: number;
}

export interface StatusBarAPI {
  setMessage(message: string): void;
  setError(error: string): void;
  addItem(item: StatusBarItem): Disposable;
}

export interface FileSystemAPI {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  readDirectory(path: string): Promise<FileEntry[]>;
  watch(path: string, callback: (event: FileChangeEvent) => void): Disposable;
}

export interface EditorAPI {
  registerEditor(editor: EditorInstance): void;
  unregisterEditor(editorId: string): void;
  setActiveEditor(editorId: string | undefined): void;
  getCurrentEditor(): EditorInstance | undefined;
  getAllEditors(): EditorInstance[];
  onDidChangeActiveEditor(listener: (editor: EditorInstance | undefined) => void): Disposable;
  registerLanguageSupport(language: string, provider: LanguageSupport): Disposable;
  getLanguageSupport(language: string): Extension | undefined;
  registerCompletionProvider(provider: CompletionProvider): Disposable;
  registerFormatter(formatter: CodeFormatter): Disposable;
  formatDocument(document: string, language: string): Promise<string>;
}

export interface WorkspaceAPI {
  setWorkspaceFolder(path: string): void;
  getWorkspaceFolder(): string | undefined;
  onDidChangeWorkspaceFolder(listener: (path: string) => void): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface PluginContext {
  subscriptions: Disposable[];
  workspace: WorkspaceAPI;
  editor: EditorAPI;
  fileSystem: FileSystemAPI;
  statusBar: StatusBarAPI;
  commands: CommandRegistry;
}

export interface IdePlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  activate(context: PluginContext): Promise<void>;
  deactivate(): Promise<void>;
}
