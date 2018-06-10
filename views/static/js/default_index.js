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

	self.search_for_tutors = function (idx,class_num) {
		// console.log(search);
		console.log(class_dept);

		if (class_num != "") {
			$.getJSON(search_tutors_url,
				{
					class_department: self.vue.option[idx]
					class_number: class_num
				}, function(data){
					// Here you return back the available postings for that query
					if(data.success){
						console.log("return postings now")
					  self.vue.postings = data.posting
					}
				})
		// self.get_search(search);
		 } else {
		 	self.get_classes;
		 }
	 };
		self.goto('tutor_result_page');
		// $.getJSON(get_memos_url(0, 10), function (data) {
		//     self.vue.in_demand = data.memos;

		// });
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

	Vue.component('tutor-card', {
		props: ['tutor'],
		template: `<div class="container-fluid">
		  <div class="col-sm-5">
			  <div class="border">
			  <div class="row">

				  <div class="col-sm-4">
					  <img src="https://cdn3.iconfinder.com/data/icons/sympletts-part-3/128/circle-user-2-128.png">
					  <p>five star rating</p>
					  <p>Classname</p>
				  </div>
				  <div class="col-sm-8">
				  <p>Firstname Lastname</p>
					<p>email@ucsc.edu</p>
					  <p>(123)456-7890</p>
					  <div class="row">

					  </div>
				  </div>
			  </div>
			</div>
		  </div>
	  </div>`
	})



	self.go_home = function () {
		self.vue.tutor_result_page = false;
		self.vue.main_page = true;
	}

	self.get_classes = function () {
		$.get(api_get_classes_url,
			function (data) {
				self.vue.class_list = data.classes
			});
	};

	self.get_search = function (search) {
		$.get(api_get_search_url, {
				search: search
			},
			function (data) {
				self.vue.class_list = data.results
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


	// Complete as needed.
	self.vue = new Vue({
		el: "#vue-div",
		delimiters: ['${', '}'],
		unsafeDelimiters: ['!{', '}'],

		data: {
			selected: "CMPS 183",
			student_search: "",
			class_dept: [
				{text: 'AMS', value: 'AMS'},
				{text: 'CMPS', value: 'CMPS'},
				{text: 'CMPE', value: 'CMPE'}
			],
			tutor_input: "",
			in_demand: [],
			quoteText: "",
			quoteAuthor: "",
			main_page: true,
			tutor_result_page: false,
			class_list: [],
			postings: [],
			page: 'main',
			tutor_cards: [],
			picked: ""

		},
		methods: {
			getQuote: self.getQuote,
			search_for_tutors: self.search_for_tutors,
			add_post: self.add_post,
			go_home: self.go_home,
			get_classes: self.get_classes,
			get_search: self.get_search,
			goto: self.goto
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


	self.get_classes();

	return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () {
	APP = app();
});
