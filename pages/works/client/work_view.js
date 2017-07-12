Template.workView.onCreated(function(){
  this.workViewDict = new ReactiveDict();
  this.workViewDict.set("data_ready", false);
})

Template.workView.onRendered(function(){
  if(Router.current().params.hash){
    window.location.hash = "";
    window.location.hash = Router.current().params.hash;
  }

  const workViewDict = Template.instance().workViewDict;
  Meteor.call("get_work_by_title", Router.current().params.work_title, function(err, result){
    if(err){
      window.alert(err);
      Router.go("/works?page=1");
      return;
    }

    workViewDict.set("data_object", result);
    workViewDict.set("data_ready", true);

    setTimeout(function () {
      $("div#card_view").css("opacity", 1);
    }, 200);
  })

  //update view count
  const work_id = Router.current().params._id;

  //check if the post has been visited
  const work_regexp = new RegExp("(?:(?:^|.*;\\s*)work_visited\\s*\\=\\s*([^;]*).*$)|^.*$");
  if(!document.cookie.replace(work_regexp, "$1")){
    const visited_works_array = [work_id];
    //set the post to be visited
    document.cookie = "work_visited=" + JSON.stringify(visited_works_array) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";

    //+1 in viewcount
    Meteor.call("viewCount+1_work", work_id);
  } else {
    const visited_works_array = JSON.parse(document.cookie.replace(work_regexp, "$1"));
    if (_.indexOf(visited_works_array, work_id) == -1) {//post not visited, add to the array
      visited_works_array.push(work_id);
      document.cookie = "work_visited=" + JSON.stringify(visited_works_array) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";

      //+1 in viewcount
      Meteor.call("viewCount+1_work", work_id);
    }
  }
})

Template.workView.helpers({
  "work": function(){
    return Template.instance().workViewDict.get("data_object");
  },

  "getTime": function(date){
    if(!date){
      return "";
    }

    return $.timeago(date);
  },

  "workViewDict": function(){
    return Template.instance().workViewDict;
  },

  "dataReady": function(){
    return Template.instance().workViewDict.get("data_ready");
  },

  "getViewCount": function(view_count){
    if(!view_count){
      return 0;
    } else {
      return view_count;
    }
  },
})
