import { IdePlugin, PluginContext, Disposable } from './types';

export class PluginManager {
  private plugins: Map<string, IdePlugin> = new Map();
  private activePlugins: Map<string, boolean> = new Map();
  private context: PluginContext;

  constructor(context: PluginContext) {
    this.context = context;
  }

  async registerPlugin(plugin: IdePlugin): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin with id ${plugin.id} is already registered`);
    }

    this.plugins.set(plugin.id, plugin);
    await this.activatePlugin(plugin.id);
  }

  async activatePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin with id ${pluginId} not found`);
    }

    if (this.activePlugins.get(pluginId)) {
      return; // Already active
    }

    try {
      await plugin.activate(this.context);
      this.activePlugins.set(pluginId, true);
    } catch (error) {
      console.error(`Failed to activate plugin ${pluginId}:`, error);
      throw error;
    }
  }

  async deactivatePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin with id ${pluginId} not found`);
    }

    if (!this.activePlugins.get(pluginId)) {
      return; // Already inactive
    }

    try {
      if (plugin.deactivate) {
        await plugin.deactivate();
      }
      this.activePlugins.set(pluginId, false);
    } catch (error) {
      console.error(`Failed to deactivate plugin ${pluginId}:`, error);
      throw error;
    }
  }

  getPlugin(pluginId: string): IdePlugin | undefined {
    return this.plugins.get(pluginId);
  }

  getAllPlugins(): IdePlugin[] {
    return Array.from(this.plugins.values());
  }

  isPluginActive(pluginId: string): boolean {
    return this.activePlugins.get(pluginId) || false;
  }
}
