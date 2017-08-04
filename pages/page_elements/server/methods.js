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
    const comment_id = Comments.insert(comment);

    //send notification
    const target_comment = Comments.findOne(comment.target_comment);
    if(comment.target_comment && target_comment.userId !== comment.userId){
      const notification = {
        sender: comment.userId,
        userId: target_comment.userId,
        read: false,
        comment_id: comment.target_comment,
        from_comment: comment_id,
        document_id: target_comment.document_id,
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
    const comment_document = Comments.findOne(comment_id);
    if(Comments.findOne({parent_comment: comment_id})){
      const user_list = new Set();
      var related_comments = Comments.find({parent_comment: comment_id}).fetch();

      while(related_comments.length != 0){
        const current_doc = related_comments.splice(0, 1)[0];
        related_comments = related_comments.concat(Comments.find({parent_comment: current_doc._id}).fetch());
        Comments.update(current_doc._id, {$set: {
          document_id: "deleted_" + current_doc.document_id,
          target_comment: "deleted_" + current_doc.target_comment,
          parent_comment: "deleted_" + current_doc.parent_comment
        }});
        if(current_doc.userId !== this.userId){
          user_list.add(current_doc.userId);
        }
      }

      //send Notifications
      const date = new Date();
      for(var userId of user_list){
        const notification = {
          userId: userId,
          sender: this.userId,
          createdAt: date,
          read: false,
          from_comment: "deleted_" + comment_id,
          document_id: comment_document.document_id,
          type: Posts.findOne(comment_document.document_id) ? "posts" : "works"
        }

        Notifications.insert(notification);
      }
    }

    //delete notifications for documents that do not exist
    Notifications.remove({
      sender: comment_document.userId,
      comment_id: comment_document.target_comment,
      from_comment: comment_id,
      document_id: comment_document.document_id,
      type: Posts.findOne(comment_document.document_id) ? "posts" : "works",
      userId: Comments.findOne(comment_document.target_comment).userId
    });

    Comments.remove(comment_id);
  }
})
