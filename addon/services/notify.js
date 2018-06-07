import Service from '@ember/service';
import Message from 'ember-notify/models/message';
import { isHTMLSafe } from '@ember/template';

function aliasToShow(type) {
  return function(message, options) {
    return this.show(type, message, options);
  };
}

export default Service.extend({
  info: aliasToShow('info'),
  success: aliasToShow('success'),
  warning: aliasToShow('warning'),
  error: aliasToShow('error'),
  pending: null,
  target: null,

  init() {
    this._super(...arguments);
    this.set('pending', []);
  },

  show(type, text, options) {
    if (isHTMLSafe(text)) {
      text = text.toString();
    }
    if (typeof text === 'object') {
      options = text;
      text = null;
    }
    const message = this.buildMessage(type, text, options);
    const target = this.get('target');
    if (target) {
      target.show(message);
    } else {
      this.pending.push(message);
    }
    return message;
  },

  buildMessage(type, text, options) {
    return Message.create(Object.assign({
      type: type,
      text: text,
    }, options));
  },

  setTarget(target) {
    this.set('target', target);
    if (target) {
      this.get('pending').forEach(message => target.show(message));
      this.set('pending', []);
    }
  }
});
