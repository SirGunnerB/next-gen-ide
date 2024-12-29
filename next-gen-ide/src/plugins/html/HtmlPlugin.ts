import { IdePlugin, PluginContext, LanguageSupport } from '../types';
import { html } from '@codemirror/lang-html';

export class HtmlPlugin implements IdePlugin {
  id = 'html-support';
  name = 'HTML Support';
  version = '1.0.0';
  description = 'Provides HTML language support';

  async activate(context: PluginContext): Promise<void> {
    const languageSupport: LanguageSupport = {
      name: 'html',
      extensions: ['.html', '.htm'],
      getExtension: () => html(),
    };

    const disposable = context.editor.registerLanguageSupport('html', languageSupport);
    context.subscriptions.push(disposable);

    // Register completion provider
    const completionDisposable = context.editor.registerCompletionProvider({
      triggerCharacters: ['<', '/', ' '],
      provideCompletions: (document: string, position: any) => {
        return [
          {
            label: 'div',
            kind: 10, // Snippet
            detail: '<div></div>',
            insertText: '<div>$1</div>',
          },
          {
            label: 'span',
            kind: 10,
            detail: '<span></span>',
            insertText: '<span>$1</span>',
          },
          {
            label: 'p',
            kind: 10,
            detail: '<p></p>',
            insertText: '<p>$1</p>',
          },
          {
            label: 'a',
            kind: 10,
            detail: '<a href=""></a>',
            insertText: '<a href="$1">$2</a>',
          },
          {
            label: 'img',
            kind: 10,
            detail: '<img src="" alt="" />',
            insertText: '<img src="$1" alt="$2" />',
          },
          {
            label: 'class',
            kind: 14, // Keyword
            detail: 'class attribute',
            insertText: 'class="$1"',
          },
          {
            label: 'id',
            kind: 14,
            detail: 'id attribute',
            insertText: 'id="$1"',
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
