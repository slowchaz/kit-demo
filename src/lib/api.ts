export const base = 'https://api.movies.tastejs.com';
export const mediaBase = 'https://image.tmdb.org/t/p';

const cache = new Map();

export async function get(
	fetch: typeof globalThis.fetch,
	endpoint: string,
	params?: Record<string, string>
) {
	const q = new URLSearchParams(params);
	const url = `${base}/${endpoint}?${q}`;

	if (cache.has(url)) {
		return cache.get(url);
	}

	const response = await fetch(url);
	const data = await response.json();

	cache.set(url, data);

	return data;
}

export function media(file_path: string, width: number) {
	return `${mediaBase}/w${width}/${file_path}`;
}
