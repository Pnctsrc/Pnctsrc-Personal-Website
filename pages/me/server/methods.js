Meteor.methods({
  "save_profile_change": function(profile){
    //validate
    if(!this.userId){
      throw new Meteor.Error("403", "Not logged in.");
    } else if(!profile || !profile instanceof Object){
      throw new Meteor.Error("400", "Invalid profile.");
    } else if (!/^[a-zA-Z]{2,50}$/.test(profile.first_name)){
      throw new Meteor.Error("400", "Invalid first name.");
    } else if (!/^[a-zA-Z]{2,50}$/.test(profile.last_name)){
      throw new Meteor.Error("400", "Invalid last name.");
    }

    Meteor.users.update({_id: this.userId}, {$set:{
      pnctsrc: {
        first_name: profile.first_name,
        last_name: profile.last_name
      }
    }}, function(err, result){
      if(err){
        console.log(err);
      }
    });
  },
  "set_read": function(notification_id){
    //validate
    if(!notification_id || typeof notification_id !== "string"){
      throw new Meteor.Error("400", "Invalid notification ID.");
    }

    const notification = Notifications.findOne(notification_id);
    if(!this.userId){
      throw new Meteor.Error("403", "Not logged in.");
    } else if(!notification){
      throw new Meteor.Error("404", "No such notification.");
    }

    const notification_user = notification.userId;
    if(this.userId !== notification_user){
      throw new Meteor.Error("400", "Not the same user.");
    }

    //mark as read
    Notifications.update(notification_id, {$set: {read: true}});
  },
  "delete_notification": function(notification_id){
    //validate
    if(!notification_id || typeof notification_id !== "string"){
      throw new Meteor.Error("400", "Invalid notification ID.");
    }

    const notification = Notifications.findOne(notification_id);
    if(!this.userId){
      throw new Meteor.Error("403", "Not logged in.");
    } else if(!notification){
      throw new Meteor.Error("404", "No such notification.");
    }

    const notification_user = notification.userId;
    if(this.userId !== notification_user){
      throw new Meteor.Error("400", "Not the same user.");
    }

    //delete notification
    Notifications.remove(notification_id);
  },
  "set_all_read": function(){
    //validate
    if(!this.userId){
      throw new Meteor.Error("403", "Not logged in.");
    }

    Notifications.update({userId: this.userId, read: false}, {$set: {read: true}}, {multi: true});
  },
  "delete_all_notifications": function(){
    //validate
    if(!this.userId){
      throw new Meteor.Error("403", "Not logged in.");
    }

    Notifications.remove({userId: this.userId});
  },
})
