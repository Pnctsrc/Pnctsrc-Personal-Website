Template.editWork.onCreated(function(){
  this.editDict = new ReactiveDict();
  this.editDict.set("data_ready", false);

  //client-side validation
  const work_id = Router.current().params._id.match(/^[0-9A-Za-z]{17}(?=(#[0-9a-zA-Z_-]+)?$)/i)[0];
  if(!work_id){
    Router.go("/works?page=1");
    return;
  }

  const access_key = Router.current().params.hash;
  if(!access_key){
    Router.go("/works?page=1");
    return;
  }

  //get initialization data
  const editDict = this.editDict;
  const template = this;
  (function(work_id){
    Meteor.call("get_s3_signature", access_key, function(err, result){
      if(err){
        Router.go("/works?page=1");
        window.alert(err);
        return;
      }

      //get the post
      const current_work_id = Router.current().params._id.match(/^[0-9A-Za-z]{17}(?=(#[0-9a-zA-Z_-]+)?$)/i)[0];
      if(current_work_id === work_id){
        Meteor.call("get_work_by_id", work_id, function(err, data){
          if(err){
            Router.go("/works?page=1");
            window.alert(err);
            return;
          }
          template.data = result;//if the data gets fetched before the page is rendered
          editDict.set("work_object", data);

          //initialize page elements
          setTimeout(function () {
            const s3hash = result;

            $('.fr-view-edit').froalaEditor({
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

            $('#work_type_edit')
              .dropdown('set selected', data.type);
            ;

            editDict.set("data_ready", true);//shows content after the initialization is finished
          }, 300);
        })
      }
    })
  })(work_id);
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
    $("#work_restore_thumbnail").attr("class", "ui left floated blue loading button");
    $("#work_submit_edit").attr("class", "ui right floated blue loading button");
    $("#work_submit_delete").attr("class", "ui right floated red loading button");

    const access_key = Router.current().params.hash;
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
        Meteor.call("submit_work_edit", submit_object, work_id, access_key, image_base64, file_type, function(err, result){
          if(err){
            window.alert(err.message);
            $("#work_restore_thumbnail").attr("class", "ui left floated blue button");
            $("#work_submit_edit").attr("class", "ui right floated blue button");
            $("#work_submit_delete").attr("class", "ui right floated red button");
            return;
          }

          Router.go("/works/view/" + result);
        });
      })
    } else {
      //check if the original thumbnail
      if($("#work_thumbnail_edit").css("display") === "none"){
        submit_object.thumbnail = "";
      } else {
        submit_object.thumbnail = work_object.thumbnail;
      }

      Meteor.call("submit_work_edit", submit_object, work_id, access_key, function(err, result){
        if(err){
          window.alert(err.message);
          $("#work_restore_thumbnail").attr("class", "ui left floated blue button");
          $("#work_submit_edit").attr("class", "ui right floated blue button");
          $("#work_submit_delete").attr("class", "ui right floated red button");
          return;
        }

        Router.go("/works/view/" + result);
      });
    }
  },

  "click #work_submit_delete": function(){
    //set loading status of buttons
    $("#work_restore_thumbnail").attr("class", "ui left floated blue loading button");
    $("#work_submit_edit").attr("class", "ui right floated blue loading button");
    $("#work_submit_delete").attr("class", "ui right floated red loading button");

    const access_key = Router.current().params.hash;
    const work_object = Template.instance().editDict.get("work_object");
    const work_id = work_object._id;

    Meteor.call("delete_work", work_id, access_key, function(err, result){
      if(err){
        window.alert(err);
        $("#work_restore_thumbnail").attr("class", "ui left floated blue button");
        $("#work_submit_edit").attr("class", "ui right floated blue button");
        $("#work_submit_delete").attr("class", "ui right floated red button");
        return;
      }

      Router.go("/works?page=1");
    });
  },

  "click #work_restore_thumbnail": function(){
    const access_key = Router.current().params.hash;
    const work_object = Template.instance().editDict.get("work_object");

    $("#work_pic_edit").val("");
    $("#work_thumbnail_edit").attr("src", work_object.thumbnail);
  },

  "change #work_pic_edit": function(event){
    if($("#work_pic_edit").val()){
      const file_type = event.currentTarget.files[0].type;

      //check if there is image to load
      if(file_type.substring(0, 5) !== "image"){
        window.alert("Please upload an image");
        $("#work_pic_edit").val("");
        $("#work_thumbnail_edit").attr("src", "");
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
      $("#work_thumbnail_edit").attr("src", "");
      $("#work_thumbnail_edit").css("display", "none");
    }
  },
})
