// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { Logger } from './logger';
import { DocumentManager } from './documentManager';
import { OpenCommand, RestoreCommand, SaveCommand } from './commands';
const CronJob = require('cron').CronJob;

const branchName = require('current-git-branch');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "restore-editors-on-checkout" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);

	if (vscode.workspace.workspaceFolders) {
    Logger.configure(context);
    console.log('hi there');

    const documentManager = new DocumentManager(context);
    context.subscriptions.push(documentManager);

    // context.subscriptions.push(new Keyboard());

    // context.subscriptions.push(new ClearCommand(documentManager));
    // context.subscriptions.push(new OpenCommand(documentManager));
    // context.subscriptions.push(new RestoreCommand(documentManager));
    // context.subscriptions.push(new SaveCommand(documentManager));
    // context.subscriptions.push(new ShowQuickEditorsCommand(documentManager));
	}

	const documentManager = new DocumentManager(context);

	new CronJob('* * * * * *', async function() {
		if (vscode.workspace.workspaceFolders) {


			// Consider only on the first workspaceFolder
			const previousBranch = context.workspaceState.get<String>('branch');
			const currentBranch = branchName({ altPath: vscode.workspace.workspaceFolders[0].uri.path })
			console.log('Branch:', currentBranch);

			if (previousBranch !== currentBranch) {
				console.log(`Switched branch from ${previousBranch} to ${currentBranch}`);
				if (previousBranch) {
					await documentManager.save(previousBranch);
				}

				await documentManager.open(currentBranch, true);

				context.workspaceState.update('branch', currentBranch);
			}

			
		}
	}, null, true, 'America/Los_Angeles');
}

// this method is called when your extension is deactivated
export function deactivate() {}
