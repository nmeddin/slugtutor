// This is the js for the default/index.html view.

var app = function () {

	var self = {};

	Vue.config.silent = false; // show all warnings

	// Extends an array
	self.extend = function (a, b) {
		for (var i = 0; i < b.length; i++) {
			a.push(b[i]);
		}
	};

	//This is the random quote generator endpoint 

	const quote_endpoint = 'https://quotes.rest/qod?category=students';

	self.getQuote = function () {
		$.getJSON(quote_endpoint, function (data) {
			console.log(data);
			console.log("getQuote called");
			self.vue.quoteText = data.contents.quotes[0].quote;
			console.log(data.contents.quotes[0].quote);
			self.vue.quoteAuthor = data.contents.quotes[0].author;
		});
	}



	// Vue.component('student_class_search', {
	//     data: function () {
	//         return {
	//             count: 0
	//         }
	//     },
	//     template: '<p>${ title }: ${ demand }</p>'
	// });
	self.get_in_demand_classes = function () {
		// $.getJSON(get_memos_url(0, 10), function (data) {
		//     self.vue.in_demand = data.memos;

		// });
		self.vue.in_demand = self.vue.class_list;

	}

	self.search_for_tutors = function () {
		console.log("search for tutors");
		console.log(self.vue.student_search);
		self.vue.tutor_result_page = true;
		self.vue.main_page = false;
		// $.getJSON(get_memos_url(0, 10), function (data) {
		//     self.vue.in_demand = data.memos;

		// });
	}

	self.create_session = function () {
		console.log("create session");
	}

	Vue.component('tutor-card', {
		props: ['tutor'],
		template: `<div class="container-fluid">
		  Tutor Card Container
		  <div class="col-sm-7">
			  <div class="border">
			  <div class="row">
				  
				  <div class="col-sm-4">
					  <img src="https://cdn3.iconfinder.com/data/icons/sympletts-part-3/128/circle-user-2-128.png">
					  <p>five star rating</p>
					  <p>Classname</p>
				  </div>
				  <div class="col-sm-8">
				  <span>Firstname Lastname</span>
					<p>email@ucsc.edu</p>
					  <p>(123)456-7890</p>
					  <div class="row">
						  <div class ="col-sm-4">
							  <row>day+1</row>
							  <row>10:00am</row>
							  <row>3:00pm</row>
						  </div>
						  <div class ="col-sm-4">
							  <row>day+2</row>
							  <row>10:00am</row>
							  <row>4:00pm</row></div>
						  <div class ="col-sm-4">			
							  <row>day+3</row>
							  <row>10:00am</row>
							  <row>2:00pm</row></div>
					  </div>
				  </div>
			  </div>
			</div>
		  </div>
	  </div>`
	})


	const Foo = {
		template: `<div>foo</div>`
	}
	const Bar = {
		template: '<div>bar</div>'
	}
	const Tutor = {
		template: '<div>tutor</div>'
	}

	// 2. Define some routes
	// Each route should map to a component. The "component" can
	// either be an actual component constructor created via
	// `Vue.extend()`, or just a component options object.
	// We'll talk about nested routes later.
	const routes = [
		{
			path: '/foo',
			component: Foo
		},
		{
			path: '/bar',
			component: Bar
		}
	]

	// 3. Create the router instance and pass the `routes` option
	// You can pass in additional options here, but let's
	// keep it simple for now.
	const router = new VueRouter({
		routes: [
			{
				path: '/tutor/:id',
				component: Tutor
			}
	  ]
	})

	self.go_home = function () {
		self.vue.tutor_result_page = false;
		self.vue.main_page = true;
	}

	//datetime
	var d = new Date();
	d = d.toDateString();
	d = d.slice(4)
	d = d.slice(0, -4);

	// Complete as needed.
	self.vue = new Vue({
		el: "#vue-div",
		delimiters: ['${', '}'],
		unsafeDelimiters: ['!{', '}'],
		router,
		data: {
			student_search: "",
			tutor_search: "",
			in_demand: [],
			quoteText: "",
			quoteAuthor: "",
			main_page: true,
			tutor_result_page: false,
			day1: d,
		},
		methods: {
			getQuote: self.getQuote,
			search_for_tutors: self.search_for_tutors,
			create_session: self.create_session,
			go_home: self.go_home
			//on student class search submit -> match_tutors()
			//on tutor class search -> match_students()
		},
		created: function () {

			console.log(this.quoteText);
			if (this.quoteText == "") {
				this.getQuote();
			}
		}
	});


	return self;
};



var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () {
	APP = app();
});
