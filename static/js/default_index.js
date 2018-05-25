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

	//This is the random quote generator 
	self.get_quote = function() {

				  fetch(endpoint)
					 .then(function (response) {
						return response.json();
					 })
					 .then(function (data) {						
							console.log(data.quote);
					  		self.quoteText = data.quote;
						
					 })
					 .catch(function () {
						console.log('An error occurred');
					 });
			  	}
	
	const endpoint = 'https://talaikis.com/api/quotes/random/';


    // Some classes.
    var CMPS109 = {id: 1, title: 'Advanced Programming', 'demand': 0};
    var CMPS121 = {id: 2, title: 'Mobile Applications', 'demand': 0};
    var CMPS183 = {id: 3, title: 'Web Applications', 'demand': 0};
    var class_list = [CMPS109, CMPS121, CMPS183];

    // Compenent testing.
	 
	 
    
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



    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: function () {
            return {
            message: 'hello world',
            class_list: class_list,
				selected: '',
				quoteText: 'hello',
				quoteAuthor: 'world'
            }
        },
        methods: {
			  getQuote: self.get_quote,
			  updateQuote: function() {
				  console.log('update quote');
				  alert(self.quoteText);
              },
              input_tutor_session: function() {
                  console.log('testing 1 2 3')
              }

        }

    });


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
