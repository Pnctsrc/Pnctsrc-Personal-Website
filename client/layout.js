Template.layout.helpers({
  "homepage": function(){
    return Homepage.findOne();
  },
  "ifActive": function(name){
    const page_type = Router.current().route._path.match(/(works|posts|about|me)/)[0];
    return name === page_type ? "active" : "";
  }
})

Template.layout.events({
  "click .js-login": function(event){
 		event.preventDefault();
 		Meteor.loginWithGoogle(function(err){
			if(err){
				window.alert(err);
      };
		});
 	},
})
