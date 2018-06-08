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
			//console.log(data);
			//console.log("asdadasdsad called");
			self.vue.quoteText = data.contents.quotes[0].quote;
			//console.log(data.contents.quotes[0].quote);
			self.vue.quoteAuthor = data.contents.quotes[0].author;
		});
	}

	self.get_initial_user_info = function () {
		$.get(api_get_initial_user_info_url,
			function (data) {
				self.vue.post_array = data.posts

			});

		//if(self.vue.post_array.length>0)

	};

	self.get_in_demand_classes = function () {
		// $.getJSON(get_memos_url(0, 10), function (data) {
		//     self.vue.in_demand = data.memos;

		// });
		self.vue.in_demand = self.vue.class_list;

	}





	self.add_post = function (c_id) {
		console.log("add post");
		$.post(api_add_post_url, {
				c_id: c_id
			},

			function (data) {
				console.log("adding_post")
			}
		);

		self.goto('create_post_page')
	}


	Vue.component('autocomplete', {
		props: {
			items: {
				type: Array,
				required: false,
				default: () => [],
			},
		},
		data() {
			return {
				search: '',
				results: [],
				isOpen: false,
			};
		},
		methods: {
			onChange() {
				this.isOpen = true;
				this.filterResults();
			},
			filterResults() {
				this.results = this.items.filter(item => item.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
			},
		},
		template: `<div class="autocomplete">
    				<input type="text" />
    					  <ul
							v-show="isOpen"
							class="autocomplete-results"
						  >
							<li
							  v-for="(result, i) in results"
							  :key="i"
							  class="autocomplete-result"
							>
								{{ result }}
							</li>
						  </ul>
  					</div>`


	})

	Vue.component('post-card', {
		props: ['post'],
		template: `<div id="post-card" style="color:blue;padding:20px" class="container-fluid">
		  <div class="col-sm-5">
			  <div class="border">
			  <div class="row">
				  <div class="col-sm-4">
					  <p>{{post.classname}}</p>
				  </div>
				  <div class="col-sm-8">
				  <p>{{post.created_by}}</p>
					<p>email@ucsc.edu</p>
					  <p>(123)456-7890</p>
					<!--
					  <div class="row">

					  </div>
					-->
				  </div>
			  </div>
			</div>
		  </div>
	  </div>`
	})



	self.goto = function (page) {
		// console.log(page);
		self.vue.page = page;
	}

	self.get_classes = function () {
		$.get(api_get_classes_url,
			function (data) {
				self.vue.class_list = data.classes
			});
	};
	
	self.search_for_tutors = function (search) {
		console.log(search);
		//console.log(self.vue.student_search);
		if (search != "") {
			self.get_search(search);
		} else {
			self.get_classes;
		}
		self.goto('tutor_result_page');
		// $.getJSON(get_memos_url(0, 10), function (data) {
		//     self.vue.in_demand = data.memos;

		// });
	}
	
	self.get_search = function (search) {
		$.get(api_get_search_url, {
				search: parseInt(search)
			},
			function (data) {
				console.log("in get search")
				console.log(data.posts)
				self.vue.post_array = data.posts
			}

		);
	};

	self.goto = function (page) {
		self.vue.page = page;
		//		if (page == 'main') {
		//
		//		};
		//		if (page == 'search_results'){
		//			
		//		};...


	};

	self.get_initial_user_info = function () {
		//console.log("get initial user info");
		$.get(api_get_initial_user_info_url,
			function (data) {
				self.vue.post_array = data.posts

			});

	};


	self.get_classes = function () {
		//console.log('get classes');
		$.get(api_get_classes_url,
			function (data) {
				self.vue.class_list = data.class_list
			})
	}

	// Complete as needed.
	self.vue = new Vue({
		el: "#vue-div",
		delimiters: ['${', '}'],
		unsafeDelimiters: ['!{', '}'],

		data: {
			student_search: "",
			in_demand: [],
			quoteText: "",
			quoteAuthor: "",
			main_page: true,
			tutor_result_page: false,
			class_list: [],
			page: 'main',
			picked: "",
			post_array: []

		},
		methods: {
			getQuote: self.getQuote,
			search_for_tutors: self.search_for_tutors,
			add_post: self.add_post,
			go_home: self.go_home,
			get_classes: self.get_classes,
			get_search: self.get_search,
			goto: self.goto,
			get_initial_user_info: self.get_initial_user_info
			//on student class search submit -> match_tutors()
			//on tutor class search -> match_students()
		},
		created: function () {

			this.get_initial_user_info();
			console.log(this.post_array);
			if (this.quoteText == "") {
				this.getQuote();
			}
		}
	});


	self.get_classes();

	self.get_initial_user_info();

	return self;
};


var APP = null;


// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () {
	APP = app();
});
