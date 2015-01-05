import Ember from 'ember';
import Notify from 'ember-notify';
import Message from 'ember-notify/message';

export default Ember.Component.extend({
  primary: true,
  messages: null, // this should be a Stream, maybe in Ember 2

  classNames: ['ember-notify-cn'],
  messageStyle: 'foundation',

  init: function() {
    this._super();
    if (!this.get('messages')) this.set('messages', []);

    if (this.get('primary')) Notify.set('primary', this);
    var style = this.get('messageStyle'), klass;
    if (style) {
      if ('foundation' === style) klass = FoundationView;
      else if ('bootstrap' === style) klass = BootstrapView;
      else throw new Error(
        "Unknown messageStyle %s: options are 'foundation' and 'bootstrap'".fmt(style)
      );
    }
    this.set('messageClass', klass || this.constructor.defaultViewClass);
  },
  show: function(message) {
    if (!(message instanceof Message)) {
      message = Message.create(message);
    }
    this.messages.pushObject(message);
    return message;
  }
});

export var MessageView = Ember.View.extend({
  message: null,

  classNames: ['ember-notify'],
  classNameBindings: ['typeCss', 'message.visible:ember-notify-show:ember-notify-hidden'],
  attributeBindings: ['data-alert'],
  'data-alert': '',

  didInsertElement: function() {
    if (Ember.isNone(this.get('message.visible'))) {
      // the element is added to the DOM in its hidden state, so that
      // adding the 'ember-notify-show' class triggers the CSS transition
      Ember.run.next(this, function() {
        if (this.get('isDestroyed')) return;
        this.set('message.visible', true);
      });
    }
    var closeAfter = this.get('message.closeAfter');
    if (closeAfter) {
      Ember.run.later(this, function() {
        if (this.get('isDestroyed')) return;
        this.set('message.visible', false);
      }, closeAfter);
    }
  },
  typeCss: function() {
    var cssClass = this.get('message.type');
    if (cssClass === 'error') cssClass = 'alert error';
    return cssClass;
  }.property('message.type'),
  visibleObserver: function() {
    if (!this.get('message.visible')) {
      this.send('close');
    }
  }.observes('message.visible'),

  actions: {
    close: function() {
      var that = this,
          removeAfter = this.get('message.removeAfter') || this.constructor.removeAfter;
      this.set('message.visible', false);
      if (removeAfter) {
        Ember.run.later(this, remove, removeAfter);
      }
      else {
        remove();
      }
      function remove() {
        var parentView = that.get('parentView');
        if (parentView) parentView.get('messages').removeObject(that.get('message'));
      }
    }
  }
}).reopenClass({
  removeAfter: 250 // allow time for the close animation to finish
});

export var FoundationView = MessageView.extend({
  classNames: ['alert-box'],
  classNameBindings: ['radius::']
});

export var BootstrapView = MessageView.extend({
  classNames: ['alert'],
  typeCss: function() {
    var type = this.get('message.type');
    if (type === 'alert' || type === 'error') type = 'danger';
    return 'alert-%@'.fmt(type);
  }.property('type')
});
