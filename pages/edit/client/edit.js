Template.edit.onRendered(function(){
  $('.fr-view-edit').froalaEditor({
    codeMirror: true,
    codeMirrorOptions: {
      indentWithTabs: true,
      lineNumbers: true,
      lineWrapping: true,
      mode: 'text/html',
      tabMode: 'indent',
      tabSize: 4
    },
  });

  $('#post_tag_edit')
    .dropdown({
      allowAdditions: true
    })
  ;

  if(Posts.findOne().tags.length != 0){
    $("#post_tag_edit").dropdown("set selected", Posts.findOne().tags);
  }
})

Template.edit.helpers({
  "post": function(){
    return Posts.findOne();
  },
})

Template.edit.events({
  "click #post_submit_edit": function(){
    const post_id = Posts.findOne()._id;
    const submit_object = {
      HTML_content: $('.fr-view-edit').froalaEditor('html.get', true),
      title: $("#post_title_edit").val(),
      description: $("#post_description_edit textarea").val(),
      tags: $("#post_tag_edit").dropdown("get value").split(",")
    };

    Meteor.call("submit_post_edit", submit_object, post_id, function(err, result){
      if(err){
        window.alert(err);
        return;
      }

      Router.go("/posts/view/" + post_id);
    });
  }
})
