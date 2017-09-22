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
    var view_regex = new RegExp("^\\/(works|posts)\\/view\\/:(post|work)_title$");
    return Router.current().route._path.match(view_regex);
  },
  "getListName": function(){
    if(Router.current().route._path.match(/\/posts\/view\/:post_title$/)){
      return "Posts";
    } else if(Router.current().route._path.match(/\/works\/view\/:work_title$/)){
      return "Works";
    }
  }
})

Template.layout.events({
  "click .js-login": function(event){
 		event.preventDefault();
 		Meteor.loginWithGoogle();
 	},
  "click .goback": function(){
    var page_url;
    if(Router.current().route._path.match(/\/posts\/view\/:post_title$/)){
      page_url = Session.get("last_visited_post_url");
      if(!page_url){
        Router.go("/posts?page=1");
      } else {
        Router.go(page_url);
      }
    } else if(Router.current().route._path.match(/\/works\/view\/:work_title$/)){
      page_url = Session.get("last_visited_work_url");
      if(!page_url){
        Router.go("/works?page=1");
      } else {
        Router.go(page_url);
      }
    }
  }
})
