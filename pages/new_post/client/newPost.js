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

    newDict.set("data_object", true);
    newDict.set("access_key", access_key);
    $('#post_type')
      .dropdown()
    ;
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
      HTML_content: $('#summernote').summernote('code'),
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
