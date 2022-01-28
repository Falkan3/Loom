export default {
    /**
     * Collection of options applied at specified media breakpoints.
     */
    breakpoints: {},

    /**
     * Collection of internally used HTML ids.
     *
     * @type {Object}
     */
    ids: {},

    /**
     * Collection of internally used HTML classes.
     *
     * @type {Object}
     */
    classes: {
        root: 'loom',
        error: 'error',
        warning: 'warning',
        success: 'success',
    },

    /**
     * Collection of internally used data attributes.
     *
     * @type {Object}
     */
    data: {
        prefix: 'loom',
    },

    /**
     * Collection of modifier classes to be applied to the specified elements
     * For example:
     * {root: ['your-modifier-class']}
     *
     * @type {Object}
     */
    modifierClasses: {
        root: []
    },

    /**
     * Collection of text used in components.
     *
     * @type {Object}
     */
    texts: {
        invalidValue: 'Invalid value.'
    },

    /**
     * Variable values.
     *
     * @type {Object}
     */
    variables: {
        // eslint-disable-next-line max-len
        emailValidationRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        inputEventDelay: 500,
    },
};
