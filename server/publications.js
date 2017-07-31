Meteor.publish({
  "homepage": function(){
    return Homepage.find();
  },
  "comments": function(post_id){
    return Comments.find({post_id: post_id});
  }
})
