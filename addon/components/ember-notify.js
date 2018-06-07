import Component from '@ember/component';
import layout from '../templates/components/ember-notify';
import { A } from '@ember/array';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout: layout,
  notify: service(),
  source: oneWay('notify'),
  messages: null,
  defaultCloseAfter: 2500,
  // dont show duplicate messages, only valid as long as the last message is shown.
  // when last message is closed, the same message may appear again
  hideDuplicates: true,
  lastMessage: null,
  classNames: [
    'ember-notify-cn'
  ],
  classPrefix: 'ember-notify-default',
  classNamesBindings: null,

  init: function() {
    this._super(...arguments);
    this.setProperties({
      messages: A(),
      classNamesBindings: [
        'classPrefix'
      ]
    });
    this.get('source').setTarget(this);
  },

  willDestroyElement: function() {
    this.get('source').setTarget(null);
  },

  show: function(message) {
    if (this.get('isDestroyed')) return;
    if(this.get('hideDuplicates')){
      if(message.isSameMessage(this.get('lastMessage'))) return;
      this.set('lastMessage', message);
    }
    this.get('messages').pushObject(message);
    return message;
  },

  removeMessage(message) {
    if(this.get('hideDuplicates')) this.set('lastMessage', null);
    this.get('messages').removeObject(message);
  },
});
