Template.posts.onCreated(function(){
  this.postsDict = new ReactiveDict();
  this.postsDict.set("data_ready", false);
});

Template.posts.helpers({
  "post_list": function(){
    return Template.instance().postsDict.get("posts_array");
  },

  "getTime": function(date){
      return $.timeago(date) || "";
  },

  "dataNotReady": function(){
    return !Template.instance().postsDict.get("data_ready");
  },

  "queryChange": function(){
    const last_query = Template.instance().postsDict.get("last_query");
    const current_query = Router.current().params.query;

    if(!last_query){//if passed, it is the first time the page is loaded
      return true;
    } else if(!current_query){//user is leaving the page
      return false;
    } else {
      return last_query.page !== current_query.page ||
             last_query.category !== current_query.category ||
             last_query.sorting !== current_query.sorting;
    }
  },

  "postsReFetch": function(){
    const postsDict = Template.instance().postsDict;
    postsDict.set("last_query", Router.current().params.query);//update the stored query

    //start refetching
    (function(query){
      Meteor.call("get_posts", query, function(err, result){
        if(err){
          window.alert(err);
          return;
        }

        //set result that matches the current URL query
        const current_query = Router.current().params.query;
        if(query.page === current_query.page &&
           query.category === current_query.category &&
           query.sorting === current_query.sorting){

          //check if there's data
          if(result.length == 0){
            Router.go("/posts?page=1");
          };

          postsDict.set("posts_array", result);
          postsDict.set("data_ready", true);
        }
      })
    })(Router.current().params.query);
  },

  "postsDict": function(){
    return Template.instance().postsDict;
  },

  "showPagination": function(){
    if(!MetaData.findOne()) return false;
    const total_pages = Math.ceil(MetaData.findOne().total_count / MetaData.findOne().posts_per_page);

    if(total_pages == "1"){
      return false;
    } else if (!Template.instance().postsDict.get("posts_array")){//if passed, it is the first time the page is loaded
      return false;
    } else if (Template.instance().postsDict.get("posts_array").length == 0){//when no data gets fetched
      return false;
    } else {
      return true;
    }
  },

  "getViewCount": function(view_count){
    if(!view_count){
      return 0;
    } else {
      return view_count;
    }
  },
})
