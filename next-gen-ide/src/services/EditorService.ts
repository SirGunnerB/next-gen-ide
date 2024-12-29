import {
  EditorAPI,
  EditorInstance,
  Disposable,
  LanguageSupport,
  CompletionProvider,
  CodeFormatter,
  Selection,
  Position
} from '../plugins/types';
import { Extension } from '@codemirror/state';

export class EditorService implements EditorAPI {
  private editors: Map<string, EditorInstance> = new Map();
  private activeEditor?: string;
  private changeListeners: ((editor: EditorInstance | undefined) => void)[] = [];
  private languageSupports: Map<string, LanguageSupport> = new Map();
  private completionProviders: CompletionProvider[] = [];
  private formatters: Map<string, CodeFormatter[]> = new Map();

  registerEditor(editor: EditorInstance): void {
    this.editors.set(editor.getId(), editor);
  }

  unregisterEditor(editorId: string): void {
    this.editors.delete(editorId);
    if (this.activeEditor === editorId) {
      this.setActiveEditor(undefined);
    }
  }

  setActiveEditor(editorId: string | undefined): void {
    this.activeEditor = editorId;
    const editor = editorId ? this.editors.get(editorId) : undefined;
    this.notifyChangeListeners(editor);
  }

  getCurrentEditor(): EditorInstance | undefined {
    return this.activeEditor ? this.editors.get(this.activeEditor) : undefined;
  }

  getAllEditors(): EditorInstance[] {
    return Array.from(this.editors.values());
  }

  onDidChangeActiveEditor(listener: (editor: EditorInstance | undefined) => void): Disposable {
    this.changeListeners.push(listener);
    return {
      dispose: () => {
        const index = this.changeListeners.indexOf(listener);
        if (index !== -1) {
          this.changeListeners.splice(index, 1);
        }
      }
    };
  }

  registerLanguageSupport(language: string, provider: LanguageSupport): Disposable {
    this.languageSupports.set(language, provider);
    return {
      dispose: () => {
        this.languageSupports.delete(language);
      }
    };
  }

  getLanguageSupport(language: string): Extension | undefined {
    const support = this.languageSupports.get(language);
    return support?.getExtension();
  }

  registerCompletionProvider(provider: CompletionProvider): Disposable {
    this.completionProviders.push(provider);
    return {
      dispose: () => {
        const index = this.completionProviders.indexOf(provider);
        if (index !== -1) {
          this.completionProviders.splice(index, 1);
        }
      }
    };
  }

  registerFormatter(formatter: CodeFormatter): Disposable {
    formatter.languages.forEach(lang => {
      if (!this.formatters.has(lang)) {
        this.formatters.set(lang, []);
      }
      this.formatters.get(lang)!.push(formatter);
    });

    return {
      dispose: () => {
        formatter.languages.forEach(lang => {
          const formatters = this.formatters.get(lang);
          if (formatters) {
            const index = formatters.indexOf(formatter);
            if (index !== -1) {
              formatters.splice(index, 1);
            }
            if (formatters.length === 0) {
              this.formatters.delete(lang);
            }
          }
        });
      }
    };
  }

  async formatDocument(document: string, language: string): Promise<string> {
    const formatters = this.formatters.get(language);
    if (!formatters || formatters.length === 0) {
      return document;
    }

    // Use the first formatter for now
    // TODO: Add formatter selection logic
    return await formatters[0].format(document);
  }

  private notifyChangeListeners(editor: EditorInstance | undefined): void {
    this.changeListeners.forEach(listener => listener(editor));
  }
}
