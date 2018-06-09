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
					<p>{{post.leader_email}}</p>
					  <p>(123)456-7890</p>
				  </div>
			  </div>
			</div>
		  </div>
	  </div>`
	})


	self.update_posting = function () {
		
		console.log("update posting");
		
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
	
	

	// Complete as needed.
	self.vue = new Vue({
		el: "#vue-div",
		delimiters: ['${', '}'],
		unsafeDelimiters: ['!{', '}'],

		data: {
			current_user: "",
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
			update_posting: self.update_posting
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

	return self;
};


var APP = null;


// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () {
	APP = app();
});
