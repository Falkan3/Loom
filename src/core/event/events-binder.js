/* eslint-disable import/no-unresolved */
import { isString } from '@utils/types';

export default class EventsBinder {
    /**
     * Construct an EventsBinder instance.
     *
     * @param {Object} listeners
     */
    constructor(listeners = {}) {
        this.listeners = listeners;
    }

    /**
     * Adds event listeners to element.
     *
     * @param  {String|Array} events
     * @param  {Element|Node|Window|Document} el
     * @param  {Function} fn
     * @param  {Boolean|Object} capture
     */
    on(events, el, fn, capture = false) {
        if (isString(events)) {
            events = [events];
        }

        for (let i = 0; i < events.length; i++) {
            this.listeners[events[i]] = fn;

            el.addEventListener(events[i], this.listeners[events[i]], capture);
        }
    }

    /**
     * Removes event listeners from element.
     *
     * @param  {String|Array} events
     * @param  {Element|Node|Window|Document} el
     * @param  {Boolean|Object} capture
     */
    off(events, el, capture = false) {
        if (isString(events)) {
            events = [events];
        }

        for (let i = 0; i < events.length; i++) {
            el.removeEventListener(events[i], this.listeners[events[i]], capture);
        }
    }

    /**
     * Destroy collected listeners.
     */
    destroy() {
        delete this.listeners;
    }
}
