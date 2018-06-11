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

	self.get_in_demand_classes = function () {

		self.vue.in_demand = self.vue.class_list;

	}
	
	self.check_joined = function (p_id) {
		
		var jarray = self.vue.joined_post_array
		
		for(var i = 0; i < jarray.length; i++){
			
			if(jarray[i].id == p_id) return true;
			
		}
		
		return false;
		
	}

	Vue.component('post-card', {
		props: {
			post: Object,
		},
		created: function (){
			console.log("created post " + this.post.id);
			console.log("already joined? " + (self.check_joined(this.post.id)));
		},
		data: function () {
			return {
				dept: this.post.department,
				self_post: this.post.leader_email == self.vue.current_email,
				already_joined: self.check_joined(this.post.id)
			}
		},
		events: {

		},
		methods: {
			join: function () {
				console.log(self.vue.user_list[0].email + ' wants to join posting ' + this.post.id)
				if (self.vue.joined_post_array.indexOf(this.post.id) >= 0) {
					console.log('already joined')
					return
				}
				$.post(api_join_post_url, {
					email: self.vue.current_email,
					posting: this.post.id
				})

				self.vue.curr_post.leader_name = this.post.leader_name;
				self.vue.curr_post.meeting_location = this.post.meeting_location;
				self.vue.curr_post.day_of = this.post.day_of;
				self.vue.curr_post.start_time = this.post.start_time;

				self.vue.show_join_success = true;
				self.vue.goto('student_dashboard');

			},
			edit: function () {
				console.log('edit')
				
			}

		},
		template: `<div class="container" style="padding:30px; margin:10px">
			<div class="row justify-content-md-left ">
				<div class="col col-lg-2 border-top-0">
					<h5>{{post.department}}{{post.classnum}}</h5>
					<h6>{{post.classname}}</h6>
				</div>
				<div class="col-md-auto">
					{{post.leader_name}}, {{post.leader_email}}<br>
					*****<br>
					{{post.start_time}}-{{post.end_time}}, {{post.meeting_location}}
					
				</div>
				<div class="col col-lg-2 pull-right">
					<br>
 						<a v-if="!this.self_post && !this.already_joined" v-on:click="this.join" class="btn btn-primary pull-right">Join</a>
						<a v-if="this.already_joined && !this.self_post" class="btn btn-default disabled">Joined</a>
						<a v-if="this.self_post" v-on:click="this.edit" class="btn btn-primary pull-right">Edit</a>
				</div>
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

	self.get_joined_posts = function () {

		//console.log('get joined posts')
		$.get(api_get_joined_posts_url,
			function (data) {
				current_email: self.vue.current_email
				self.vue.joined_post_array = data.results

			});

	};




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

		if (search != "") {
			self.get_search(search);
			self.append_in_demand(search);

			self.goto('tutor_result_page');
		} else {
			
			console.log('empty search');

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
				search: search
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

		if (page == 'main') {
			self.get_gridData();
		}

		if (page == 'tutor_dashboard') {
			self.get_initial_user_info();
			//self.update_post();
		}

		if (page == 'student_dashboard') {
			setTimeout(function () {
				self.get_joined_posts();
			}, 1500)
		}

	};

	self.get_initial_user_info = function () {
		//console.log("get initial user info");
		$.get(api_get_initial_user_info_url,
			function (data) {
				self.vue.post_array = data.posts
				self.vue.current_user = data.curr_user
				self.vue.current_email = data.curr_email
				//console.log(self.vue.current_user)
			});

	};

	self.get_initial_class_info = function () {
		//console.log("get initial user info");
		$.get(api_get_initial_class_info_url,
			function (data) {
				self.vue.departments = data.departments
				//console.log(self.vue.departments)
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
			current_email: "",
			user_list: [],
			student_search: "",
			in_demand: [],
			quoteText: "",
			quoteAuthor: "",
			main_page: true,
			tutor_result_page: false,
			class_list: [],
			page: 'main',
			post_array: [],
			joined_post_array: [],
			departments: [],
			selected_dept: "CMPS",
			gridColumns: ['department', 'class_id', 'title'],
			gridData: [],
			searchQuery: "",
			styleObject: {
				color: '#8c4191',
				backgroundImage: 'url(https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/jPLiQ-9/mountains-background-for-titles-intro-projects-and-etc_ew22rur3l__F0000.png)'
			},
			curr_post: {
				leader_name: '',
				class_name: '',
				class_dept: '',
				start_time: '',
				meeting_location: '',
				day_of: '',
				show_this: true
			},
			show_join_success: false


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
			get_gridData: self.get_gridData,
			get_joined_posts: self.get_joined_posts
		},
		created: function () {

			this.get_initial_user_info();
			//console.log(this.post_array);
			if (this.quoteText == "") {
				this.getQuote();
			}
		}
	});

	self.get_initial_user_info();

	self.get_initial_class_info();

	self.get_users();

	self.get_gridData();

	self.get_joined_posts();

	return self;
};


var APP = null;


// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () {
	APP = app();
});