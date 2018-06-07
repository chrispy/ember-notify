[<img align='right' alt='Build Status' src='https://travis-ci.org/aexmachina/ember-notify.png'>](https://travis-ci.org/aexmachina/ember-notify)

# ember-notify

`ember-notify` displays wee little notification messages down the bottom of your Ember.js app.

## Fork Notice (chrispy)

* Switched to yarn
* Upgraded packages/code to Ember 2.18
* Ran ember-modules-codemod
* Cleaned and updated node_modules
* Removed bower
* Simplified/refactored code
* Added custom onClick handlers
* Added option to not show duplicate messages at the same time
* Moved service/model into correct folder
* Converted vendor/css to app/styles/scss
* Removed themes
* Removed Runner class
* Removed non-block support
* Removed alert type
* Removed observer dependency (messages can't get closed programmatically now, which i dont need anyway)
* Removed rounded corners support from component, use css instead
* Removed initializer, import notify service manually where needed instead
* Rewrote tests with simplified qunit
  * TODO: unit test service
  * TOOD: check if "ember-qunit: Ember.onerror validation: Ember.onerror is functioning properly" is actually the correct behaviour here (see https://git.io/vbine)

### Compatibility

The CSS animations are inspired by CSS from [alertify.js](http://fabien-d.github.io/alertify.js/). You can also customize the positioning and animations by overriding the default `ember-notify` CSS class. For usage, see the [animations example](#custom-animations).

## Usage

1. Add `{{ember-notify}}` to one of your templates, usually in `application.hbs`
2. Inject the `notify` service
3. Display messages using the `info`, `success`, `warning` and `error` methods

### Examples

```js
import {
  Component,
  inject
} from 'ember';

export default Component.extend({
  notify: inject.service('notify'),
  actions: {
    sayHello() {
      this.get('notify').info('Hello there!');
    }
  }
});
```

```hbs
  {{#ember-notify as |message close click|}}
    {{#if message.icon}}
      {{!-- Display an icon however you want. I'm using SVG --}}
    {{/if}}
    <div class='notify-content' onClick={{action click}}>
      {{message.text}}{{{message.html}}}
    </div>
    <button onClick={{action close}}>Close</button>
  {{/ember-notify}}
```

Three arguments are passed to the block: `message` object, `close` and `click` action. Make sure
you are using *Closure Actions* syntax passing the action (e. g. `<a {{action close}}` or
`{{your-component close=(action close)`.


By default the notifications close after 2.5 seconds, although you can control this in your template:

```handlebars
{{ember-notify closeAfter=4000}}
```

By default duplicate notifications are not shown at the same time, if you want to show them:

```handlebars
{{ember-notify hideDuplicates=false}}
```

Or you can control when each message is closed:

```js
var notify = this.get('notify');
var message = notify.alert('You can control how long it\'s displayed', {
  closeAfter: 10000 // or set to null to disable auto-hiding
});
```

You can specify raw HTML:

```js
notify.info({html: '<div class="my-div">Hooray!</div>'});
```

Include custom `classNames` on your message:

```js
notify.alert('Custom CSS class', {
  classNames: ['my-class']
})
```

Do something special when clicking the notification container:

```js
notify.alert('Custom CSS class', {
  onClick: this.doClick.bind(this)
})

doClick() {
  // do something
}
```

Note the .bind(this), which is needed if you need the callers scope when calling.
If no onClick handler is passed, the default close action is called.


### Multiple Containers

If you want to have separate notifications and control where they're inserted into the DOM you can
have multiple `{{ember-notify}}` components, but only one of them can be accessed using the injected service.
The others you will need to provide a `source` property, so secondary containers should be used as follows:

```hbs
{{ember-notify source=someProperty}}
```

```js
import Notify from 'ember-notify';

export default Ember.Component.extend({
  secondNotify: null,
  init() {
    this._super(...arguments);
    this.set('secondNotify', Notify.create);
  },
  actions: {
    clicked: function() {
      this.get('secondNotify').success('Hello from the controller');
    }
  }
});
```

### Custom Animations

By default, the `ember-notify` message window will appear from the bottom right corner of the
screen.  You may want to control the postioning or animations. To do so, you need to pass a CSS
class name using the `classPrefix` option. This will render the top level `ember-notify` element
with the class you pass in.

```hbs
<!-- gives class="ember-view ember-notify-cn custom-notify"> to top level element-->
{{ember-notify classPrefix="custom-notify"}}

```
Then you need to add custom styling for each of the elements within the `ember-notify` structure.
The following snippet summarizes rules needed for a custom look. For a complete example that you can drop into your project, see [examples/custom-position-animations.css](examples/custom-position-animations.css)

```css
/* main container */
.custom-notify {
	position: fixed;
	top: 10px;
	right: 0;
	left: 0;
}
/* message box */
.custom-notify .callout {
	position: relative;
	overflow: hidden;
}
/* classes applied for animating in/out */
.custom-notify .ember-notify-show {}
.custom-notify .ember-notify-hide {}
```

### Usage in Tests

The scheduler that shows and hides the messages is disabled by default when Ember is running tests
to avoid slowing down the tests. You can override this behaviour by setting `Notify.testing = true`.

```js
import Notify from 'ember-notify';
Notify.testing = true;
```

## Installation

This module is an ember-cli addon, so installation is easy as pie.

```sh
npm install ember-notify --save-dev
```

### Upgrading from a previous version

See [the CHANGELOG](https://github.com/aexmachina/ember-notify/blob/master/CHANGELOG.md).

## Browser Compatibility

Some users have reported issues with IE8, so this is currently not supported.
