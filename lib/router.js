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
	name:'edit',
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
