import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import internal = require('stream');

export class CalendarProvider implements vscode.TreeDataProvider<CalendarItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<CalendarItem | undefined | void> = new vscode.EventEmitter<CalendarItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<CalendarItem | undefined | void> = this._onDidChangeTreeData.event;
	private seed: number;

	constructor() {
		let date = new Date;
		let d = date.getDay();
		var seconds = date.getSeconds();
		var minutes = date.getMinutes();
		var hour = date.getHours();
		var res = ((d + 7 - 1) % 7) * 24 * 3600 + hour * 3600 + minutes * 60 + seconds;
		this.seed = Math.floor(date.valueOf() / 1000) - res;
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: CalendarItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: CalendarItem|undefined): Thenable<CalendarItem[]> {
		if (element === undefined) {
			return Promise.resolve(this.getItems());
		}else{
			return Promise.resolve(element.children as CalendarItem[]);
		}
	}

	random() {
		var x = Math.sin(this.seed++) * 10000;
		return x - Math.floor(x);
	}

	shuffle(array: number[]) {
		let currentIndex = array.length,  randomIndex;
	  
		// While there remain elements to shuffle...
		while (currentIndex != 0) {
	  
		  // Pick a remaining element...
		  randomIndex = Math.floor(this.random() * currentIndex);
		  currentIndex--;
	  
		  // And swap it with the current element.
		  [array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
		}
	  
		return array;
	  }

	/**
	 * Given the path to package.json, read all its dependencies and devDependencies.
	 */
	private getItems(): CalendarItem[] {
        let dates: string[]  = ["Monday", "Tuesday","Wendesday","Thesday", "Friday"];
		let items: string[] = ["开会", "code review", "线上发布", "design review", "删库跑路", "写bug", "1:1", "oncall", "修bug", "玩游戏", "健身", "熬夜", "开party", "请假", "撩妹", "聚餐", "团建"];
		let goods : string[] = [];
		let bads : string[] = [];

		let indexs = new Array(items.length).fill(null).map((_, i) => i);
		for(let i = 0; i < 5; i++){
			this.shuffle(indexs);
			goods.push("宜：" + items[indexs[0]] + ", " + items[indexs[1]]);
			bads.push("忌：" + items[indexs[2]] + ", " + items[indexs[3]]);
		}
		
		let result : CalendarItem[] = [];
		
        dates.forEach((date, index) => result.push(new CalendarItem(date, [new CalendarItem(goods[index], []), new CalendarItem(bads[index], [])], vscode.TreeItemCollapsibleState.Collapsed)));
		return result;
	}
}

export class CalendarItem extends vscode.TreeItem {
	children: vscode.TreeItem[];

	constructor(
		public readonly label: string,
		children: vscode.TreeItem[],
		public readonly collapsibleState?: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
		this.children = children;
	}
}
