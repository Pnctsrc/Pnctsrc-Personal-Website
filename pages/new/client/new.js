Template.new.onRendered(function(){
  const s3hash = this.data;
  if(!s3hash){
    location.reload;
  }
  
  $('div#froala-editor').froalaEditor({
    imageUploadToS3: s3hash.image,
    fileUploadToS3: s3hash.file,
    codeMirror: true,
    codeMirrorOptions: {
      indentWithTabs: true,
      lineNumbers: true,
      lineWrapping: true,
      mode: 'text/html',
      tabMode: 'indent',
      tabSize: 4
    },
    tabSpaces: 4
  });

  $('#post_tag')
    .dropdown({
      allowAdditions: true
    })
  ;
})

Template.new.events({
  "click #post_submit": function(){
    const access_key = Router.current().params.hash;
    const submit_object = {
      HTML_content: $('#froala-editor').froalaEditor('html.get', true),
      title: $("#post_title").val(),
      description: $("#post_description textarea").val(),
      tags: $("#post_tag").dropdown("get value").split(",")
    };

    Meteor.call("submit_post", submit_object, access_key, function(err, result){
      if(err){
        window.alert(err);
        Router.go("/posts?page=1");
        return;
      }

      Router.go("/posts/view/" + result);
    });
  }
})
