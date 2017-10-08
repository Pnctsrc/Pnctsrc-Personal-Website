Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'blank',
	notFoundTemplate: 'notFound',
	waitOn: function() {
		return [Meteor.subscribe("homepage"), Meteor.subscribe("user")];
	},
});

EditController = RouteController.extend({
	onBeforeAction: function(){
    var one = IRLibLoader.load('http://netdna.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.js');
    if(one.ready()){
      var two = IRLibLoader.load('https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/components/dropdown.js');
      if(two.ready()){
        this.next();
				return;
      } else {
				this.render('blank');
			}
    } else {
			this.render('blank');
		}
  }
});

Router.route("/me/profile", {
	template: "me",
	action: function(){
		document.title = "Profile | Pnctsrc";
		this.render();
	}
})

Router.route("/me/notifications", {
	template: "me",
	waitOn: function(){
		return Meteor.subscribe("notifications");
	},
	onRun: function(){
		document.title = "Notifications | Pnctsrc";
		this.next();
	}
})

Router.route("/posts",{
	name: 'posts',
	action: function(){
		document.title = "Posts | Pnctsrc";
		this.render();
	}
});

Router.route("/posts/view/:post_title",{
	name:'postView',
	action: function(){
		document.title = decodeURIComponent(this.params.post_title).replace(/_/gi, " ") + " | Pnctsrc";
		this.render();
	}
})

Router.route("/works/view/:work_title",{
	name:'workView',
	action: function(){
		document.title = decodeURIComponent(this.params.work_title).replace(/_/gi, " ") + " | Pnctsrc";
		this.render();
	}
})

Router.route("/posts/view/:post_title/edit",{
	name:'editPost',
	controller: "EditController",
	action: function(){
		document.title = "Edit Post | Pnctsrc";
		this.render("authentication");
	},
})

Router.route("/works/view/:work_title/edit",{
	name:'editWork',
	controller: "EditController",
	action: function(){
		document.title = "Edit Work | Pnctsrc";
		this.render("authentication");
	},
})

Router.route("/post_new",{
	name: 'newPost',
	controller: "EditController",
	action: function(){
		document.title = "New Post | Pnctsrc";
		this.render("authentication");
	},
})

Router.route("/work_new",{
	name: 'newWork',
	controller: "EditController",
	action: function(){
		document.title = "New Work | Pnctsrc";
		this.render("authentication");
	},
})

Router.route("/works", {
	name: 'works',
	action: function(){
		document.title = "Works | Pnctsrc";
		this.render();
	}
})

Router.route("/about", {
	name: 'about',
	action: function(){
		document.title = "About | Pnctsrc";
		this.render();
	}
})

Router.route("/about/edit", {
	controller: "EditController",
	action: function(){
		document.title = "Edit About | Pnctsrc";
		this.render("authentication");
	},
})
