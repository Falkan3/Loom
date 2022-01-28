import html from '../fixtures/html'
import { query } from '../fixtures/query';

// import defaults from '@src/defaults';
import Loom from '../../entry/entry-complete';

describe('After mounting an instance', () => {
	beforeEach(() => {
		document.body.innerHTML = html
	})

	test('`root element` should exist', () => {
		let {root} = query(document)

		const instance = new Loom(root.querySelector('.loom')).mount();

		expect(instance.rootElement.querySelector(`.${instance._settings.classes.root}`)).toBeDefined()
	})
})
