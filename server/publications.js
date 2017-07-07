Meteor.publish({
  "homepage": function(){
    return Homepage.find();
  },
})
