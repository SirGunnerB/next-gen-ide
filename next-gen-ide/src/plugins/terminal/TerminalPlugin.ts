import { IdePlugin, PluginContext } from '../types';
import { Command } from '@tauri-apps/api/shell';

interface TerminalSession {
  id: string;
  cwd: string;
  onData: (data: string) => void;
  onExit: () => void;
}

export class TerminalPlugin implements IdePlugin {
  id = 'terminal';
  name = 'Terminal';
  version = '1.0.0';
  description = 'Provides integrated terminal functionality';

  private sessions: Map<string, TerminalSession> = new Map();
  private context?: PluginContext;

  async activate(context: PluginContext): Promise<void> {
    this.context = context;

    // Register terminal commands
    const createTerminalDisposable = context.commands.registerCommand({
      id: 'terminal.new',
      title: 'New Terminal',
      execute: async () => {
        await this.createTerminalSession();
      },
    });
    context.subscriptions.push(createTerminalDisposable);

    // Add terminal button to status bar
    const statusBarDisposable = context.statusBar.addItem({
      id: 'terminal',
      text: 'Terminal',
      tooltip: 'Toggle Terminal',
      command: 'terminal.new',
      priority: 100,
    });
    context.subscriptions.push(statusBarDisposable);
  }

  async createTerminalSession(cwd?: string): Promise<string> {
    if (!this.context) throw new Error('Terminal plugin not initialized');

    const sessionId = Math.random().toString(36).substring(7);
    const defaultCwd = cwd || this.context.workspace.getWorkspaceFolder() || process.cwd();

    // Create a new terminal session
    const session: TerminalSession = {
      id: sessionId,
      cwd: defaultCwd,
      onData: (data: string) => {
        // Handle terminal output
        console.log('Terminal output:', data);
      },
      onExit: () => {
        // Clean up session
        this.sessions.delete(sessionId);
      },
    };

    this.sessions.set(sessionId, session);

    // Start the shell process using Tauri's Command API
    const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
    const command = new Command(shell, [], { cwd: defaultCwd });

    // Handle command output
    command.stdout.on('data', line => {
      session.onData(line);
    });

    command.stderr.on('data', line => {
      session.onData(line);
    });

    // Handle command exit
    command.on('close', () => {
      session.onExit();
    });

    // Start the command
    command.spawn();

    return sessionId;
  }

  async writeToTerminal(sessionId: string, data: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Terminal session not found');
    }

    // Send data to the terminal process
    // Implementation depends on the specific terminal backend being used
  }

  async closeTerminalSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      // Close the terminal process
      session.onExit();
      this.sessions.delete(sessionId);
    }
  }

  async deactivate(): Promise<void> {
    // Close all terminal sessions
    for (const sessionId of this.sessions.keys()) {
      await this.closeTerminalSession(sessionId);
    }
  }
}
