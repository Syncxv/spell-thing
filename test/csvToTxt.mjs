import fs from 'node:fs/promises';

const main = async () => {
	removeDuplicateLines();
	return;
	const csv = await fs.readFile('./OPTED-Dictionary.csv', 'utf-8');
	const lines = csv.split('\n');
	lines.shift();

	const words = lines.map((m) => m.split(',')[0].toLowerCase());

	await fs.writeFile('./test.txt', words.join('\n'));
};

main();

async function removeDuplicateLines() {
	const lines = (await fs.readFile('./wordlist.txt', 'utf-8')).split('\n');
	const uniqueLines = [...new Set(lines)];
	await fs.writeFile('./test.txt', uniqueLines.join('\n'));
}
