import Core from '../src/index.js';
/* Components */
import App from '../src/components/app.js';
/* Modules */
import Validator from '../src/components/modules/validator.js';

const COMPONENTS = {
    App,
    /* Modules */
    Validator,
};

export {
    /* Optional modules */
};

export default class Loom extends Core {
    mount(extensions = {}) {
        return super.mount({ ...COMPONENTS, ...extensions });
    }
}
