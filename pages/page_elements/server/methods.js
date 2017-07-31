Meteor.methods({
  "insert_comment": function(comment){
    Comments.insert(comment);
  }
})
