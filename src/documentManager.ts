'use strict';
import { commands, Disposable, ExtensionContext, TextEditor, window } from 'vscode';
import { ActiveEditorTracker } from './activeEditorTracker';
import { TextEditorComparer } from './comparers';
import { WorkspaceState } from './constants';
import { Logger } from './logger';
import { ISavedEditor, SavedEditor } from './savedEditor';

export * from './savedEditor';

export class DocumentManager extends Disposable {

    constructor(private context: ExtensionContext) {
        super(() => this.dispose());
    }

    dispose() { }

    // clear() {
    //     this.context.workspaceState.update(WorkspaceState.SavedDocuments, undefined);
    // }

    get(name: String): SavedEditor[] {
        const data = this.context.workspaceState.get<ISavedEditor[]>(WorkspaceState.SavedDocuments + ":" + name);
        return (data && data.map(_ => new SavedEditor(_))) || [];
    }

    async open(name: String = '', restore: boolean = false) {
        try {
            const editors = this.get(name);
            // if (!editors.length) return;

            if (restore) {
                // Close all opened documents
                await commands.executeCommand('workbench.action.closeAllEditors');
            }

            console.log("Opening editors from " + WorkspaceState.SavedDocuments + ":" + name);
            console.log(JSON.stringify(editors.map((v) => {return v.uri})));

            for (const editor of editors) {
                await editor.open({ preview: false });
            }
        }
        catch (ex) {
            Logger.error(ex, 'DocumentManager.restore');
        }
    }

    async save(name: String = '') {
        try {
            const editorTracker = new ActiveEditorTracker();

            let active = window.activeTextEditor;
            let editor = active;
            const openEditors: TextEditor[] = [];
            if (active) {
              do {
                  if (editor != null) {
                      // If we didn't start with a valid editor, set one once we find it
                      if (active === undefined) {
                          active = editor;
                      }

                      openEditors.push(editor);
                  }

                  editor = await editorTracker.awaitNext(500);
                  if (editor !== undefined && openEditors.some(_ => TextEditorComparer.equals(_, editor, { useId: true, usePosition: true }))) break;
              } while ((active === undefined && editor === undefined) || !TextEditorComparer.equals(active, editor, { useId: true, usePosition: true }));
            }
            editorTracker.dispose();

            const editors = await openEditors
                .filter(_ => _.document !== undefined)
                .map(_ => {
                    return {
                        uri: _.document.uri,
                        viewColumn: _.viewColumn
                    } as ISavedEditor;
                });

            console.log("Saving editors to " + WorkspaceState.SavedDocuments + ":" + name);
            console.log(JSON.stringify(editors.map((v) => {return v.uri})));

            await this.context.workspaceState.update(WorkspaceState.SavedDocuments + ":" + name, editors);
        }
        catch (ex) {
            Logger.error(ex, 'DocumentManager.save');
        }
    }
}
