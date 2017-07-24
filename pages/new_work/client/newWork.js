Template.newWork.onCreated(function(){
  this.newDict = new ReactiveDict();
  this.newDict.set("data_ready", false);

  //client-side validation
  var access_key;
  if(!this.data.authDict){
    Router.go("/works?page=1");
    return;
  } else {
    this.authDict = this.data.authDict;
    access_key = this.authDict.get("access_key");
  }

  //get initialization data
  const newDict = this.newDict;
  Meteor.call("validate_access", access_key, function(err, result){
    if(err){
      Router.go("/works?page=1");
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

      $('#work_type')
        .dropdown()
      ;

      newDict.set("data_ready", true);//shows content after the initialization is finished
    }, 300);
  })
})

Template.newWork.helpers({
  "dataNotReady": function(){
    return !Template.instance().newDict.get("data_ready");
  },

  "newDict": function(){
    return Template.instance().newDict;
  },
})

Template.newWork.events({
  "click #work_submit": function(event){
    //set loading status of the button
    $("#work_submit").attr("class", "ui right floated blue loading disabled button");

    const access_key = Template.instance().authDict.get("access_key");
    const submit_object = {
      HTML_content: $('#froala-editor').froalaEditor('html.get', true),
      title: $("#work_title").val(),
      description: $("#work_description textarea").val(),
      date: $("#work_date").val(),
      type: $("#work_type").dropdown("get value")
    };

    //client-side validation
    if($("#work_pic").val()){
      const file_type = $("#work_pic")[0].files[0].type;
      if(file_type.substring(0, 5) !== "image"){
        window.alert("Please upload an image as the thumbnail.");
        return;
      }

      //get the image file and convert it to base64 form
      var image_file = $("#work_pic")[0].files[0];
      var imgToBase64 = function(image_file, callback) {
        var reader = new FileReader();
        reader.onload = function() {
          var dataUrl = reader.result;
          var img_base64 = dataUrl.split(',')[1];
          callback(img_base64);
        };
        reader.readAsDataURL(image_file);
      };

      //send the data to the sever
      imgToBase64(image_file, function(image_base64){
        Meteor.call("submit_work", submit_object, access_key, image_base64, file_type.substring(6), function(err, result){
          if(err){
            window.alert(err.message);
            $("#work_submit").attr("class", "ui right floated blue button");
            return;
          }

          Router.go("/works/view/" + encodeURIComponent(result.replace(/ +/g, "_")));
        });
      })
    } else {
      window.alert("Please choose a thumbnail.");
      $("#work_submit").attr("class", "ui right floated blue button");
    }
  },

  "change #work_pic": function(event){
    if($("#work_pic").val()){
      const file_type = event.currentTarget.files[0].type;

      //check if there is image to load
      if(file_type.substring(0, 5) !== "image"){
        window.alert("Please upload an image");
        $("#work_pic").val("");
        $("#work_thumbnail").attr("src", "");
        return;
      } else {
        var reader = new FileReader();
        reader.onload = function (event) {
            // get loaded data and render thumbnail.
            $("#work_thumbnail").attr("src", event.currentTarget.result);
            $("#work_thumbnail").css("display", "block");
        };

        // read the image file as a data URL.
        reader.readAsDataURL(event.currentTarget.files[0]);
      }
    } else {
      $("#work_thumbnail").attr("src", "");
      $("#work_thumbnail").css("display", "none");
    }
  },
})
