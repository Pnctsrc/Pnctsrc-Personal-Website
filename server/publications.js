Meteor.publish({
  "homepage": function(){
    return Homepage.find();
  },
  "comments": function(post_id){
    const self = this;
    Comments.find({post_id: post_id}).forEach(function(comment){
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

    var handle = Comments.find({post_id: post_id}).observeChanges({
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
    return Notifications.find({userId: this.userId});
  }
})
