import { IdePlugin, PluginContext, CodeFormatter } from '../types';

export class FormatterPlugin implements IdePlugin {
  id = 'code-formatter';
  name = 'Code Formatter';
  version = '1.0.0';
  description = 'Provides code formatting support';

  async activate(context: PluginContext): Promise<void> {
    const formatter: CodeFormatter = {
      languages: ['typescript', 'javascript', 'html', 'css'],
      format: async (document: string, options?: any) => {
        // In a real implementation, you would use prettier or another formatting library
        // For now, we'll just do some basic formatting
        return document
          .split('\n')
          .map(line => line.trim())
          .join('\n');
      },
    };

    const disposable = context.editor.registerFormatter(formatter);
    context.subscriptions.push(disposable);

    // Add format command to status bar
    const statusBarDisposable = context.statusBar.addItem({
      id: 'formatter',
      text: 'Format Document',
      tooltip: 'Format the current document',
      command: 'format.document',
      priority: 100,
    });
    context.subscriptions.push(statusBarDisposable);
  }

  async deactivate(): Promise<void> {
    // Cleanup will be handled by disposing subscriptions
  }
}
