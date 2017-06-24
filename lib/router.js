Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'blank',
	notFoundTemplate: 'notFound'
	//waitOn: function() {return true;}   // later we'll add more interesting things here ....
});

Router.route("/posts/:page_num",{
	name: 'posts',
	waitOn: function(){
		return [Meteor.subscribe("post_list", this.params.page_num), Meteor.subscribe("metadata", "posts")];
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
		const post_id = this.params._id.match(/^[0-9A-Za-z]{17}(?=(#[0-9a-zA-Z_-]+)?$)/gi);
		if(!post_id){
			return [];
		} else {
			return Meteor.subscribe("get_post", post_id[0]);
		}
	},
	action: function(){
		if(!Posts.findOne()){
	    Router.go("/posts/1");
	  } else {
			this.render();
		}
	}
})

Router.route("/posts/view/:_id/edit",{
	name:'edit',
	waitOn: function(){
		const post_id = this.params._id.match(/^[0-9A-Za-z]{17}(?=(#[0-9a-zA-Z_-]+)?$)/gi);
		if(!post_id){
			return [];
		} else {
			const access_key = Router.current().params.hash;
			return [Meteor.subscribe("get_post", post_id[0]), Util.waitOnServer("get_s3_signature", access_key)];
		}
	},
	onBeforeAction: function(){
		var one = IRLibLoader.load('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.25.0/codemirror.min.js');
    if(one.ready()){
      var two = IRLibLoader.load('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.25.0/mode/xml/xml.min.js');
			if(two.ready()){
				this.next();
			} else {
				this.render('blank');
			}
    } else {
			this.render('blank');
		}

		//make sure only the user with the access key can edit the post
		if(this.ready()){
			const result = Util.getResponse("get_s3_signature");
			if(result.error){
				const post_id = this.params._id.match(/^[0-9A-Za-z]{17}(?=(#[0-9a-zA-Z_-]+)?$)/gi);
				Router.go("/posts/view/" + post_id);
				window.alert(result.message);
			} else {
				this.data = result;
			}
		}
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
	name: 'new',
	waitOn: function(){
		const access_key = Router.current().params.hash;
		return [Util.waitOnServer("get_s3_signature", access_key)];
	},
	onBeforeAction: function(){
		var one = IRLibLoader.load('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.25.0/codemirror.min.js');
    if(one.ready()){
      var two = IRLibLoader.load('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.25.0/mode/xml/xml.min.js');
			if(two.ready()){
				this.next();
			} else {
				this.render('blank');
			}
    } else {
			this.render('blank');
		}

		//make sure only the user with the access key can edit the post
		if(this.ready()){
			const result = Util.getResponse("get_s3_signature");
			if(result.error){
				Router.go("/posts/1");
				window.alert(result.message);
			} else {
				this.data = result;
			}
		}
  },
})
