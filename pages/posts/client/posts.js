Template.posts.onCreated(function(){
  this.postsDict = new ReactiveDict();
  this.postsDict.set("data_ready", false);
});

Template.posts.helpers({
  "post_list": function(){
    return Template.instance().postsDict.get("posts_array");
  },

  "getTime": function(date){
    function convertDate(inputFormat) {
      function pad(s) { return (s < 10) ? '0' + s : s; }
      var d = new Date(inputFormat);
      return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-');
    }

    return convertDate(date);
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

    //set values based on URL query
    const current_query = Router.current().params.query;
    const category = current_query.category;
    const sorting = current_query.sorting;

    if(category){
      $("#filter_type").dropdown("set selected", category);
    } else {
      $("#filter_type").dropdown("clear");
    }

    if(sorting){
      $("#filter_sorting").dropdown("set selected", sorting);
    } else {
      $("#filter_sorting").dropdown("clear");
    }

    //start refetching
    (function(query){
      //get the metadata
      Meteor.call("get_posts_metadata", query, function(err, result){
        if(err){
          window.alert(err);
          return;
        }

        //set result that matches the current URL query
        const current_query = Router.current().params.query;
        if(query.page === current_query.page &&
           query.category === current_query.category &&
           query.sorting === current_query.sorting){

          if(postsDict.get("posts_array")){//if posts data is ready first
           postsDict.set("metadata_posts", result);
           postsDict.set("data_ready", true);
          } else {
           postsDict.set("metadata_posts", result);
          }
        }
      })

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

          if(postsDict.get("metadata_posts")){
            postsDict.set("data_ready", true);
          }
        }
      })
    })(Router.current().params.query);
  },

  "postsDict": function(){
    return Template.instance().postsDict;
  },

  "showPagination": function(){
    const postsDict = Template.instance().postsDict;
    if(!postsDict.get("metadata_posts")) return false;
    const total_pages = Math.ceil(postsDict.get("metadata_posts").total_count / postsDict.get("metadata_posts").posts_per_page);

    if(total_pages == "1"){
      return false;
    } else if (!postsDict.get("posts_array")){//if passed, it is the first time the page is loaded
      return false;
    } else if (postsDict.get("posts_array").length == 0){//when no data gets fetched
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

  "getTitleURL": function(post_title){
    return encodeURIComponent(post_title.replace(/ +/g, "_"));
  },
})

Template.posts.events({
  "click .post_title_link": function(){
    var page_url = Router.current().originalUrl;
    Session.set("last_visited_post_url", page_url);
  }
})
