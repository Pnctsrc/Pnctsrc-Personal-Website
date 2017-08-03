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

  import Quill from 'quill'

  var quill_buttons = [{ 'header': 1 }, { 'header': 2 }, 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', { 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }, { 'align': [] },'clean', 'source'];
  var quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
       toolbar: {
         container: quill_buttons,
         handlers: {
           'source': function(){
             //show warning
             $(".ui.message.hidden").transition('fade');

             const textarea = $("#editor .ql-custom textarea");
             if(textarea.css("display") === "none"){
               $("#editor .ql-formats > button[class!='ql-source']").css("visibility", "hidden");
               $("#editor .ql-formats > span").css("visibility", "hidden");
               textarea.css("display", "block");
             } else {
               var html = txtArea.value;
               this.quill.pasteHTML(html);
               $("#editor .ql-formats > button[class!='ql-source']").css("visibility", "visible");
               $("#editor .ql-formats > span").css("visibility", "visible");
               textarea.css("display", "none");
             }
           },
         }
       }
     },
  });

  //add source view
  var txtArea = document.createElement('textarea');
  var htmlEditor = quill.addContainer('ql-custom');
  htmlEditor.appendChild(txtArea);
  quill.on('text-change', () => {
    var beautify = require('js-beautify').html_beautify;
    const html_content = $("#editor .ql-editor")[0].innerHTML;
    txtArea.value = beautify(html_content);
  })

  this.editor = quill;

  //initialize message
  $('.message .close').on('click', function(){
    $(this).closest('.message').transition('fade');
    setTimeout(function(){
      $(".ui.message").remove();
    }, 500)
  })
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
  "click .actions .reply": function(event, instance){
    const replay_box_html = "<form class=\"ui attached reply form\"><div class=\"field\"><div id=\"editor-reply\"></div></div><div class=\"ui blue button js-reply-comment\">Reply</div></form>";

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
    import Quill from 'quill'

    var quill_buttons = [{ 'header': 1 }, { 'header': 2 }, 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', { 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }, { 'align': [] },'clean', 'source'];
    var quill = new Quill('#editor-reply', {
      theme: 'snow',
      modules: {
         toolbar: {
           container: quill_buttons,
           handlers: {
             'source': function(){
               const textarea = $("#editor-reply .ql-custom textarea");
               if(textarea.css("display") === "none"){
                 $("#editor-reply .ql-formats > button[class!='ql-source']").css("visibility", "hidden");
                 $("#editor-reply .ql-formats > span").css("visibility", "hidden");
                 textarea.css("display", "block");
               } else {
                 var html = txtArea.value;
                 this.quill.pasteHTML(html);
                 $("#editor-reply .ql-formats > button[class!='ql-source']").css("visibility", "visible");
                 $("#editor-reply .ql-formats > span").css("visibility", "visible");
                 textarea.css("display", "none");
               }
             },
           }
         }
       },
    });

    //add source view
    var txtArea = document.createElement('textarea');
    var htmlEditor = quill.addContainer('ql-custom');
    htmlEditor.appendChild(txtArea);
    quill.on('text-change', () => {
      var beautify = require('js-beautify').html_beautify;
      const html_content = $("#editor-reply .ql-editor")[0].innerHTML;
      txtArea.value = beautify(html_content);
    })

    instance.editor_reply = quill;

    //show editor
    $(".ui.attached.reply.form").css("opacity", "1");
    const comment_width = $(".ui.minimal.comments").width();
    const form_width = $('.ui.attached.reply.form').width();
    $('.ui.attached.reply.form > .field').css('padding-right', (form_width - comment_width) + "px");
    setTimeout(function(){

    })
  },
  "click .js-new-comment": function(event, instance){
    //get the current post data
    const current_post = instance.commentsDict.get("data_object");
    const quill = instance.editor;
    const html_content = $("#editor .ql-editor")[0].innerHTML;

    //validate text_input
    if(html_content.match(/<((?!(a|strong|blockquote|code|h1|h2|h3|i|li|ol|p|pre|ul|br|hr|s|em|u)).)*>/gi)){
      window.alert("Only <a>, <strong>, <blockquote>, <code>, <h1>, <h2>, <h3>, <i>, <li>, <ol>, <p>, <pre>, <ul>, <br>, <hr>, <s>, <em>, <u> are OK to use.");
      return;
    }

    const comment = {
      parent_comment: "",
      target_comment: "",
      text: html_content,
      post_id: current_post._id
    }

    Meteor.call("insert_comment", comment, function(err){
      if(err){
        window.alert(err);
        return;
      }
      quill.pasteHTML("");
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
  "commentsArray": function(comment){
    return Comments.find({parent_comment: comment._id}, {$sort: {createdAt: -1}}).fetch();
  },
  "hasComments": function(comment){
    return Comments.find({parent_comment: comment._id}).count() > 0;
  },
  "commentsDict": function(){
    return Template.instance().commentsDict;
  },
  "sameUser": function(target_user){
    return target_user === Meteor.userId();
  },
  "getText": function(text){
    return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
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
    const text_input = $("#editor-reply .ql-editor")[0].innerHTML;

    //validate text_input
    if(text_input.match(/<((?!(a|strong|blockquote|code|h1|h2|h3|i|li|ol|p|pre|ul|br|hr|s|em|u)).)*>/gi)){
      window.alert("Only <a>, <strong>, <blockquote>, <code>, <h1>, <h2>, <h3>, <i>, <li>, <ol>, <p>, <pre>, <ul>, <br>, <hr>, <s>, <em>, <u> are OK to use.");
      return;
    }

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
        //check existing thread
        if(Comments.findOne({parent_comment: target_parent, userId: Meteor.userId()})){//if the conversation has already started
          parent_comment = target_parent;
        } else {
          parent_comment = current_comment._id;
        }
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
  "click .js-delete-comment": function(event, instance){
    //make sure the template is correct
    if(event.currentTarget.parentNode.parentNode !== $(instance.firstNode)[0].firstElementChild) return;
    const current_comment = this.comment;

    //warn if it has comments inside
    if(Comments.findOne({parent_comment: current_comment._id})){
      if(!window.confirm("You'll also delete all the ralated comments. Are you sure you want to delete this comment?")){
        return;
      }
    }

    Meteor.call("delete_comment", current_comment._id, function(err){
      if(err){
        window.alert(err);
        return;
      }
    })
  }
})
