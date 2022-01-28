# Loom

![GitHub package.json version](https://img.shields.io/github/package-json/v/Falkan3/Loom?style=for-the-badge&color=orange&label=VERSION)
![GitHub](https://img.shields.io/github/license/Falkan3/Loom?style=for-the-badge)

***This plugin is still a work in progress***

# Description
Loom is a form validation library.

# Features
- **Extendable**. Expand upon the core features by adding your own.

# Commands
### Build
- `npm run build` - Build `src` files into `dist` folder.
- `npm run build:js` - Build `src` files into `dist` folder.
- `npm run build:css` - Build `src` files into `dist` folder.
### Development
- `npm run clean` - Remove `dist/` directory
- `npm test` - Run tests with linting and coverage results.
- `npm run lint` - Run ESlint with airbnb-config.
- `npm run lint:fix` - Run ESlint with airbnb-config and apply fixes.
- `npm run stylelint` - Run Stylelint.
- `npm run stylelint:fix` - Run Stylelint and apply fixes.

# Installation
Install from the command line:
```shell
npm install @falkan3/loom
```

Install via package.json:
```json
"@falkan3/loom": "^0.0.1"
```

# Usage
## Complete version
To use the complete version, include the `loom.min.js` file and initialize the plugin:

```html
<script src="/js/loom.min.js"></script>

<script>
    const loom = new Loom(document.querySelector('#form'), {});
    loom.mount();
	// Call a component function
    loom._components.ComponentName.function();
</script>
```

## Modular version
To use the modular version, import the core and the components you need and initialize the plugin:

```js
import Loom, { ComponentName } from "@falkan3/loom/dist/js/loom.modular.esm";

new Loom('#form').mount({ ComponentName })
```

# Settings
These are the available settings:

Collection of internally used HTML classes.
```js
classes: {
    root: 'loom',
    error: 'error',
    warning: 'warning',
    success: 'success',
}
```

Collection of internally used data attributes.
```js
data: {
    prefix: 'loom',
}
```

Variable values.
```js
variables: {
    emailValidationRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    inputEventDelay: 500,
}
```

# Events
To emit events, use:
```js 
loomInstance._eventsBus.emit('eventName', context);
```  
To bind to events, use:
```js 
loomInstance._eventsBus.on('eventName', (context) => {

});
```  
A list of available events, emitted and listened to:
- `update` - Called after the update function has been called, modifying the settings
- `destroy`
- `destroy.after`
- `root.submit` - Called when the form has been submitted. Context: `{ formElements: Array, allValid: Boolean }`;
- `app.formElementValidated` -  Context: `formElement: Object`

# Compilation
Bundles come in different formats, in their corresponding folders in the dist directory.

### JS
UMD version:
- `dist/js/loom.min.js`

ESM version:
- `dist/js/esm/loom.esm.js`

### CSS
- `css/loom.min.css`

```js
/* Required components */
import App from '../src/components/app';
import XXX from '../src/components/XXX';
/* Optional components */
import YYY from '../src/components/XXX';

const COMPONENTS = {
  /* Required */
  App,
  /* Optional */
  ComponentName,
};

export default class Loom extends Core {
  mount(extensions = {}) {
    return super.mount(Object.assign({}, COMPONENTS, extensions));
  }
}
```

# License

GPL-3 © Adam Kocić (Falkan3)
