Template.posts.onRendered(function(){
  if(Posts.find().count() == 0){
    Router.go("/posts/1");
  }
})

Template.posts.helpers({
  "post_list": function(){
    return Posts.find().fetch();
  },

  "getTime": function(date){
    return $.timeago(date);
  },
})
