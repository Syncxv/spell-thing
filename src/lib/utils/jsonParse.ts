export const jsonParse = (e: string, def: unknown = {}) => {
	try {
		return JSON.parse(e);
	} catch (err) {
		return def;
	}
};
