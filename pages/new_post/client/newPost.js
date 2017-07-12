Template.newPost.onCreated(function(){
  this.newDict = new ReactiveDict();
  this.newDict.set("data_ready", false);

  //client-side validation
  var access_key;
  if(!this.data.authDict){
    Router.go("/posts?page=1");
    return;
  } else {
    this.authDict = this.data.authDict;
    access_key = this.authDict.get("access_key");
  }

  //get initialization data
  const newDict = this.newDict;
  Meteor.call("get_s3_signature", access_key, function(err, result){
    if(err){
      Router.go("/posts?page=1");
      window.alert(err);
      return;
    }

    //initialize page elements
    setTimeout(function () {
      const s3hash = result;

      $('#froala-editor').froalaEditor({
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
        tabSpaces: 4,
      })

      $('#post_type')
        .dropdown()
      ;

      newDict.set("data_ready", true);//shows content after the initialization is finished
    }, 300);
  })
})

Template.newPost.helpers({
  "dataNotReady": function(){
    return !Template.instance().newDict.get("data_ready");
  },

  "newDict": function(){
    return Template.instance().newDict;
  },
})

Template.newPost.events({
  "click #post_submit": function(){
    //set loading status of buttons
    $("#post_submit").attr("class", "ui right floated blue loading disabled button");

    const access_key = Template.instance().authDict.get("access_key");
    const submit_object = {
      HTML_content: $('#froala-editor').froalaEditor('html.get', true),
      title: $("#post_title").val(),
      description: $("#post_description textarea").val(),
      type: $("#post_type").dropdown("get value")
    };

    Meteor.call("submit_post", submit_object, access_key, function(err, result){
      if(err){
        window.alert(err);
        $("#post_submit").attr("class", "ui right floated blue button");
        return;
      }

      Router.go("/posts/view/" + encodeURIComponent(result.replace(/ +/g, "_")));
    });
  }
})
