Template.comments.onCreated(function(){
  this.commentsDict = this.data.viewDict;
  this.subscribe("comments", this.commentsDict.get("data_object")._id);
})

Template.comments.onRendered(function(){
  $(window).resize(function() {
    if(Meteor.userId()){
      const comment_width = $(".ui.minimal.comments").width();
      const form_width = $('.ui.attached.reply.form').width();
      const reply_width = $(".ui.minimal.comments > .ui.reply.form").width();
      $('.ui.attached.reply.form > .field').css('padding-right', (form_width - comment_width) + "px");
      $(".ui.minimal.comments > .ui.reply.form > .field").css("padding-right", (reply_width - comment_width) + "px");
    }
  });
})

Template.comments.helpers({
  "commentsArray": function(){
    return Comments.find({parent_comment: ""}, {$sort: {createdAt: -1}}).fetch();
  },
  "commentsDict": function(){
    return Template.instance().commentsDict;
  }
})

Template.comments.events({
  "click .actions .reply": function(event){
    const replay_box_html = "<form class=\"ui attached reply form\"><div class=\"field\">\<textarea></textarea></div><div class=\"ui blue button js-reply-comment\">Reply</div></form>";

    //remove all previous reply forms on different comments
    if($(".ui.attached.reply.form")[0]){
      //don't attach new one if it's the same comment
      if($(".ui.attached.reply.form")[0].parentNode === event.currentTarget.parentNode.parentNode.parentNode){
        const current_opacity = $(".ui.attached.reply.form").css("opacity");
        const current_display = $(".ui.attached.reply.form").css("display");

        //toggle display
        if(current_display === "none"){
          $(".ui.attached.reply.form").css("display", "block");
          setTimeout(function(){
            $(".ui.attached.reply.form").css("opacity", Math.abs(current_opacity - 1));
          }, 100);
        } else {
          $(".ui.attached.reply.form").css("opacity", Math.abs(current_opacity - 1));
          setTimeout(function(){
            $(".ui.attached.reply.form").css("display", "none");
          }, 350);
        }

        return;
      }
    }
    $(".ui.attached.reply.form").remove();

    //attach a new form
    $(replay_box_html).insertAfter(event.currentTarget.parentNode.parentNode);
    setTimeout(function(){
      $(".ui.attached.reply.form").css("opacity", "1");
      const comment_width = $(".ui.minimal.comments").width();
      const form_width = $('.ui.attached.reply.form').width();
      $('.ui.attached.reply.form > .field').css('padding-right', (form_width - comment_width) + "px");
    })
  },
  "click .js-new-comment": function(event, instance){
    //get the current post data
    const current_post = instance.commentsDict.get("data_object");

    const comment = {
      username: $(".js-name").val(),
      createdAt: new Date(),
      parent_comment: "",
      text: $(".ui.reply.form textarea").val(),
      post_id: current_post._id
    }

    Meteor.call("insert_comment", comment, function(err){
      if(err){
        window.alert(err);
        return;
      }

      $(".ui.reply.form textarea").val("");
    });
  },
})

Template.comment_row.onCreated(function(){
  this.commentsDict = this.data.commentsDict;
})

Template.comment_row.onRendered(function(){
  if(Meteor.userId()){
    const comment_width = $(".ui.minimal.comments").width();
    const reply_width = $(".ui.minimal.comments > .ui.reply.form").width();
    $(".ui.minimal.comments > .ui.reply.form > .field").css("padding-right", (reply_width - comment_width) + "px");
  }
})

Template.comment_row.helpers({
  "getTime": function(date){
    if(!date){
      return "";
    }

    function convertDate(inputFormat) {
      function pad(s) { return (s < 10) ? '0' + s : s; }
      var d = new Date(inputFormat);
      return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-');
    }
    
    return convertDate(date);
  },
  "commentsArray": function(comment){
    return Comments.find({parent_comment: comment._id}, {$sort: {createdAt: -1}}).fetch();
  },
  "hasComments": function(comment){
    return Comments.find({parent_comment: comment._id}).count() > 0;
  },
  "commentsDict": function(){
    return Template.instance().commentsDict;
  }
})

Template.comment_row.events({
  "click .js-reply-comment": function(event, instance){
    //make sure the template is correct
    if(event.currentTarget.parentNode.parentNode !== instance.firstNode) return;

    //get the current post data
    const current_post = instance.commentsDict.get("data_object");

    //get the current comment data
    const current_comment = this.comment;
    const text_input = $(".ui.attached.reply.form textarea").val();
    var parent_comment;

    const target_user = current_comment.userId;
    const target_parent = current_comment.parent_comment;
    //if reply to self - always same level
    if(target_user === Meteor.userId()){
      parent_comment = target_parent;
    } else if(!target_parent){//if it is a comment at the first level - no parent
      parent_comment = current_comment._id;
    } else {
      const target_parent_userId = Comments.findOne(target_parent).userId;
      if(target_parent_userId === Meteor.userId()){//keep the same thread for the same two users
        parent_comment = target_parent;
      } else {
        parent_comment = current_comment._id;
      }
    }

    const comment = {
      parent_comment: parent_comment,
      target_comment: current_comment._id,
      text: text_input,
      post_id: current_post._id
    }

    Meteor.call("insert_comment", comment, function(err){
      if(err){
        window.alert(err);
        return;
      }

      $(".ui.attached.reply.form").remove();
    });
  },
})
