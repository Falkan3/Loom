/* eslint-disable import/no-unresolved */
import { isEmpty } from '@utils/string';
import formatClass from '@utils/formatter';

export default function (Loom, Components, Events) {
    const Validator = {
        refs: {
            formElements: [],
            groups: {}
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
                // Set the appropriate value getter according to the element's tag and input type
                const valueGetter = Validator.setValueGetter(el);

                const formElement = {
                    el,
                    rules: Object.prototype.hasOwnProperty.call(el.dataset, `${Loom.settings.data.prefix}Rules`) ? el.dataset[`${Loom.settings.data.prefix}Rules`].split('|') : [],
                    valid() {
                        return !this.failed.length;
                    },
                    getValue: () => valueGetter(el),
                    passed: [],
                    failed: [],
                    related: [], // todo: add related form elements that are validated together
                    group: el.dataset[`${Loom.settings.data.prefix}Group`] ?? null,
                    boundElements: [],
                    boundElementRules: {
                        '*': []
                    }
                };

                // Handle groups
                if (formElement.group
                    && !Object.prototype.hasOwnProperty.call(this.refs.groups, formElement.group)) {
                    this.refs.groups[el.dataset[`${Loom.settings.data.prefix}Group`]] = [];
                }

                // Handle bound elements
                Loom.rootElement.querySelectorAll(`[data-${Loom.settings.data.prefix}-bind-to="${el.id}"]`).forEach((boundEl) => {
                    if (boundEl.dataset[`${Loom.settings.data.prefix}BindRules`]) {
                        // Add rule specific binding
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
                            formElement.boundElementRules[argumentStrippedRule]
                            .push(boundEl);
                        });
                    } else {
                        // Add to full binding (all rules)
                        formElement.boundElementRules['*'].push(boundEl);
                    }
                    formElement.boundElements.push(boundEl);
                });

                // Push form element instance and cache index in element's dataset
                el.dataset[`${Loom.settings.data.prefix}Id`] = this.refs.formElements.push(formElement) - 1;
            });

            // Handle related form elements
            this.refs.formElements.forEach((formElement) => {
                if (formElement.el.tagName === 'INPUT' && formElement.el.getAttribute('type') === 'radio') {
                    const relatedElements = this.refs.formElements.filter(
                        (filteredFormElement) => filteredFormElement.el.name === formElement.el.name
                    );
                    // [...el.form.querySelectorAll(`[name="${el.name}"]`)];
                    formElement.related.push(...relatedElements
                    .filter((relatedElement) => relatedElement.el.id !== formElement.el.id));
                }
            });

            // Handle group binding
            Loom.rootElement.querySelectorAll(`[data-${Loom.settings.data.prefix}-bind-to]`).forEach((boundEl) => {
                const binding = boundEl.dataset[`${Loom.settings.data.prefix}BindTo`];
                const bindingArgArr = binding.split(':');
                // Add to group binding
                if (bindingArgArr.length === 2 && bindingArgArr[0] === 'group' && Object.prototype.hasOwnProperty.call(this.refs.groups, bindingArgArr[1])) {
                    this.refs.groups[bindingArgArr[1]].push(boundEl);
                }
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
                        const selectedOptions = el.form.querySelectorAll(`[name="${el.name}"]:checked`);
                        return selectedOptions.length ? selectedOptions[0].value : null;
                    };
                }
                return (el) => el.value;
            default:
                return (el) => el.value;
            }
        },

        formElementValidate(formElement, callback = true) {
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
            Events.emit('validator.formElementValidated', { formElement, callback });
            return { passed, failed };
        },

        getElementsToUpdate(formElement, options = {}) {
            const settings = {
                formElement: true,
                success: true,
                error: true,
                ...options
            };

            // Add all bound elements
            const elementsToUpdate = [...formElement.boundElementRules['*']];
            // Add input element, enabled by default
            if (settings.formElement) {
                elementsToUpdate.push(formElement.el);
            }
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
        },

        formElementApplyStyles(formElement, options = {}) {
            const settings = {
                formElement: true,
                success: true,
                error: true,
                ...options
            };

            // Success
            if (settings.success && formElement.passed.length) {
                const elementsToUpdate = this.getElementsToUpdate(formElement, settings);
                [...elementsToUpdate.all, ...elementsToUpdate.success].forEach((el) => {
                    el.classList.remove(formatClass('error', Loom.settings));
                    el.classList.add(formatClass('success', Loom.settings));
                });
            }
            // Error
            if (settings.error && formElement.failed.length) {
                const elementsToUpdate = this.getElementsToUpdate(formElement, settings);
                [...elementsToUpdate.all, ...elementsToUpdate.error].forEach((el) => {
                    el.classList.remove(formatClass('success', Loom.settings));
                    el.classList.add(formatClass('error', Loom.settings));
                });
            }
        },

        elementRemoveStyles(formElement, options = {}) {
            const settings = {
                success: true,
                error: true,
                ...options
            };
            const classesToRemove = [];
            if (settings.success) {
                classesToRemove.push(formatClass('success', Loom.settings));
            }
            if (settings.error) {
                classesToRemove.push(formatClass('error', Loom.settings));
            }
            this.getElementsToUpdate(formElement).all.forEach((el) => {
                el.classList.remove(...classesToRemove);
            });
        },

        groupApplyStyles(group) {
            if (Object.prototype.hasOwnProperty.call(this.refs.groups, group)) {
                const formElements = this.refs.formElements
                .filter((formElement) => formElement.group === group);
                const allValid = formElements.every((formElement) => !formElement.failed.length);
                if (allValid) {
                    this.refs.groups[group].forEach((el) => {
                        el.classList.remove(formatClass('error', Loom.settings));
                        el.classList.add(formatClass('success', Loom.settings));
                    });
                } else {
                    this.refs.groups[group].forEach((el) => {
                        el.classList.remove(formatClass('success', Loom.settings));
                        el.classList.add(formatClass('error', Loom.settings));
                    });
                }
            }
        }
    };

    /**
     * Remove error class
     * - on root element form focus
     */
    Events.on('root.focus', (element) => {
        const currentFormElement = Validator.getRelatedFormElement(element);

        // if (element.getAttribute('type') === 'radio') {
        //     element.form.querySelectorAll(`[name="${element.name}"]`).forEach((el) => {
        //         const radioFormElement = Validator.getRelatedFormElement(el);
        //         Validator.elementRemoveStyles(radioFormElement);
        //     });
        // }

        if (!currentFormElement.valid()) {
            Validator.elementRemoveStyles(currentFormElement, {
                success: false,
                error: true
            });
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
            if (currentFormElement.group) {
                Validator.groupApplyStyles(currentFormElement.group);
            }
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
            if (currentFormElement.group) {
                Validator.groupApplyStyles(currentFormElement.group);
            }
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
            if (formElement.group) {
                Validator.groupApplyStyles(formElement.group);
            }
        });
        Events.emit('validator.submit', {
            formElements: Validator.refs.formElements,
            allValid: Validator.refs.formElements.every((el) => el.valid())
        });
    });

    Events.on('validator.formElementValidated', (response) => {
        if (response.callback && response.formElement.related.length) {
            response.formElement.related.forEach((relatedFormElement) => {
                Validator.formElementValidate(relatedFormElement, false);
                Validator.formElementApplyStyles(relatedFormElement);
            });
        }
    });

    return Validator;
}
