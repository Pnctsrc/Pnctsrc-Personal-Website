Router.configure({
	layoutTemplate: 'layout',
	//loadingTemplate: 'loading',
	//waitOn: function() {return true;}   // later we'll add more interesting things here ....
});

Router.route("/posts/:page_num",{
	name: 'posts',
	waitOn: function(){
		return Meteor.subscribe("post_list", this.params.page_num);
	}
});

Router.route("/posts/new",{
	name: 'new'
})
