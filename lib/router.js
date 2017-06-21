Router.configure({
	layoutTemplate: 'layout',
	//loadingTemplate: 'loading',
	//waitOn: function() {return true;}   // later we'll add more interesting things here ....
});

Router.route("/posts/:page_num",{
	name: 'posts',
	waitOn: function(){
		return Meteor.subscribe("post_list", this.params.page_num);
	},
	action: function(){
		if(Posts.find().count() == 0){
	    Router.go("/posts/1");
	  } else {
			this.render();
		}
	}
});

Router.route("/posts/view/:_id",{
	name:'postView',
	waitOn: function(){
		return Meteor.subscribe("get_post", this.params._id);
	},
	action: function(){
		if(!Posts.findOne()){
	    Router.go("/posts/1");
	  } else {
			this.render();
		}
	}
})

Router.route("/post_new",{
	name: 'new'
})
