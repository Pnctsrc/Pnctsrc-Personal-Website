Template.authentication.onCreated(function(){
  this.authDict = new ReactiveDict();
})

Template.authentication.helpers({
  "noAuth": function(){
    return !Template.instance().authDict.get("page");
  },

  "isEditWork": function(){
    return Template.instance().authDict.get("page") === "editWork";
  },

  "isEditPost": function(){
    return Template.instance().authDict.get("page") === "editPost";
  },

  "isNewWork": function(){
    return Template.instance().authDict.get("page") === "newWork";
  },

  "isNewPost": function(){
    return Template.instance().authDict.get("page") === "newPost";
  },

  "isEditAbout": function(){
    return Template.instance().authDict.get("page") === "editAbout";
  },

  "authDict": function(){
    return Template.instance().authDict;
  },
})

Template.authentication.events({
  "click #key_input_button": function(event){
    event.preventDefault();
    $("#key_input_button").attr("class", "ui blue loading disabled button");
    const access_key = $("#key_input input").val();
    const authDict = Template.instance().authDict;

    Meteor.call("authenticate", access_key, function(err){
      if(err){
        window.alert(err);
        $("#key_input_button").attr("class", "ui blue button");
        $("#key_input input").val("");
        return;
      }

      authDict.set("access_key", access_key);

      if(Router.current().url.match(/(work)/gi)){//newWork or editWork
        if(Router.current().url.match(/(edit|work)/gi).length == 1){//newWork
          authDict.set("page", "newWork");
        } else {
          authDict.set("page", "editWork");
        }
      } else if (Router.current().url.match(/(post)/gi)){//newPost or editPost
        if(Router.current().url.match(/(edit|post)/gi).length == 1){//newPost
          authDict.set("page", "newPost");
        } else {
          authDict.set("page", "editPost");
        }
      } else if (Router.current().url.match(/(edit|about)/gi)){//editAbout
        authDict.set("page", "editAbout");
      }
    })
  }
})
