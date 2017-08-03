Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'blank',
	notFoundTemplate: 'notFound',
	waitOn: function() {
		return [Meteor.subscribe("homepage"), Meteor.subscribe("user")];
	},
});

Router.route("/me/profile", {
	template: "me",
})

Router.route("/me/notifications", {
	template: "me",
	waitOn: function(){
		return Meteor.subscribe("notifications");
	}
})

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
