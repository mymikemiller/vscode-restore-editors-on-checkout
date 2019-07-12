'use strict';

export const ExtensionId = 'restore-editors-on-checkout';
export const ExtensionKey = 'restoreEditorsOnCheckout';
export const ExtensionOutputChannelName = 'RestoreEditorsOnCheckout';
export const QualifiedExtensionId = `mymikemiller.${ExtensionId}`;

export type BuiltInCommands = 'vscode.open' | 'setContext' | 'workbench.action.closeActiveEditor' | 'workbench.action.nextEditor';
export const BuiltInCommands = {
    CloseActiveEditor: 'workbench.action.closeActiveEditor' as BuiltInCommands,
    NextEditor: 'workbench.action.nextEditor' as BuiltInCommands,
    Open: 'vscode.open' as BuiltInCommands,
    SetContext: 'setContext' as BuiltInCommands
};

export type WorkspaceState = 'restoreEditorsOnCheckout:documents';
export const WorkspaceState = {
    SavedDocuments: 'restoreEditorsOnCheckout:documents' as WorkspaceState
};
