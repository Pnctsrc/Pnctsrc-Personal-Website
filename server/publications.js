Meteor.publish({
  "homepage": function(){
    return Homepage.find();
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
