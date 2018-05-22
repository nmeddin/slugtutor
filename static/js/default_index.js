// This is the js for the default/index.html view.



var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Some classes.
    var CMPS109 = {id: 1, title: 'Advanced Programming', 'demand': 0};
    var CMPS121 = {id: 2, title: 'Mobile Applications', 'demand': 0};
    var CMPS183 = {id: 3, title: 'Web Applications', 'demand': 0};
    var class_list = [CMPS109, CMPS121, CMPS183];

    // Compenent testing.

    Vue.component('child', {
      props: ['cla'],
      template: '<p>{{ cla.title }}</p>'
        
    });
	 
	 
	 Vue.component('my-checkbox', {
		template: '#checkbox-template',
		data() {
		  return {
			 checked: false,
			 title: 'Check me'
		  }
		},
		methods: {
		  check() {
			 this.checked = !this.checked;
		  }
		}
	 });
    
    Vue.component('class-demand', {
        data: function () {
            return {
                count: 0
            }
        },
        props: ['title'],
        template: 
            `<div align = "justify">{{ title }}: {{count}}</div>`
    })

    // Vue.component('class_demand,' {
    //     props: {
    //         propA: String,
    //         propB: Number,

    //     },
    //     template: '<p>${ title }: ${ demand }</p>'
    // });

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: function () {
            return {
            message: 'hello world',
            class_list: class_list,
				selected: ''
            }
        },
        methods: {
//            increment()
        }

    });


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
