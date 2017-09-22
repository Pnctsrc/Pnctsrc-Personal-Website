Template.layout.helpers({
  "homepage": function(){
    return Homepage.findOne();
  },
  "ifActive": function(name){
    if(!Router.current().route || Router.current().route._path.match(/(post_new|work_new)/)) return;

    const page_type = Router.current().route._path.match(/(works|posts|about|me)/)[0];
    return name === page_type ? "active" : "";
  },
  "isView": function(){
    return Router.current().route._path.match(/\/view\//);
  }
})

Template.layout.events({
  "click .js-login": function(event){
 		event.preventDefault();
 		Meteor.loginWithGoogle();
 	},
})
