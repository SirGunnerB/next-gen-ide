import { IdePlugin, PluginContext, LanguageSupport } from '../types';
import { javascript } from '@codemirror/lang-javascript';
import { CompletionContext } from '@codemirror/autocomplete';

export class TypeScriptPlugin implements IdePlugin {
  id = 'typescript-support';
  name = 'TypeScript Support';
  version = '1.0.0';
  description = 'Provides TypeScript language support';

  async activate(context: PluginContext): Promise<void> {
    const languageSupport: LanguageSupport = {
      name: 'typescript',
      extensions: ['.ts', '.tsx'],
      getExtension: () => javascript({ typescript: true }),
    };

    const disposable = context.editor.registerLanguageSupport('typescript', languageSupport);
    context.subscriptions.push(disposable);

    // Register completion provider
    const completionDisposable = context.editor.registerCompletionProvider({
      triggerCharacters: ['.'],
      provideCompletions: (document: string, position: any) => {
        // Basic TypeScript completions
        return [
          {
            label: 'console',
            kind: 6, // Module
            detail: 'console object',
            insertText: 'console',
          },
          {
            label: 'log',
            kind: 1, // Method
            detail: '(method) console.log(...data: any[]): void',
            insertText: 'log($1)',
          },
          // Add more completions as needed
        ];
      },
    });
    context.subscriptions.push(completionDisposable);
  }

  async deactivate(): Promise<void> {
    // Cleanup will be handled by disposing subscriptions
  }
}
