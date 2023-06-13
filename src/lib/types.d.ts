export interface Letter {
	id: string;
	letter: string;
	display?: string;
	row: number;
	col: number;

	elem?: HTMLDivElement;

	letterMulti: number;
	wordMulti: boolean;
}

export interface Data {
	letterMulti?: {
		col: number;
		row: number;
		multi: number;
	};
	wordMulti?: { col: number; row: number };
}
