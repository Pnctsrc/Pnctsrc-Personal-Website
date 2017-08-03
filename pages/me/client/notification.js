Template.notification.onRendered(function(){
  $('.ui.secondary.menu .item').tab();
})

Template.notification.helpers({
  "notification_list": function(){
    return Notifications.find().fetch();
  },
  "hasNotifications": function(){
    return Notifications.findOne();
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
