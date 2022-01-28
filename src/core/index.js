/* eslint-disable import/no-unresolved */
import { warn } from '@utils/log';
import { isFunction } from '@utils/types';

/**
 * Creates and initializes specified collection of extensions.
 * Each extension receives access to instance of loom and rest of components.
 *
 * @param {Object} loom
 * @param {Object} extensions
 * @param events
 * @returns {Object}
 */
export function mount(loom, extensions, events) {
    const components = {};

    Object.keys(extensions).forEach((name) => {
        if (isFunction(extensions[name])) {
            components[name] = extensions[name](loom, components, events);
        } else {
            warn('Extension must be a function');
        }
    });

    Object.keys(components).forEach((name) => {
        if (Object.prototype.hasOwnProperty.call(components, name)
            && isFunction(components[name].mount)) {
            components[name].mount();
        }
    });

    return components;
}

export default mount;
