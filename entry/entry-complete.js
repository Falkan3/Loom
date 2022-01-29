import Core from '../src/index';
/* Components */
import App from '../src/components/app';
/* Modules */
import Validator from '../src/components/modules/validator';

const COMPONENTS = {
    /* Required */
    App,
    /* Modules */
    Validator,
    /* Optional modules */
};

export default class Loom extends Core {
    mount(extensions = {}) {
        return super.mount({ ...COMPONENTS, ...extensions });
    }
}
