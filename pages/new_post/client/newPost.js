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
  Meteor.call("validate_access", access_key, function(err, result){
    if(err){
      Router.go("/posts?page=1");
      window.alert(err);
      return;
    }

    //initialize page elements
    setTimeout(function () {
      const s3hash = result;

      $('#froala-editor').froalaEditor({
        imageUploadURL: '/api/v1/pic?api_key=' + encodeURIComponent(access_key),
        fileUploadURL: '/api/v1/file?api_key=' + encodeURIComponent(access_key),
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

      $('#froala-editor').on('froalaEditor.image.error', function (e, editor, error, response) {
        if(error && error.code != 3){
          window.alert(error.message);
        } else {
          if(response){
            const result = JSON.parse(response);
            window.alert(result.message + " [" + result.error +"]");
          }
        }
      });

      $('#froala-editor').on('froalaEditor.image.beforeRemove', function (e, editor, $img) {
        $.ajax({
          type: "DELETE",
          url: "/api/v1/pic",
          data: {
            src: $img[0].currentSrc,
            api_key: access_key
          },
          dataType: "application/json"
        });
      });

      $('#froala-editor').on('froalaEditor.file.error', function (e, editor, error, response) {
        if(error && error.code != 3){
          window.alert(error.message);
        } else {
          if(response){
            const result = JSON.parse(response);
            window.alert(result.message + " [" + result.error +"]");
          }
        }
      });

      $('#froala-editor').on('froalaEditor.file.inserted', function (e, editor, $file, response) {
        $file.attr("target", "_blank");
      });

      $('#froala-editor').on('froalaEditor.file.unlink', function (e, editor, link) {
        $.ajax({
          type: "DELETE",
          url: "/api/v1/file",
          data: {
            filename: link.href.substring(link.href.lastIndexOf("/") + 1),
            api_key: access_key
          },
          dataType: "application/json"
        });
      });

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
