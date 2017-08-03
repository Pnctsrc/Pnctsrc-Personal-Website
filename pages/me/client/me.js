Template.me.helpers({
  "ifActive": function(name){
    const page_type = Router.current().route._path.match(/(profile|notifications)/)[0];
    return name === page_type ? "active" : "";
  },
  "profilePage": function(){
    return Router.current().route._path.match(/profile/);
  },
  "notificationsPage": function(){
    return Router.current().route._path.match(/notifications/);
  }
})

Template.me.events({
  "click .profile-login": function(){
 		Meteor.loginWithGoogle();
  }
})
