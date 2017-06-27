Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'blank',
	notFoundTemplate: 'notFound'
	//waitOn: function() {return true;}   // later we'll add more interesting things here ....
});

Router.route("/posts",{
	name: 'posts',
	waitOn: function(){
		return Meteor.subscribe("metadata", "posts");
	},
	action: function(){
		//check if there's a page number in the query
		const requested_page = Router.current().params.query.page;
		const total_pages = Math.ceil(MetaData.findOne().total_count / MetaData.findOne().posts_per_page);

		if (!/^-?\d+$/i.test(requested_page)) {
			Router.go("/posts?page=1");
		} else if (parseInt(requested_page) > total_pages){
			Router.go("/posts?page=" + total_pages);
		} else if (parseInt(requested_page) <= 0){
			Router.go("/posts?page=1");
		} else {
			Router.go("/posts?page=" + requested_page);
		}
		this.render();
	},
});

Router.route("/posts/view/:_id",{
	name:'postView',
})

Router.route("/posts/view/:_id/edit",{
	name:'editPost',
})

Router.route("/post_new",{
	name: 'newPost',
})

Router.route("/works", {
	name: 'works',
})
