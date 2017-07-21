Template.editPost.onCreated(function(){
  this.editDict = new ReactiveDict();
  this.editDict.set("data_ready", false);

  //client-side validation
  const post_title = Router.current().params.post_title;
  if(!post_title){
    Router.go("/posts?page=1");
    return;
  }

  var access_key;
  if(!this.data.authDict){
    Router.go("/posts?page=1");
    return;
  } else {
    this.authDict = this.data.authDict;
    access_key = this.authDict.get("access_key");
  }

  //get initialization data
  const editDict = this.editDict;
  const template = this;
  (function(post_title){
    Meteor.call("validate_access", access_key, function(err, result){
      if(err){
        Router.go("/posts?page=1");
        window.alert(err);
        return;
      }

      //get the post
      const current_post_title = Router.current().params.post_title;
      if(current_post_title === post_title){
        Meteor.call("get_post_by_title", post_title, function(err, data){
          if(err){
            Router.go("/posts?page=1");
            window.alert(err);
            return;
          }

          editDict.set("post_object", data);

          //initialize page elements
          setTimeout(function () {
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

            $('#post_type')
              .dropdown("set selected", data.type);
            ;

            editDict.set("data_ready", true);//shows content after the initialization is finished
          }, 300);
        })
      }
    })
  })(post_title);
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
    $("#post_submit_edit").attr("class", "ui right floated blue loading disabled button");
    $("#post_submit_delete").attr("class", "ui right floated red loading disabled button");

    const access_key = Template.instance().authDict.get("access_key");
    const post_object = Template.instance().editDict.get("post_object");
    const post_id = post_object._id;
    const submit_object = {
      HTML_content: $('.fr-view-edit').froalaEditor('html.get', true),
      title: $("#post_title_edit").val(),
      description: $("#post_description_edit textarea").val(),
      type: $("#post_type").dropdown("get value")
    };

    Meteor.call("submit_post_edit", submit_object, post_id, access_key, function(err, result){
      if(err){
        window.alert(err);
        $("#post_submit_edit").attr("class", "ui right floated blue button");
        $("#post_submit_delete").attr("class", "ui right floated red button");
        return;
      }

      Router.go("/posts/view/" + encodeURIComponent(result.replace(/ +/g, "_")));
    });
  },

  "click #post_submit_delete": function(){
    //set loading status of buttons
    $("#post_submit_edit").attr("class", "ui right floated blue loading disabled button");
    $("#post_submit_delete").attr("class", "ui right floated red loading disabled button");

    const access_key = Template.instance().authDict.get("access_key");
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
