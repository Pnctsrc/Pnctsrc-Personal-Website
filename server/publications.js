Meteor.publish({
  "homepage": function(){
    return Homepage.find();
  },
  "comments": function(document_id){
    //validate
    if(!document_id || typeof document_id !== "string") return;

    const self = this;
    Comments.find({document_id: document_id}).forEach(function(comment){
      const comment_id = comment._id;
      const profile = Meteor.users.findOne(comment.userId);
      const first_name = profile.pnctsrc.first_name;
      const last_name = profile.pnctsrc.last_name;
      const username = (first_name + " " + last_name).replace(/ +/gi, " ").trim();
      if(/^ +$/gi.test(username)){
        comment.username = "Member";
        self.added("comments", comment_id, comment);
      } else {
        comment.username = username;
        self.added("comments", comment_id, comment);
      }
    });

    var handle = Comments.find({document_id: document_id}).observeChanges({
      added: function(id) {
        const comment = Comments.findOne(id);
        const profile = Meteor.users.findOne(comment.userId);
        const first_name = profile.pnctsrc.first_name;
        const last_name = profile.pnctsrc.last_name;
        const username = (first_name + " " + last_name).replace(/ +/gi, " ").trim();
        if(/^ +$/gi.test(username)){
          comment.username = "Member";
          self.added("comments", id, comment);
        } else {
          comment.username = username;
          self.added("comments", id, comment);
        }
      },
      changed: function(id, fields){
        self.changed("comments", id, fields);
      },
      removed: function(id){
        self.removed("comments", id);
      }
    })

    this.ready();
    this.onStop(() => handle.stop());
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
  },
  "notifications": function(){
    const self = this;
    Notifications.find({userId: this.userId}).forEach(function(notification){
      const notification_id = notification._id;

      //process text
      var URL, target_document, text;
      if(notification.type === "posts"){
        target_document = Posts.findOne(notification.document_id);
        URL = "/posts/view/" + encodeURIComponent(target_document.title.replace(/ +/g, "_"));
      } else {
        target_document = Works.findOne(notification.document_id);
        URL = "/works/view/" + encodeURIComponent(target_document.title.replace(/ +/g, "_"));
      }

      if(notification.from_comment.match(/deleted_/gi)){
        text = "<p>Deleted his/her comment in " + "<a target='_blank' href=\"" + URL +"\">" + target_document.title + "</a>, so all your comments related to this comment have been deleted.</p>";
      } else {
        text = "<p>Replied to your comment in " + "<a target='_blank' href=\"" + URL +"\">" + target_document.title + "</a></p>";
      }
      notification.text = text;

      //process user info
      const profile = Meteor.users.findOne(notification.sender);
      const first_name = profile.pnctsrc.first_name;
      const last_name = profile.pnctsrc.last_name;
      const username = (first_name + " " + last_name).replace(/ +/gi, " ").trim();
      if(/^ +$/gi.test(username)){
        notification.username = "Member";
        self.added("notifications", notification_id, notification);
      } else {
        notification.username = username;
        self.added("notifications", notification_id, notification);
      }
    });

    var handle = Notifications.find({userId: this.userId}).observeChanges({
      added: function(id) {
        const notification_id = id;
        const notification = Notifications.findOne(notification_id);
        //process text
        var URL, target_document;
        if(notification.type === "posts"){
          target_document = Posts.findOne(notification.document_id);
          URL = "/posts/view/" + encodeURIComponent(target_document.title.replace(/ +/g, "_"));
        } else {
          target_document = Works.findOne(notification.document_id);
          URL = "/works/view/" + encodeURIComponent(target_document.title.replace(/ +/g, "_"));
        }
        const text = "<p>Replied to your comment in " + "<a target='_blank' href=\"" + URL +"\">" + target_document.title + "</a></p>";
        notification.text = text;

        //process user info
        const profile = Meteor.users.findOne(notification.sender);
        const first_name = profile.pnctsrc.first_name;
        const last_name = profile.pnctsrc.last_name;
        const username = (first_name + " " + last_name).replace(/ +/gi, " ").trim();
        if(/^ +$/gi.test(username)){
          notification.username = "Member";
          self.added("notifications", notification_id, notification);
        } else {
          notification.username = username;
          self.added("notifications", notification_id, notification);
        }
      },
      changed: function(id, fields){
        self.changed("notifications", id, fields);
      },
      removed: function(id){
        self.removed("notifications", id);
      }
    })

    this.ready();
    this.onStop(() => handle.stop());
  }
})
