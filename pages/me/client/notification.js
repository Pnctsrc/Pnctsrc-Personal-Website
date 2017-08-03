Template.notification.onRendered(function(){
  $('.ui.secondary.menu .item').tab();
})

Template.notification.helpers({
  "notification_list": function(filter){
    if(filter == "new"){
      return Notifications.find({read: false}).fetch();
    } else {
      return Notifications.find().fetch();
    }
  },
  "hasNotifications": function(filter){
    if(filter == "new"){
      return Notifications.findOne({read: false});
    } else {
      return Notifications.findOne();
    }
  }
})

Template.notification.events({
  "click .js-all-read": function(){
    Meteor.call("set_all_read", function(err){
      if(err){
        window.alert(err);
        return;
      }
    })
  },
  "click .js-delete-all": function(){
    Meteor.call("delete_all_notifications", function(err){
      if(err){
        window.alert(err);
        return;
      }
    })
  }
})

Template.notification_row.helpers({
  "getTime": function(date){
    if(!date){
      return "";
    }

    function convertDate(inputFormat) {
      function pad(s) { return (s < 10) ? '0' + s : s; }
      var d = new Date(inputFormat);
      return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-');
    }

    var timeDiff = Math.abs(date.getTime() - (new Date()).getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if(diffDays == 1){
      return $.timeago(date);
    } else if (diffDays <= 7){
      return $.timeago(date) + " @ " + convertDate(date);
    } else {
      return convertDate(date);
    }
  },
})

Template.notification_row.events({
  "click div.text > p > a": function(){
    if(this.notification.read) return;
    Meteor.call("set_read", this.notification._id, function(err){
      if(err){
        window.alert(err);
        return;
      }
    })
  },
  "click .read": function(){
    if(this.notification.read) return;
    Meteor.call("set_read", this.notification._id, function(err){
      if(err){
        window.alert(err);
        return;
      }
    })
  },
  "click .delete": function(){
    Meteor.call("delete_notification", this.notification._id, function(err){
      if(err){
        window.alert(err);
        return;
      }
    })
  },
})
