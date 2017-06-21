Template.postView.onRendered(function(){
  if(Router.current().params.hash){
    window.location.hash = "";
    window.location.hash = Router.current().params.hash;
  }
})

Template.postView.helpers({
  "post": function(){
    return Posts.findOne();
  },

  "getTime": function(date){
    return $.timeago(date);
  },
})
