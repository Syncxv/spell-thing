class TrieNode<T> {
	value: T;
	children: { [key: string]: TrieNode<T> };
	isEndOfWord: boolean;

	constructor(value: any = null) {
		this.value = value;
		this.children = {};
		this.isEndOfWord = false;
	}
}

export class Trie<T> {
	root: TrieNode<T>;
	constructor() {
		this.root = new TrieNode();
	}

	insert(key: string, value: T) {
		let node = this.root;
		for (const char of key) {
			if (!(char in node.children)) {
				node.children[char] = new TrieNode();
			}
			node = node.children[char];
		}
		node.isEndOfWord = true;
		node.value = value;
	}

	search(query: string) {
		let node = this.root;
		for (const char of query) {
			if (!(char in node.children)) {
				return [];
			}
			node = node.children[char];
		}
		return this._dfs(node);
	}

	_dfs(node: TrieNode<T>): T[] {
		let result = [];
		if (node.isEndOfWord) {
			result.push(node.value);
		}
		for (const child in node.children) {
			result = result.concat(this._dfs(node.children[child]));
		}
		return result;
	}
}
