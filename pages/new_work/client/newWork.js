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
  "click #work_submit": function(){
    const access_key = Router.current().params.hash;
    const submit_object = {
      HTML_content: $('#froala-editor').froalaEditor('html.get', true),
      title: $("#work_title").val(),
      description: $("#work_description textarea").val(),
      date: $("#work_date").val(),
      type: $("#work_type").dropdown("get value")
    };

    Meteor.call("submit_work", submit_object, access_key,function(err, result){
      if(err){
        window.alert(err);
        Router.go("/works?page=1");
        return;
      }

      Router.go("/works/view/" + result);
    });
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
