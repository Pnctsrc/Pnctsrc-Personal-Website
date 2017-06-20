Template.new.onRendered(function(){
  $('div#froala-editor').froalaEditor({

  });

  $('#post_tag')
    .dropdown({
      allowAdditions: true
    })
  ;
})

Template.new.events({
  "click #post_submit": function(){
    const submit_object = {
      HTML_content: $('#froala-editor').froalaEditor('html.get', true),
      title: $("#post_title").val(),
      description: $("#post_description textarea").val(),
      tags: $("#post_tag").dropdown("get value").split(",")
    };

    Meteor.call("submit_post", submit_object, function(err, result){
      if(err){
        window.alert(err);
        return;
      }
    });
  }
})
