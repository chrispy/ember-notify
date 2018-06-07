import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, tap, settled } from '@ember/test-helpers';
// import { pauseTest } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberNotify from 'ember-notify/components/ember-notify';
import Message from 'ember-notify/models/message';

module('Integration | Component | EmberNotify', function(hooks) {
  setupRenderingTest(hooks);

  this.componentString = hbs`
    {{#ember-notify classNames="notify-container" as |message close click|}}
      {{#if message.icon}}
        <div class='notify-icon'>
          {{message.icon}}
        </div>
      {{/if}}
      <div class='notify-content' onClick={{action click}}>
        {{message.text}}{{{message.html}}}
      </div>
      <button class='notify-close' onClick={{action close}}>Close</button>
    {{/ember-notify}}
  `;

  hooks.before(() => {});
  // dont use fat arrow, as it will change the scope and this.owner wont be accessible
  hooks.beforeEach(async function() {
    let component;
    this.owner.register('component:ember-notify', EmberNotify.extend({
      didInsertElement() {
        this._super(...arguments);
        component = this;
      }
    }));
    await render(this.componentString);
    this.component = component;
  });
  hooks.afterEach(function() {});
  hooks.after(function() {});

  test('it renders an empty notification container', function(assert) {
    assert.expect(3)
    assert.dom('.notify-container').exists('notification container exists');
    assert.dom('.notify-container .notify-content').doesNotExist('notification content does not exist');
    assert.equal(this.component.get('messages.length'), 0, 'has 0 messages');
  });

  module('with 1 message', function(hooks) {
    hooks.beforeEach(async function() {
      this.message = Message.create({
        text: 'dummy text',
        visible: true,
        icon: 'icon',
        type: 'alert'
      });
    });

    module('with closeAfter: 0', function(hooks) {
      hooks.beforeEach(async function() {
        this.message.closeAfter = 0;
        await this.component.show(this.message);
      });

      test('it renders one message', function(assert) {
        assert.expect(4)
        assert.dom('.notify-container .notify-icon').hasText(this.message.get('icon'), 'notification icon is set');
        assert.dom('.notify-container .notify-content').hasText(this.message.get('text'), 'notification content is set');
        assert.dom('.notify-container .notify-close').exists('notification close is set');
        assert.equal(this.component.get('messages.length'), 1, 'component stored 1 message');
      });

      test('it does not auto close the message', async function(assert) {
        assert.expect(2)
        await settled();
        assert.dom('.notify-container .notify-content').hasText(this.message.get('text'), 'notification content is set');
        assert.equal(this.component.get('messages.length'), 1, 'component stored 1 message');
      });

      module('after requesting the same message again', function(hooks) {
        hooks.beforeEach(async function() {
          this.message2 = Message.create({
            text: 'dummy text',
            visible: true,
            type: 'alert',
            closeAfter: 0,
          });
          await this.component.show(this.message2);
        });

        test('it still has one message', async function(assert) {
          assert.expect(4)
          assert.dom('.notify-container .notify-icon').hasText(this.message.get('icon'), 'notification icon is set');
          assert.dom('.notify-container .notify-content').hasText(this.message.get('text'), 'notification content is set');
          assert.dom('.notify-container .notify-close').exists('notification close is set');
          assert.equal(this.component.get('messages.length'), 1, 'component stored 1 message');
        });
      });

      module('after requesting another message (without icon)', function(hooks) {
        hooks.beforeEach(async function() {
          this.message2 = Message.create({
            text: 'dummy text2',
            visible: true,
            type: 'alert'
          });
          await this.component.show(this.message2);
        });

        test('it has two messages (one without icon)', function(assert) {
          assert.expect(4)
          assert.dom('.notify-container .notify-icon').exists('notification icon is is set 1 time', {count: 1});
          assert.dom('.notify-container .notify-content').exists('notification content is set 2 times', {count: 2});
          assert.dom('.notify-container .notify-close').exists('notification close is set 2 times', {count: 2});
          assert.equal(this.component.get('messages.length'), 2, 'component stored 2 message');
        });
      });

      module('after clicking the close button', function(hooks) {
        hooks.beforeEach(async function() {
          await tap('button')
        });

        test('it renders an empty notification container', async function(assert) {
          assert.expect(3)
          assert.dom('.notify-container').exists('notification container exists');
          assert.dom('.notify-container .notify-content').doesNotExist('notification content does not exist');
          assert.equal(this.component.get('messages.length'), 0, 'has 0 messages');
        });

        module('after requesting the same message again', function(hooks) {
          hooks.beforeEach(async function() {
            await this.component.show(this.message);
          });

          test('it renders one message', function(assert) {
            assert.expect(4)
            assert.dom('.notify-container .notify-icon').hasText(this.message.get('icon'), 'notification icon is set');
            assert.dom('.notify-container .notify-content').hasText(this.message.get('text'), 'notification content is set');
            assert.dom('.notify-container .notify-close').exists('notification close is set');
            assert.equal(this.component.get('messages.length'), 1, 'component stored 1 message');
          });
        });

      });
    });

    module('with closeAfter: 10', function(hooks) {
      hooks.beforeEach(async function() {
        this.message.closeAfter = 10;
        await this.component.show(this.message);
      });

      test('it renders one message', function(assert) {
        assert.expect(4)
        assert.dom('.notify-container .notify-icon').hasText(this.message.get('icon'), 'notification icon is set');
        assert.dom('.notify-container .notify-content').hasText(this.message.get('text'), 'notification content is set');
        assert.dom('.notify-container .notify-close').exists('notification close is set');
        assert.equal(this.component.get('messages.length'), 1, 'component stored 1 message');
      });

      test('it does auto close the message', async function(assert) {
        assert.expect(3)
        await settled();
        assert.dom('.notify-container').exists('notification container exists');
        assert.dom('.notify-container .notify-content').doesNotExist('notification content does not exist');
        assert.equal(this.component.get('messages.length'), 0, 'has 0 messages');
      });

      module('after clicking the close button', function(hooks) {
        hooks.beforeEach(async function() {
          await tap('button')
        });

        test('it renders an empty notification container', async function(assert) {
          assert.expect(3)
          assert.dom('.notify-container').exists('notification container exists');
          assert.dom('.notify-container .notify-content').doesNotExist('notification content does not exist');
          assert.equal(this.component.get('messages.length'), 0, 'has 0 messages');
        });
      });
    });
  });
});
