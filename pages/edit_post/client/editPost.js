Template.editPost.onCreated(function(){
  this.editDict = new ReactiveDict();
  this.editDict.set("data_ready", false);

  //client-side validation
  const post_id = Router.current().params._id.match(/^[0-9A-Za-z]{17}(?=(#[0-9a-zA-Z_-]+)?$)/i)[0];
  if(!post_id){
    Router.go("/posts?page=1");
    return;
  }

  const access_key = Router.current().params.hash;
  if(!access_key){
    Router.go("/posts?page=1");
    return;
  }

  //get initialization data
  const editDict = this.editDict;
  const template = this;
  (function(post_id){
    Meteor.call("get_s3_signature", access_key, function(err, result){
      if(err){
        Router.go("/posts?page=1");
        window.alert(err);
        return;
      }

      //get the post
      const current_post_id = Router.current().params._id.match(/^[0-9A-Za-z]{17}(?=(#[0-9a-zA-Z_-]+)?$)/i)[0];
      if(current_post_id === post_id){
        Meteor.call("get_post_by_id", post_id, function(err, data){
          if(err){
            Router.go("/posts?page=1");
            window.alert(err);
            return;
          }
          template.data = result;//if the data gets fetched before the page is rendered
          editDict.set("post_object", data);

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

            $('#post_tag_edit')
              .dropdown({
                allowAdditions: true
              })
            ;

            if(data.tags.length != 0){
              $("#post_tag_edit").dropdown("set selected", data.tags);
            }

            editDict.set("data_ready", true);//shows content after the initialization is finished
          }, 300);
        })
      }
    })
  })(post_id);
})

Template.editPost.helpers({
  "post": function(){
    return Template.instance().editDict.get("post_object");
  },

  "editDict": function(){
    return Template.instance().editDict;
  },

  "dataNotReady": function(){
    return !Template.instance().editDict.get("data_ready");
  },
})

Template.editPost.events({
  "click #post_submit_edit": function(){
    //set loading status of buttons
    $("#post_submit_edit").attr("class", "ui right floated blue loading button");
    $("#post_submit_delete").attr("class", "ui right floated red loading button");

    const access_key = Router.current().params.hash;
    const post_object = Template.instance().editDict.get("post_object");
    const post_id = post_object._id;
    const submit_object = {
      HTML_content: $('.fr-view-edit').froalaEditor('html.get', true),
      title: $("#post_title_edit").val(),
      description: $("#post_description_edit textarea").val(),
      tags: $("#post_tag_edit").dropdown("get value").split(",")
    };

    Meteor.call("submit_post_edit", submit_object, post_id, access_key, function(err, result){
      if(err){
        window.alert(err);
        $("#post_submit_edit").attr("class", "ui right floated blue button");
        $("#post_submit_delete").attr("class", "ui right floated red button");
        return;
      }

      Router.go("/posts/view/" + post_id);
    });
  },

  "click #post_submit_delete": function(){
    //set loading status of buttons
    $("#post_submit_edit").attr("class", "ui right floated blue loading button");
    $("#post_submit_delete").attr("class", "ui right floated red loading button");

    const access_key = Router.current().params.hash;
    const post_object = Template.instance().editDict.get("post_object");
    const post_id = post_object._id;

    Meteor.call("delete_post", post_id, access_key, function(err, result){
      if(err){
        window.alert(err);
        $("#post_submit_edit").attr("class", "ui right floated blue button");
        $("#post_submit_delete").attr("class", "ui right floated red button");
        return;
      }

      Router.go("/posts?page=1");
    });
  },
})
