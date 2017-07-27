Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'blank',
	notFoundTemplate: 'notFound',
	waitOn: function() {
		return Meteor.subscribe("homepage");
	},
	onBeforeAction: function(){
		if (Meteor.isClient){
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
		}
		
		this.next();
	},
});

Router.route("/posts",{
	name: 'posts'
});

Router.route("/posts/view/:post_title",{
	name:'postView'
})

Router.route("/works/view/:work_title",{
	name:'workView'
})

Router.route("/posts/view/:post_title/edit",{
	name:'editPost',
	action: function(){
		this.render("authentication");
	},
})

Router.route("/works/view/:work_title/edit",{
	name:'editWork',
	action: function(){
		this.render("authentication");
	},
})

Router.route("/post_new",{
	action: function(){
		this.render("authentication");
	},
})

Router.route("/work_new",{
	name: 'newWork',
	action: function(){
		this.render("authentication");
	},
})

Router.route("/works", {
	name: 'works'
})

Router.route("/about", {
	name: 'about'
})

Router.route("/about/edit", {
	action: function(){
		this.render("authentication");
	},
})
