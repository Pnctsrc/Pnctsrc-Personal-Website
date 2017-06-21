Template.postView.helpers({
  "post": function(){
    return Posts.findOne();
  },

  "getTime": function(date){
    return $.timeago(date);
  },
})
