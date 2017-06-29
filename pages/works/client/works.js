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

    //start refetching
    (function(query){
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

          worksDict.set("works_array", result);
          worksDict.set("data_ready", true);
        }
      })
    })(Router.current().params.query);
  },

  "work_list": function(){
    return Template.instance().worksDict.get("works_array");
  },
})
