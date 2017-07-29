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

  $('.ui.category.search')
  .search({
    type          : 'category',
    minCharacters : 3,
    apiSettings   : {
      onResponse: function(result) {
        if(result.post_result.length == 0 && result.work_result.length == 0){
          return;
        }

        var response = {
          results : {
            Posts: {
              name: "Posts",
              results: []
            },
            Works: {
              name: "Works",
              results: []
            }
          }
        };

        //push the results
        maxResults = 5;
        $.each(result.post_result, function(index, post){
          if(index > maxResults){
            return;
          }

          response.results.Posts.results.push({
            title: post.title,
            description: post.description,
            url: "/posts/view/" + encodeURIComponent(post.title.replace(/ +/g, "_"))
          })
        })

        $.each(result.work_result, function(index, work){
          if(index > maxResults){
            return;
          }

          response.results.Works.results.push({
            title: work.title,
            description: work.description,
            url: "/works/view/" + encodeURIComponent(work.title.replace(/ +/g, "_"))
          })
        })

        return response;
      },
      url: '/api/v1/search?keyword={query}',
      showNoResults: true
    },
    onSelect: function(result, response){
      Router.go(result.url);
      return false;
    },
  })
;
})

Template.filter.events({
  "change .ui.dropdown.filter": function(){
    const current_sorting = $("#filter_sorting").dropdown("get value");
    const current_category = $("#filter_type").dropdown("get value");

    //get current query parameters
    var new_query_string = "";
    const current_query = Router.current().params.query;
    if(current_category === "all" || !current_category){
      delete current_query.category;
    } else {
      current_query.category = current_category;
    }
    if(current_sorting){
      current_query.sorting = current_sorting;
    }

    for(field in current_query){
      new_query_string += "&" + field + "=" + current_query[field];
    }

    Router.go("/" + Router.current().route._path.substring(1, ) + "?" + new_query_string.substring(1, ));
  },
})
