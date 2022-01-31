/* eslint-disable import/no-unresolved */
import { isEmpty } from '@utils/string';

export default function (Loom, Components, Events) {
    const Validator = {
        refs: {
            formElements: [],
        },

        /**
         * Construct a ValidatorModule instance.
         */
        mount() {
            this.initialize();
        },

        /**
         * Initialize the Validator.
         */
        initialize() {
            // Set form elements
            this.setFormElements();
        },

        getRelatedFormElement(el) {
            return el.dataset[`${Loom.settings.data.prefix}Id`]
                ? this.refs.formElements[el.dataset[`${Loom.settings.data.prefix}Id`]]
                : this.refs.formElements.find((formElement) => formElement.el.isEqualNode(el));
        },

        setFormElements() {
            // Convert from controls collections to an array
            Array.prototype.slice.call(Loom.rootElement.elements).forEach((el) => {
                const valueGetter = Validator.setValueGetter(el);

                const formElement = {
                    el,
                    rules: Object.prototype.hasOwnProperty.call(el.dataset, `${Loom.settings.data.prefix}Rules`) ? el.dataset[`${Loom.settings.data.prefix}Rules`].split('|') : [],
                    validateOn: 'blur',
                    valid() {
                        return !this.failed.length;
                    },
                    getValue: () => valueGetter(el),
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

                // Push form element instance and cache index in element's dataset
                el.dataset[`${Loom.settings.data.prefix}Id`] = this.refs.formElements.push(formElement) - 1;
            });
        },

        setValueGetter(element) {
            switch (element.tagName) {
            case 'INPUT':
                if (element.getAttribute('type') === 'checkbox') {
                    return (el) => el.checked;
                }
                if (element.getAttribute('type') === 'radio') {
                    return (el) => {
                        let value = null;
                        const selectedOptions = el.form.querySelectorAll(`[name="${el.name}"]:checked`);
                        if (selectedOptions.length) {
                            value = selectedOptions[0].value;
                        }
                        return value;
                    };
                }
                return (el) => el.value;
            default:
                return (el) => el.value;
            }
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
                    if (Loom.settings.variables.emailValidationRegex.test(formElement.getValue().toLowerCase())) {
                        passed.push(ruleName);
                    } else {
                        failed.push(ruleName);
                    }
                    break;
                case 'required':
                    if (!isEmpty(formElement.getValue())) {
                        passed.push(ruleName);
                    } else {
                        failed.push(ruleName);
                    }
                    break;
                case 'minLength':
                    if (formElement.getValue().length >= parseInt(ruleArg[0], 10)) {
                        passed.push(ruleName);
                    } else {
                        failed.push(ruleName);
                    }
                    break;
                case 'maxLength':
                    if (formElement.getValue().length <= parseInt(ruleArg[0], 10)) {
                        passed.push(ruleName);
                    } else {
                        failed.push(ruleName);
                    }
                    break;
                case 'hasNumbers':
                    if (/\d/.test(formElement.getValue())) {
                        passed.push(ruleName);
                    } else {
                        failed.push(ruleName);
                    }
                    break;
                case 'hasLowerCase':
                    if (formElement.getValue().toUpperCase() !== formElement.getValue()) {
                        passed.push(ruleName);
                    } else {
                        failed.push(ruleName);
                    }
                    break;
                case 'hasUpperCase':
                    if (formElement.getValue().toLowerCase() !== formElement.getValue()) {
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
            Events.emit('validator.formElementValidated', formElement);
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
    };

    /**
     * Remove error class
     * - on root element form focus
     */
    Events.on('root.focus', (element) => {
        const currentFormElement = Validator.getRelatedFormElement(element);
        if (!currentFormElement.valid()) {
            element.classList
            .remove(`${Loom.settings.classes.root}-${Loom.settings.classes.error}`);
        }
    });

    /**
     * Revalidate form element bound elements, apply styles
     * - on root element form input
     */
    Events.on('root.input', (element) => {
        const currentFormElement = Validator.getRelatedFormElement(element);
        if (currentFormElement) {
            Validator.formElementValidate(currentFormElement);
            Validator.formElementApplyStyles(currentFormElement, { formElement: false });
        }
    });

    /**
     * Revalidate form element, apply styles
     * - on root element form blur
     */
    Events.on('root.blur', (element) => {
        const currentFormElement = Validator.getRelatedFormElement(element);
        if (currentFormElement) {
            Validator.formElementValidate(currentFormElement);
            Validator.formElementApplyStyles(currentFormElement);
        }
    });

    /**
     * Revalidate form elements, apply styles and emit
     * - on root element form submit
     */
    Events.on('root.submit', () => {
        Validator.refs.formElements.forEach((formElement) => {
            Validator.formElementValidate(formElement);
            Validator.formElementApplyStyles(formElement);
        });
        Events.emit('validator.submit', {
            formElements: Validator.refs.formElements,
            allValid: Validator.refs.formElements.every((el) => el.valid())
        });
    });

    return Validator;
}
