Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'blank',
	notFoundTemplate: 'notFound'
	//waitOn: function() {return true;}   // later we'll add more interesting things here ....
});

CustomController = RouteController.extend({
	onBeforeAction: function(){
		const page_type = Router.current().url.match(/(work|post|about)/)[0];
	  var link_type;

	  if(page_type === "post"){
	    link_type = "blog";
	  } else if (page_type === "work"){
	    link_type = "works";
	  } else if (page_type === "about"){
	    link_type = "about";
	  }

	  $("#link_list a").removeClass("active");
	  $("#collapse_button ul a").removeClass("active");
	  $("#collapse_button ul a[class=" + link_type + "_link]").addClass("active");
	  $("#link_list a[class=" + link_type + "_link]").addClass("active");

		this.next();
	}
});

Router.route("/posts",{
	name: 'posts',
	controller: 'CustomController'
});

Router.route("/posts/view/:_id",{
	name:'postView',
	controller: 'CustomController'
})

Router.route("/works/view/:_id",{
	name:'workView',
	controller: 'CustomController'
})

Router.route("/posts/view/:_id/edit",{
	name:'editPost',
	controller: 'CustomController'
})

Router.route("/works/view/:_id/edit",{
	name:'editWork',
	controller: 'CustomController'
})

Router.route("/post_new",{
	name: 'newPost',
	controller: 'CustomController'
})

Router.route("/work_new",{
	name: 'newWork',
	controller: 'CustomController'
})

Router.route("/works", {
	name: 'works',
	controller: 'CustomController'
})

Router.route("/about", {
	name: 'about',
	controller: 'CustomController'
})
