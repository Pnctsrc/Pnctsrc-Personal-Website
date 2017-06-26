Template.postView.onCreated(function(){
  this.postViewDict = new ReactiveDict();
  this.postViewDict.set("data_ready", false);
})

Template.postView.onRendered(function(){
  if(Router.current().params.hash){
    window.location.hash = "";
    window.location.hash = Router.current().params.hash;
  }

  const postViewDict = Template.instance().postViewDict;
  Meteor.call("get_post_by_id", Router.current().params._id, function(err, result){
    if(err){
      window.alert(err);
      Router.go("/posts?page=1");
      return;
    }
    
    postViewDict.set("data_object", result);
    postViewDict.set("data_ready", true);

    setTimeout(function () {
      $("div#card_view").css("opacity", 1);
    }, 200);
  })
})

Template.postView.helpers({
  "post": function(){
    return Template.instance().postViewDict.get("data_object");
  },

  "getTime": function(date){
    if(!date){
      return "";
    }

    return $.timeago(date);
  },

  "postViewDict": function(){
    return Template.instance().postViewDict;
  },

  "dataReady": function(){
    return Template.instance().postViewDict.get("data_ready");
  }
})
