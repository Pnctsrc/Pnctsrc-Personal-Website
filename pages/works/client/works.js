Template.works.onCreated(function(){
  this.worksDict = new ReactiveDict();
  this.worksDict.set("data_ready", false);
})

Template.works.helpers({
  "worksDict": function(){
    return Template.instance().worksDict;
  },

  "dataNotReady": function(){
    return !Template.instance().worksDict.get("data_ready");
  },

  "queryChange": function(){
    const last_query = Template.instance().worksDict.get("last_query");
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

  "worksReFetch": function(){
    const worksDict = Template.instance().worksDict;
    worksDict.set("last_query", Router.current().params.query);//update the stored query

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
      Meteor.call("get_works_metadata", query, function(err, result){
        if(err){
          window.alert(err);
          return;
        }

        //set result that matches the current URL query
        const current_query = Router.current().params.query;
        if(query.page === current_query.page &&
           query.category === current_query.category &&
           query.sorting === current_query.sorting){

          if(worksDict.get("works_array")){//if posts data is ready first
           worksDict.set("metadata_works", result);
           worksDict.set("data_ready", true);
          } else {
           worksDict.set("metadata_works", result);
          }
        }
      })

      Meteor.call("get_works", query, function(err, result){
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
           Router.go("/works?page=1");
          };

          worksDict.set("works_array", result);
          if(worksDict.get("metadata_works")){
            worksDict.set("data_ready", true);
          }
        }
      })
    })(Router.current().params.query);
  },

  "work_list": function(){
    return Template.instance().worksDict.get("works_array");
  },

  "showPagination": function(){
    const worksDict = Template.instance().worksDict;
    if(!worksDict.get("metadata_works")) return false;
    const total_pages = Math.ceil(worksDict.get("metadata_works").total_count / worksDict.get("metadata_works").works_per_page);

    if(total_pages == "1"){
      return false;
    } else if (!worksDict.get("works_array")){//if passed, it is the first time the page is loaded
      return false;
    } else if (worksDict.get("works_array").length == 0){//when no data gets fetched
      return false;
    } else {
      return true;
    }
  },

  "getTitleURL": function(work_title){
    return encodeURIComponent(work_title.replace(/ +/g, "_"));
  },
})

Template.works.events({
  "click .work_title_link": function(){
    var page_url = Router.current().originalUrl;
    Session.set("last_visited_work_url", page_url);
  }
})
