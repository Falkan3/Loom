import Core from '../src/index';
/* Components */
import App from '../src/components/app';
/* Modules */
import PlaceholderModule from '../src/components/modules/placeholder-module';

const COMPONENTS = {
    /* Required */
    App,
    /* Modules */
    PlaceholderModule,
};

export default class Loom extends Core {
    mount(extensions = {}) {
        return super.mount({ ...COMPONENTS, ...extensions });
    }
}
