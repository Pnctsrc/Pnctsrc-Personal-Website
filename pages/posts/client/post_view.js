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
  Meteor.call("get_post_by_title", Router.current().params.post_title, function(err, result){
    if(err){
      window.alert(err);
      Router.go("/posts?page=1");
      return;
    }

    postViewDict.set("data_object", result);
    postViewDict.set("data_ready", true);

    setTimeout(function () {
      $("div#card_view").css("opacity", 1);

      //initialize the code blocks
      const hljs = require("highlight.js");
      hljs.configure({
        tabReplace: '  '
      })
      $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
      });
    }, 200);

    //update view count
    const post_id = postViewDict.get("data_object")._id;

    //check if the post has been visited
    const post_regexp = new RegExp("(?:(?:^|.*;\\s*)post_visited\\s*\\=\\s*([^;]*).*$)|^.*$");
    if(!document.cookie.replace(post_regexp, "$1")){
      const visited_posts_array = [post_id];
      //set the post to be visited
      document.cookie = "post_visited=" + JSON.stringify(visited_posts_array) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";

      //+1 in viewcount
      Meteor.call("viewCount+1", post_id);
    } else {
      const visited_posts_array = JSON.parse(document.cookie.replace(post_regexp, "$1"));
      if (_.indexOf(visited_posts_array, post_id) == -1) {//post not visited, add to the array
        visited_posts_array.push(post_id);
        document.cookie = "post_visited=" + JSON.stringify(visited_posts_array) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";

        //+1 in viewcount
        Meteor.call("viewCount+1", post_id);
      }
    }
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

    function convertDate(inputFormat) {
      function pad(s) { return (s < 10) ? '0' + s : s; }
      var d = new Date(inputFormat);
      return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-');
    }

    return convertDate(date);
  },

  "postViewDict": function(){
    return Template.instance().postViewDict;
  },

  "dataReady": function(){
    return Template.instance().postViewDict.get("data_ready");
  },

  "getViewCount": function(view_count){
    if(!view_count){
      return 0;
    } else {
      return view_count;
    }
  },
})
