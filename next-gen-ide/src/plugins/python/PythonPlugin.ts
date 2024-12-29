import { IdePlugin, PluginContext, LanguageSupport } from '../types';
import { python } from '@codemirror/lang-python';

export class PythonPlugin implements IdePlugin {
  id = 'python-support';
  name = 'Python Support';
  version = '1.0.0';
  description = 'Provides Python language support';

  async activate(context: PluginContext): Promise<void> {
    const languageSupport: LanguageSupport = {
      name: 'python',
      extensions: ['.py'],
      getExtension: () => python(),
    };

    const disposable = context.editor.registerLanguageSupport('python', languageSupport);
    context.subscriptions.push(disposable);

    // Register completion provider
    const completionDisposable = context.editor.registerCompletionProvider({
      triggerCharacters: ['.'],
      provideCompletions: (document: string, position: any) => {
        return [
          {
            label: 'print',
            kind: 1, // Method
            detail: 'print(value, ..., sep=" ", end="\\n")',
            insertText: 'print($1)',
          },
          {
            label: 'len',
            kind: 1,
            detail: 'len(obj)',
            insertText: 'len($1)',
          },
          {
            label: 'range',
            kind: 1,
            detail: 'range(stop) | range(start, stop[, step])',
            insertText: 'range($1)',
          },
          {
            label: 'list',
            kind: 7, // Class
            detail: 'list([iterable])',
            insertText: 'list($1)',
          },
          {
            label: 'dict',
            kind: 7,
            detail: 'dict(**kwarg)',
            insertText: 'dict($1)',
          },
        ];
      },
    });
    context.subscriptions.push(completionDisposable);
  }

  async deactivate(): Promise<void> {
    // Cleanup will be handled by disposing subscriptions
  }
}
