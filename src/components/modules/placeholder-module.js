/* eslint-disable import/no-unresolved */

export default function (Loom, Components, Events) {
    const PlaceholderModule = {
        refs: {},

        /**
         * Construct a PlaceholderModule instance.
         */
        mount() {
        }
    };

    Events.on(['destroy:after'], () => {
        PlaceholderModule.refs = {};
    });

    return PlaceholderModule;
}
