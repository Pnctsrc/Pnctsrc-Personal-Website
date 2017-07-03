Template.filter.onRendered(function(){
  $(".ui.dropdown").dropdown();

  //set values based on URL query
  const current_query = Router.current().params.query;
  const category = current_query.category;
  const sorting = current_query.sorting;

  if(category){
    $("#filter_type").dropdown("set selected", category);
  };

  if(sorting){
    $("#filter_sorting").dropdown("set selected", sorting);
  };
})

Template.filter.events({
  "change .ui.dropdown.filter": function(){
    const current_sorting = $("#filter_sorting").dropdown("get value");
    const current_category = $("#filter_type").dropdown("get value");

    //get current query parameters
    var new_query_string = "";
    const current_query = Router.current().params.query;
    if(current_category === "all"){
      delete current_query.category;
    } else {
      current_query.category = current_category;
    }
    if(current_sorting){
      current_query.sorting = current_sorting;
    }

    for(field in current_query){
      if(field && current_query[field]){
        new_query_string += "&" + field + "=" + current_query[field];
      }
    }

    Router.go("/" + Router.current().route._path.substring(1, ) + "?" + new_query_string.substring(1, ));
  },
})
