Template.editWork.onCreated(function(){
  this.editDict = new ReactiveDict();
  this.editDict.set("data_ready", false);

  //client-side validation
  const work_title = Router.current().params.work_title;
  if(!work_title){
    Router.go("/works?page=1");
    return;
  }

  var access_key;
  if(!this.data.authDict){
    Router.go("/works?page=1");
    return;
  } else {
    this.authDict = this.data.authDict;
    access_key = this.authDict.get("access_key");
  }

  //get initialization data
  const editDict = this.editDict;
  const template = this;
  (function(work_title){
    Meteor.call("validate_access", access_key, function(err, result){
      if(err){
        Router.go("/works?page=1");
        window.alert(err);
        return;
      }

      //get the post
      const current_work_title = Router.current().params.work_title;
      if(current_work_title === work_title){
        Meteor.call("get_work_by_title", work_title, function(err, data){
          if(err){
            Router.go("/works?page=1");
            window.alert(err);
            return;
          }

          editDict.set("work_object", data);

          //initialize page elements
          setTimeout(function () {
            const s3hash = result;

            $('.fr-view-edit').froalaEditor({
              imageUploadURL: '/api/v1/pic?api_key=' + encodeURIComponent(access_key),
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

            $('.fr-view-edit').on('froalaEditor.image.error', function (e, editor, error, response) {
              if(error && error.code != 3){
                window.alert(error.message);
              } else {
                if(response){
                  const result = JSON.parse(response);
                  window.alert(result.message + " [" + result.error +"]");
                }
              }
            });

            $('.fr-view-edit').on('froalaEditor.image.beforeRemove', function (e, editor, $img) {
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

            $('#work_type_edit')
              .dropdown('set selected', data.type);
            ;

            editDict.set("data_ready", true);//shows content after the initialization is finished
          }, 300);
        })
      }
    })
  })(work_title);
})

Template.editWork.helpers({
  "work": function(){
    return Template.instance().editDict.get("work_object");
  },

  "editDict": function(){
    return Template.instance().editDict;
  },

  "dataNotReady": function(){
    return !Template.instance().editDict.get("data_ready");
  },
})

Template.editWork.events({
  "click #work_submit_edit": function(){
    //set loading status of buttons
    $("#work_submit_edit").attr("class", "ui right floated blue loading disabled button");
    $("#work_submit_delete_edit").attr("class", "ui right floated red loading disabled button");

    const access_key = Template.instance().authDict.get("access_key");
    const work_object = Template.instance().editDict.get("work_object");
    const work_id = work_object._id;
    const submit_object = {
      HTML_content: $('.fr-view-edit').froalaEditor('html.get', true),
      title: $("#work_title_edit").val(),
      description: $("#work_description_edit textarea").val(),
      date: $("#work_date_edit").val(),
      type: $("#work_type_edit").dropdown("get value")
    };

    //client-side validation
    if($("#work_pic_edit").val()){
      const file_type = $("#work_pic_edit")[0].files[0].type;
      if(file_type.substring(0, 5) !== "image"){
        window.alert("Please upload an image as the thumbnail.");
        return;
      }

      //get the image file and convert it to base64 form
      var image_file = $("#work_pic_edit")[0].files[0];
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
        Meteor.call("submit_work_edit", submit_object, work_id, access_key, image_base64, file_type.substring(6), function(err, result){
          if(err){
            window.alert(err.message);
            $("#work_submit_edit").attr("class", "ui right floated blue button");
            $("#work_submit_delete_edit").attr("class", "ui right floated red button");
            return;
          }

          Router.go("/works/view/" + encodeURIComponent(result.replace(/ +/g, "_")));
        });
      })
    } else {
      //check if the original thumbnail
      if($("#work_thumbnail_edit").css("display") === "none"){
        window.alert("Please choose a thumbnail.");
        $("#work_submit_edit").attr("class", "ui right floated blue button");
        $("#work_submit_delete_edit").attr("class", "ui right floated red button");
      } else {
        submit_object.thumbnail = work_object.thumbnail;

        Meteor.call("submit_work_edit", submit_object, work_id, access_key, function(err, result){
          if(err){
            window.alert(err.message);
            $("#work_submit_edit").attr("class", "ui right floated blue button");
            $("#work_submit_delete_edit").attr("class", "ui right floated red button");
            return;
          }

          Router.go("/works/view/" + encodeURIComponent(result.replace(/ +/g, "_")));
        });
      }
    }
  },

  "click #work_submit_delete_edit": function(){
    //set loading status of buttons
    $("#work_submit_edit").attr("class", "ui right floated blue loading disabled button");
    $("#work_submit_delete_edit").attr("class", "ui right floated red loading disabled button");

    const access_key = Template.instance().authDict.get("access_key");
    const work_object = Template.instance().editDict.get("work_object");
    const work_id = work_object._id;

    Meteor.call("delete_work", work_id, access_key, function(err, result){
      if(err){
        window.alert(err);
        $("#work_submit_edit").attr("class", "ui right floated blue button");
        $("#work_submit_delete_edit").attr("class", "ui right floated red button");
        return;
      }

      Router.go("/works?page=1");
    });
  },

  "change #work_pic_edit": function(event){
    const work_object = Template.instance().editDict.get("work_object");

    if($("#work_pic_edit").val()){
      const file_type = event.currentTarget.files[0].type;

      //check if there is image to load
      if(file_type.substring(0, 5) !== "image"){
        window.alert("Please upload an image");
        $("#work_pic_edit").val("");
        $("#work_thumbnail_edit").attr("src", work_object.thumbnail);
        return;
      } else {
        $("#work_thumbnail_edit").css("display", "none");

        var reader = new FileReader();
        reader.onload = function (event) {
            // get loaded data and render thumbnail.
            $("#work_thumbnail_edit").attr("src", event.currentTarget.result);
            $("#work_thumbnail_edit").css("display", "block");
        };

        // read the image file as a data URL.
        reader.readAsDataURL(event.currentTarget.files[0]);
      }
    } else {
      $("#work_thumbnail_edit").attr("src", work_object.thumbnail);
    }
  },
})
