

var app = function() {

  var self = {};

  Vue.config.silent = false; // show all warnings

  // Extends an array
  self.extend = function(a, b) {
      for (var i = 0; i < b.length; i++) {
          a.push(b[i]);
      }
  };

  self.toggle_pub = function() {
      self.vue.is_public = !self.vue.is_public;
      console.log(self.vue.is_public);
  };
  // Complete as needed.
  self.vue = new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
  });


  return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
