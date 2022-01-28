import defaults from '@src/defaults';

const ROOT_SELECTOR = '#app';

export function query (document) {
	const root = document.querySelector(ROOT_SELECTOR)

	return {
		root,
	}
}
