Template.newWork.onCreated(function(){
  this.newDict = new ReactiveDict();
  this.newDict.set("data_ready", false);

  //client-side validation
  const access_key = Router.current().params.hash;
  if(!access_key){
    Router.go("/works?page=1");
    return;
  }

  //get initialization data
  const newDict = this.newDict;
  Meteor.call("get_s3_signature", access_key, function(err, result){
    if(err){
      Router.go("/works?page=1");
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

    const access_key = Router.current().params.hash;
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
        Meteor.call("submit_work", submit_object, access_key, image_base64, file_type, function(err, result){
          if(err){
            window.alert(err.message);
            $("#work_submit").attr("class", "ui right floated blue button");
            return;
          }

          Router.go("/works/view/" + result);
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
