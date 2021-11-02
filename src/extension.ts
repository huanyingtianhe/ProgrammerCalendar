// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CalendarProvider, CalendarItem } from './treeview';

let myStatusBarItem: vscode.StatusBarItem;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pc" is now active!');
	const calendarProvider = new CalendarProvider();
	let disposable1 = vscode.commands.registerCommand('pc.WeekCalender', () => 
		vscode.window.registerTreeDataProvider("Calendar", calendarProvider));
	let today = calendarProvider.today();
	let message = today.label;
	today.children.forEach(child => message = message + "。 " + child.label);
	let disposable2 = vscode.commands.registerCommand('pc.today', () => 
		vscode.window.showInformationMessage(message));

	context.subscriptions.push(disposable1);
	context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {}
