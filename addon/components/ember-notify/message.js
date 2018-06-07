import Component from '@ember/component';
import layout from '../../templates/components/ember-notify/message';
import { later } from '@ember/runloop';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Component.extend({
  layout,
  // auto-close after this many milliseconds (starts the close css transition)
  defaultCloseAfter: null,
  // remove message from parent component list after this many milliseconds.
  // needs to match the css transition timer
  waitForCloseAnimation: 250,
  message: null,
  visible: alias('message.visible'),
  icon: alias('message.icon'),
  type: alias('message.type'),
  closed: alias('message.closed'),
  // passed in closure action to remove message from parent component
  removeMessage: null,

  classNameBindings: [
    'visible:ember-notify-show:ember-notify-hide',
    'message.type',
  ],

  closeAfterOrDefault: computed('message.closeAfter', 'defaultCloseAfter', function(){
    const closeAfter = this.get('message.closeAfter');
    if (closeAfter === undefined) return this.get('defaultCloseAfter');
    return closeAfter;
  }),

  didInsertElement: function() {
    if (this.get('closeAfterOrDefault')) {
      later(() => this.send('close'), this.get('closeAfterOrDefault'));
    }
  },

  actions: {
    close: function() {
      if (this.get('closed')) return;
      if (!this.get('visible')) return;
      this.set('closed', true);
      this.set('visible', false);
      later(this, this.removeMessage, this.get('message'), this.get('waitForCloseAnimation'));
    },

    click: function(event) {
      if(!this.get('message.onClick')) return this.send('close');

      this.get('message.onClick')(event, this.element);
      // let some time for visual clue
      later(() => {
        this.send('close');
      }, 100);
    },
  }
});
