Meteor.publish({
  "homepage": function(){
    return Homepage.find();
  },
  "comments": function(post_id){
    return Comments.find({post_id: post_id});
  },
  "user": function(){
    return Meteor.users.find({
      _id: this.userId
    },{
      fields:{
        "profile.name": 1,
        pnctsrc: 1,
        "services.google.email": 1
      }
    });
  }
})
