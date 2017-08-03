Meteor.methods({
  "insert_comment": function(comment, type){
    //validate
    if(!this.userId){
      throw new Meteor.Error("403", "Not logged in.");
    } else if(comment.text.match(/<((?!(a|strong|blockquote|code|h1|h2|h3|i|li|ol|p|pre|ul|br|hr|s|em|u)).)*>/gi)){
      throw new Meteor.Error("400", "Invalid HTML.");
    } else if(comment.text.replace(/<\/?(\w|\d)+>/gi, "").length == 0 || /^ *$/gi.test(comment.text)){
      throw new Meteor.Error("400", "Empty HTML content.");
    }

    comment.userId = this.userId;
    comment.createdAt = new Date();
    Comments.insert(comment);

    //send notification
    if(comment.target_comment){
      const notification = {
        sender: comment.userId,
        userId: Comments.findOne(comment.target_comment).userId,
        read: false,
        comment_id: comment.target_comment,
        document_id: Comments.findOne(comment.target_comment).document_id,
        createdAt: comment.createdAt,
        type: type
      }

      Notifications.insert(notification);
    }
  },
  "delete_comment": function(comment_id){
    //validate
    if(!this.userId){
      throw new Meteor.Error("403", "Not logged in.");
    } else if (!Comments.findOne(comment_id)){
      throw new Meteor.Error("400", "No such comment.")
    } else if (Comments.findOne(comment_id).userId !== this.userId){
      throw new Meteor.Error("400", "No the same user.")
    }

    //remove all related comments
    if(Comments.findOne({parent_comment: comment_id})){
      var related_comments = Comments.find({parent_comment: comment_id}).fetch();
      while(related_comments.length != 0){
        const current_doc = related_comments.splice(0, 1)[0];
        related_comments = related_comments.concat(Comments.find({parent_comment: current_doc._id}).fetch());
        Comments.remove(current_doc._id);
      }
    }

    Comments.remove(comment_id);
  }
})
