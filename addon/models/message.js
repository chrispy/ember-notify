import EmberObject from '@ember/object';
import { computed } from '@ember/object';

export default EmberObject.extend({
  text: null,
  html: '',
  type: 'info',
  closeAfter: undefined,
  visible: true,
  // passed in function to call when clicking the notification content.
  // if nothing is passed in, the default close action is called.
  onClick: null,
  icon: null,

  iconOrType: computed('icon', 'type', function(){
    return this.get('icon') || this.get('type');
  }),

  isSameMessage(message) {
    if(!message) return false;
    if(message.get('text') === this.get('text') &&
       message.get('type') === this.get('type') &&
       message.get('closeAfter') === this.get('closeAfter')){
       return true
    }
    return false;
  },

});
