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




	Vue.component('post-card', {
		props: {
			post: Object,
		},
		data: function () {
			return {
				count: 0
			}
		},
		methods: {
			join: function() {
				console.log('join')
			}
		},
		template: `<div id="post-card" style="color:blue;padding:20px" class="container-fluid">
		  <div class="col-sm-5">
			  <div class="border">
			  <div class="row">
				  <div class="col-sm-4">
					  <p>{{post.classname}}</p>
				  </div>
				  <div class="col-sm-8">
				  <p>{{post.leader_name}}</p>
					<p>{{post.leader_email}}</p>
					  <button v-on:click="this.$parent.join">Join</button>
				  </div>
			  </div>
			</div>
		  </div>
	  </div>`
	})


	self.join = function() {

		console.log('join');

	}

	self.goto = function (page) {
		// console.log(page);
		self.vue.page = page;
	}

	self.search_for_tutors = function (search) {
		console.log(search);
		//console.log(self.vue.student_search);
		if (search != "") {
			self.get_search(search);
			self.goto('tutor_result_page');
		}
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

	};

	self.get_initial_user_info = function () {
		//console.log("get initial user info");
		$.get(api_get_initial_user_info_url,
			function (data) {
				self.vue.post_array = data.posts
				self.vue.current_user = data.curr_user
				console.log(self.vue.current_user)
			});

	};

	self.get_users = function () {

		$.get(api_get_users_url,
			function (data) {
				self.vue.user_list = data.user_list
			});

	};

	//	self.set_price = function (i_id) {
	//		console.log(self.vue.url_array[i_id])
	//		console.log(self.vue.price_array[i_id])
	//		$.post(api_set_price_url, {
	//			image: self.vue.url_array[i_id],
	//			new_price: self.vue.price_array[i_id]
	//		})
	//		self.get_links(self.vue.current_user);
	//
	//	}
	self.update_post = function () {

		var this_user = self.vue.user_list[self.vue.current_user - 1]
		console.log(this_user.first_name)
		console.log("update posting");
		$.post(api_update_post_url, {
			first_name: this_user.first_name,
			email: this_user.email
		})

	}


	// Complete as needed.
	self.vue = new Vue({
		el: "#vue-div",
		delimiters: ['${', '}'],
		unsafeDelimiters: ['!{', '}'],

		data: {
			current_user: "",
			user_list: [],
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
			get_search: self.get_search,
			goto: self.goto,
			get_initial_user_info: self.get_initial_user_info,
			update_post: self.update_post,
			join: self.join
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

	self.get_initial_user_info();

	self.get_users();

	return self;
};


var APP = null;


// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () {
	APP = app();
});
