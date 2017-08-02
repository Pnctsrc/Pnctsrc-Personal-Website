Meteor.methods({
  "insert_comment": function(comment){
    //validate
    if(!this.userId){
      throw new Meteor.Error("403", "Not logged in.");
    }

    comment.userId = this.userId;
    comment.createdAt = new Date();
    Comments.insert(comment);
  }
})
