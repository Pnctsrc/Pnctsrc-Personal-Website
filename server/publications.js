Meteor.publish({
  "homepage": function(){
    return Homepage.find();
  },
  "user": function(){
    return Meteor.users.find();
  }
})
