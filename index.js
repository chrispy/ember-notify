'use strict';

const assign = require('object-assign');

module.exports = {
  name: 'ember-notify',

  isDevelopingAddon: function() {
    return true;
  },

  included: function(app) {
    this._super.included.apply(this, arguments);

    const options = assign({
      importCss: true
    }, app.options.emberNotify);

    if (options.importCss) {
      app.import('styles/app.css');
    }
  }
};
