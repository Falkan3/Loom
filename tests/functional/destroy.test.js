import html from '../fixtures/html'
import { query } from '../fixtures/query';

// import defaults from '@src/defaults';
import Loom from '../../entry/entry-complete';

describe('After destroying an instance', () => {
	beforeEach(() => {
		document.body.innerHTML = html
	})

	test('`root element` should not exist', () => {
		let {root} = query(document)

		const instance = new Loom(root.querySelector('.loom')).mount().destroy();

		expect(instance.rootElement.querySelector(`.${instance._settings.classes.root}`)).toBe(null)
	})
})
