/* eslint-disable import/no-unresolved */
import EventsBinder from '@core/event/events-binder';
import { debounce } from '@libs/throttle-debounce/throttle-debounce.es';
import { isEmpty } from '@utils/string';

export default function (Loom, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    const Binder = new EventsBinder();

    const App = {
        refs: {
            formElements: [],
        },

        mount() {
            Events.emit('app.mount.before');
            this.initialize();
            this.bind();
            Events.emit('app.mount.after');
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
            Binder.off('submit', Loom.rootElement);
        },

        /**
         * Handles input events.
         *
         * @param  {Object} event
         */
        onFocus(event) {
            const currentFormElement = this.getRelatedFormElement(event.target);
            if (!currentFormElement.valid()) {
                event.target.classList
                .remove(`${Loom.settings.classes.root}-${Loom.settings.classes.error}`);
            }
        },

        /**
         * Handles input events.
         *
         * @param  {Object} event
         */
        onInput: debounce(Loom.settings.variables.inputEventDelay, false, (event) => {
            const currentFormElement = App.getRelatedFormElement(event.target);
            if (currentFormElement) {
                App.formElementValidate(currentFormElement);
                App.formElementApplyStyles(currentFormElement, { formElement: false });
            }
        }),

        /**
         * Handles blur events.
         *
         * @param  {Object} event
         */
        onBlur(event) {
            const currentFormElement = this.getRelatedFormElement(event.target);
            if (currentFormElement) {
                this.formElementValidate(currentFormElement);
                this.formElementApplyStyles(currentFormElement);
            }
        },

        /**
         * Handles change events.
         *
         * @param  {Object} event
         */
        onChange(event) {
            //
        },

        /**
         * Handles submit events.
         *
         * @param  {Object} event
         */
        onSubmit(event) {
            event.preventDefault();
            this.refs.formElements.forEach((formElement) => {
                this.formElementValidate(formElement);
                this.formElementApplyStyles(formElement);
            });
            Events.emit('root.submit', {
                formElements: this.refs.formElements,
                allValid: this.refs.formElements.every((el) => el.valid())
            });
        },

        /**
         * Initialize the app wrapper.
         */
        initialize() {
            if (Object.prototype.hasOwnProperty.call(Components, 'PlaceholderModule')) {
                //
            }
            // Add classes
            Loom.rootElement.classList.add(Loom.settings.classes.root,
                ...Loom.settings.modifierClasses.root);
            // Set form elements
            this.setFormElements();
        },

        setFormElements() {
            // Convert from controls collections to an array
            Array.prototype.slice.call(Loom.rootElement.elements).forEach((el) => {
                const formElement = {
                    el,
                    rules: Object.prototype.hasOwnProperty.call(el.dataset, `${Loom.settings.data.prefix}Rules`) ? el.dataset[`${Loom.settings.data.prefix}Rules`].split('|') : [],
                    validateOn: 'blur',
                    valid() { return !this.failed.length; },
                    // todo: add a getValue method that works with checkboxes and radio buttons
                    passed: [],
                    failed: [],
                    boundElements: [],
                    boundElementRules: {
                        '*': []
                    }
                };
                // Handle bound elements
                Loom.rootElement.querySelectorAll(`[data-${Loom.settings.data.prefix}-bind-to="${el.id}"]`).forEach((boundEl) => {
                    if (boundEl.dataset[`${Loom.settings.data.prefix}BindRules`]) {
                        const bindRules = boundEl.dataset[`${Loom.settings.data.prefix}BindRules`].split('|');
                        bindRules.forEach((rule) => {
                            // Strip arguments from rule name
                            const argumentStrippedRule = rule.split(':')[0];
                            // Create new rule bind array if it doesn't exist
                            if (!Object.prototype.hasOwnProperty.call(
                                formElement.boundElementRules,
                                argumentStrippedRule
                            )) {
                                formElement.boundElementRules[argumentStrippedRule] = [];
                            }
                            // Push the element to the rule bind array
                            formElement.boundElementRules[argumentStrippedRule].push(boundEl);
                        });
                    } else {
                        formElement.boundElementRules['*'].push(boundEl);
                    }
                    formElement.boundElements.push(boundEl);
                });
                // Push form element instance
                this.refs.formElements.push(formElement);
            });
        },

        formElementValidate(formElement) {
            const passed = [];
            const failed = [];
            formElement.rules.forEach((rule) => {
                const ruleArr = rule.split(':');
                const ruleName = ruleArr[0];
                const ruleArg = ruleArr.slice(1);

                switch (ruleName) {
                case 'email':
                    // eslint-disable-next-line max-len
                    if (Loom.settings.variables.emailValidationRegex.test(formElement.el.value.toLowerCase())) {
                        passed.push(ruleName);
                    } else {
                        failed.push(ruleName);
                    }
                    break;
                case 'required':
                    if (!isEmpty(formElement.el.value)) {
                        passed.push(ruleName);
                    } else {
                        failed.push(ruleName);
                    }
                    break;
                case 'minLength':
                    if (formElement.el.value.length >= parseInt(ruleArg[0], 10)) {
                        passed.push(ruleName);
                    } else {
                        failed.push(ruleName);
                    }
                    break;
                case 'hasNumbers':
                    if (/\d/.test(formElement.el.value)) {
                        passed.push(ruleName);
                    } else {
                        failed.push(ruleName);
                    }
                    break;
                case 'hasLowerCase':
                    if (formElement.el.value.toUpperCase() !== formElement.el.value) {
                        passed.push(ruleName);
                    } else {
                        failed.push(ruleName);
                    }
                    break;
                case 'hasUpperCase':
                    if (formElement.el.value.toLowerCase() !== formElement.el.value) {
                        passed.push(ruleName);
                    } else {
                        failed.push(ruleName);
                    }
                    break;
                default:
                    break;
                }
            });
            formElement.passed = passed;
            formElement.failed = failed;
            Events.emit('app.formElementValidated', formElement);
            return { passed, failed };
        },

        formElementApplyStyles(formElement, options) {
            const settings = {
                formElement: true,
                success: true,
                error: true,
                ...options
            };

            const getElementsToUpdate = () => {
                // Add all bound elements
                const elementsToUpdate = [...formElement.boundElementRules['*']];
                // Add input element, enabled by default
                if (settings.formElement) elementsToUpdate.push(formElement.el);
                // Passed
                const success = [];
                formElement.passed.forEach((rule) => {
                    if (Object.prototype.hasOwnProperty.call(formElement.boundElementRules, rule)
                        && formElement.boundElementRules[rule].length) {
                        success.push(...formElement.boundElementRules[rule]);
                    }
                });
                // Failed
                const error = [];
                formElement.failed.forEach((rule) => {
                    if (Object.prototype.hasOwnProperty.call(formElement.boundElementRules, rule)
                        && formElement.boundElementRules[rule].length) {
                        error.push(...formElement.boundElementRules[rule]);
                    }
                });
                return { all: elementsToUpdate, success, error };
            };

            // Success
            if (settings.success && formElement.passed.length) {
                const elementsToUpdate = getElementsToUpdate();
                [...elementsToUpdate.all, ...elementsToUpdate.success].forEach((el) => {
                    el.classList.remove(`${Loom.settings.classes.root}-${Loom.settings.classes.error}`);
                    el.classList.add(`${Loom.settings.classes.root}-${Loom.settings.classes.success}`);
                });
            }
            // Error
            if (settings.error && formElement.failed.length) {
                const elementsToUpdate = getElementsToUpdate();
                [...elementsToUpdate.all, ...elementsToUpdate.error].forEach((el) => {
                    el.classList.remove(`${Loom.settings.classes.root}-${Loom.settings.classes.success}`);
                    el.classList.add(`${Loom.settings.classes.root}-${Loom.settings.classes.error}`);
                });
            }
        },

        getRelatedFormElement(el) {
            return this.refs.formElements
            .find((formElement) => formElement.el.isEqualNode(el));
        }
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
