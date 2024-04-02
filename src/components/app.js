/* eslint-disable import/no-unresolved */
import EventsBinder from '@core/event/events-binder';
import { debounce } from '@libs/throttle-debounce/throttle-debounce.es';

export default function (Loom, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    const Binder = new EventsBinder();

    const App = {
        refs: {},

        mount() {
            Events.emit('app.mount.before');
            this.initialize();
            this.bind();
            Events.emit('app.mount.after');
        },

        /**
         * Initialize the App.
         */
        initialize() {
            if (Object.prototype.hasOwnProperty.call(Components, 'PlaceholderModule')) {
                //
            }
            // Add classes
            Loom.rootElement.classList.add(
                Loom.settings.classes.root,
                ...Loom.settings.modifierClasses.root
            );
        },

        /**
         * Adds events.
         */
        bind() {
            Binder.on('focus', Loom.rootElement, (event) => this.onFocus(event), true);
            Binder.on('input', Loom.rootElement, (event) => this.onInput(event), true);
            Binder.on('blur', Loom.rootElement, (event) => this.onBlur(event), true);
            Binder.on('change', Loom.rootElement, (event) => this.onChange(event));
            Binder.on('submit', Loom.rootElement, (event) => this.onSubmit(event));
        },

        /**
         * Removes events.
         */
        unbind() {
            Binder.off('focus', Loom.rootElement, true);
            Binder.off('input', Loom.rootElement, true);
            Binder.off('blur', Loom.rootElement, true);
            Binder.off('change', Loom.rootElement);
            Binder.off('submit', Loom.rootElement);
        },

        /**
         * Handles input events.
         *
         * @param  {Object} event
         */
        onFocus(event) {
            Events.emit('root.focus', event.target);
        },

        /**
         * Handles input events.
         *
         * @param  {Object} event
         */
        onInput: debounce(Loom.settings.variables.inputEventDelay, false, (event) => {
            Events.emit('root.input', event.target);
        }),

        /**
         * Handles blur events.
         *
         * @param  {Object} event
         */
        onBlur(event) {
            Events.emit('root.blur', event.target);
        },

        /**
         * Handles change events.
         *
         * @param  {Object} event
         */
        onChange(event) {
            Events.emit('root.change', event.target);
        },

        /**
         * Handles submit events.
         *
         * @param  {Object} event
         */
        onSubmit(event) {
            event.preventDefault();
            Events.emit('root.submit');
        },
    };

    /**
     * Remove bindings from click:
     * - on destroying to remove added events
     * - on updating to remove events before remounting
     */
    Events.on(['destroy', 'update'], () => {
        App.unbind();
    });

    /**
     * Remount component
     * - on updating to reflect potential changes in settings
     */
    Events.on('update', () => {
        App.mount();
    });

    /**
     * Destroy binder:
     * - on destroying to remove listeners
     */
    Events.on(['destroy'], () => {
        // Remove classes
        Loom.rootElement.classList.remove(
            Loom.settings.classes.root,
            ...Loom.settings.modifierClasses.root
        );
        Binder.destroy();
    });

    Events.on(['destroy:after'], () => {
        App.refs.formElements = [];
    });

    return App;
}
