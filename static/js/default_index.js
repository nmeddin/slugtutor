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

	self.contains = function (a, b) {
		b_Object = JSON.stringify(b);
		for (var i = 0; i < a.length; i++) {
			if (JSON.stringify(a[i]) == b_Object) return true;
			return false;
		}
	};

	//This is the random quote generator endpoint 

	const quote_endpoint = 'https://quotes.rest/qod?category=students';

	self.getQuote = function () {
		$.getJSON(quote_endpoint, function (data) {
			self.vue.quoteText = data.contents.quotes[0].quote;
			self.vue.quoteAuthor = data.contents.quotes[0].author;
		});
	}

	self.get_initial_user_info = function () {
		$.get(api_get_initial_user_info_url,
			function (data) {
				self.vue.post_array = data.posts

			});
	};

	self.get_in_demand_classes = function () {

		self.vue.in_demand = self.vue.class_list;

	}


	Vue.component('post-card', {
		props: {
			post: Object,
		},
		data: function () {
			return {
				classname: this.post.classname,
				dept: this.post.department,
				type: ''
			}
		},
		events: {

		},
		methods: {
			join: function () {
				//console.log(this.post.id);
				console.log(self.vue.user_list[0].email + ' wants to join')

			}
		},
		template: `<div class="card" style="width: 18rem;">
  <img v-if="this.post.department=='CMPS'" class="card-img-top" src="https://comps.canstockphoto.com/happy-computer-drawing_csp1651204.jpg" alt="Card image cap">
  <img v-if="this.post.department=='CMPE'" class="card-img-top" src="http://www.clipartquery.com/images/39/gallery-for-computer-engineering-clipart-IARWQW.jpg" alt="Card image cap">
  <img v-if="this.post.department=='EE'" class="card-img-top" src="http://fscomps.fotosearch.com/compc/CSP/CSP500/dangerous-work-with-electricity-clipart__k40115174.jpg" alt="Card image cap">

  <div class="card-body">
    <h5 class="card-title">{{post.classname}}</h5>
	<h6>{{post.department}}{{post.classnum}}</h6>
    <p class="card-text">Tutor: {{post.leader_name}}<br>Email: {{post.leader_email}}<br>{{post.num_students_joined}}/5 students joined</p>
    <a  v-on:click="this.join" class="btn btn-primary">Join</a>
  </div>
</div>`
	})



	Vue.component('demo-grid', {
		template: ` 
	    <table>
	    <thead>
	      <tr>
	        <th v-for="key in columns"
	          @click="sortBy(key)"
	          :class="{ active: sortKey == key }">
	          {{ key | capitalize }}
	          <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
	          </span>
	        </th>
	      </tr>
	    </thead>
	    <tbody>
	      <tr v-for="entry in filteredData">
	        <td v-for="key in columns">
	          {{entry[key]}}
	        </td>
	      </tr>
	    </tbody>
	  </table>
	  `,
		props: {
			data: Array,
			columns: Array,
			filterKey: String
		},
		data: function () {
			var sortOrders = {}
			this.columns.forEach(function (key) {
				sortOrders[key] = 1
			})
			return {
				sortKey: '',
				sortOrders: sortOrders
			}
		},
		computed: {
			filteredData: function () {
				var sortKey = this.sortKey
				var filterKey = this.filterKey && this.filterKey.toLowerCase()
				var order = this.sortOrders[sortKey] || 1
				var data = this.data
				if (filterKey) {
					data = data.filter(function (row) {
						return Object.keys(row).some(function (key) {
							return String(row[key]).toLowerCase().indexOf(filterKey) > -1
						})
					})
				}
				if (sortKey) {
					data = data.slice().sort(function (a, b) {
						a = a[sortKey]
						b = b[sortKey]
						return (a === b ? 0 : a > b ? 1 : -1) * order
					})
				}
				return data
			}
		},
		filters: {
			capitalize: function (str) {
				return str.charAt(0).toUpperCase() + str.slice(1)
			}
		},
		methods: {
			sortBy: function (key) {
				this.sortKey = key
				this.sortOrders[key] = this.sortOrders[key] * -1
			}
		}
	})

	self.update_post = function () {

		var this_user = self.vue.user_list[self.vue.current_user - 1]
		console.log(this_user.first_name)
		console.log("update posting");
		$.post(api_update_post_url, {
			first_name: this_user.first_name,
			email: this_user.email
		})

	}

	self.join = function () {

		console.log('join');

	}


	self.search_for_tutors = function (search) {
		console.log(self.vue.selected_dept);
		console.log(search);
		self.get_initial_user_info();

		//console.log(self.vue.student_search);
		if (search != "") {
			self.get_search(search);
			self.append_in_demand(search);

			self.goto('tutor_result_page');
		}
	}


	self.append_in_demand = function (search) {
		$.get(api_get_demand_url, {
				search: search,
				dept: self.vue.selected_dept
			},
			function (data) {
				if (data.row_info == null) return;
				if (self.contains(self.vue.in_demand, data.row_info)) return;
				if (self.vue.in_demand.length < 5) {
					self.vue.in_demand.push(data.row_info);
				} else {
					self.vue.in_demand.shift();
					self.vue.in_demand.push(data.row_info);
				}
			}
		);
	};

	self.get_gridData = function () {
		for (var i = 0; i < self.vue.in_demand.length; i++) {
			if (self.vue.gridData.includes(self.vue.in_demand[i])) continue;
			else self.vue.gridData[i] = self.vue.in_demand[i];
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
		
		if(page=='main'){
			self.get_gridData();
		}

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

	self.get_initial_class_info = function () {
		//console.log("get initial user info");
		$.get(api_get_initial_class_info_url,
			function (data) {
				self.vue.departments = data.departments
				console.log(self.vue.departments)
			});

	};

	self.get_users = function () {

		$.get(api_get_users_url,
			function (data) {
				self.vue.user_list = data.user_list
			});

	};






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
			post_array: [],
			departments: [],
			selected_dept: "CMPS",
			gridColumns: ['department', 'class_id', 'title'],
			gridData: [],
			searchQuery: ""

		},
		events: {
			'join-button-clicked': function (classname) {
				console.log(classname)
			}
		},
		methods: {
			getQuote: self.getQuote,
			search_for_tutors: self.search_for_tutors,
			add_post: self.add_post,
			go_home: self.go_home,
			get_search: self.get_search,
			goto: self.goto,
			get_initial_user_info: self.get_initial_user_info,
			get_initial_class_info: self.get_initial_class_info,
			update_post: self.update_post,
			join: self.join,
			get_gridData: self.get_gridData
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

	self.get_initial_class_info();

	self.get_users();
	
	self.get_gridData();

	return self;
};


var APP = null;


// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () {
	APP = app();
});
