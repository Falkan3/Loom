/* eslint-disable import/no-unresolved */
import { warn } from '@utils/log';
import { isFunction } from '@utils/types';

import Test from './transformers/test';

/**
 * Applies different transformers on translate value.
 *
 * @param  {Object} Loom
 * @param  {Object} Components
 * @param Events
 * @return {Object}
 */
export default function (Loom, Components, Events) {
    /**
     * Merge instance transformers with collection of default transformers.
     *
     * @type {Array}
     */
    const TRANSFORMERS = [
        Test
    ];

    return {
        /**
         * Pipelines translate value with registered transformers.
         *
         * @param  {Number} translate
         * @return {Number}
         */
        mutate(translate) {
            for (let i = 0; i < TRANSFORMERS.length; i++) {
                const transformer = TRANSFORMERS[i];

                if (isFunction(transformer) && isFunction(transformer().modify)) {
                    translate = transformer(Loom, Components, Events).modify(translate);
                } else {
                    warn('Transformer should be a function that returns an object with `modify()` method');
                }
            }

            return translate;
        }
    };
}
