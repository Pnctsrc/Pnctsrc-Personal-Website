Meteor.methods({
  "get_posts": function(query){
    //validation
    const requested_page = query.page;
    const total_pages = Math.ceil(MetaData.findOne().total_count / MetaData.findOne().posts_per_page);
    if (!/^-?\d+$/i.test(requested_page)) {

      return [];
		} else if (parseInt(requested_page) > total_pages){

      return [];
		} else if (parseInt(requested_page) <= 0){

      return [];
		}

    const requested_cate = query.category;
    if(requested_cate !== "music" &&
       requested_cate !== "tech" &&
       requested_cate !== "other" &&
       requested_cate !== "" &&
       requested_cate){

      return [];
    }

    const requested_sort = query.sorting;
    if(requested_sort !== "date_as" &&
       requested_sort !== "date_ds" &&
       requested_sort !== "view_as" &&
       requested_sort !== "view_ds" &&
       requested_sort !== "" &&
       requested_sort){

      return [];
    }

    //make the query
    const posts_per_page = MetaData.findOne({type: "posts"}).posts_per_page;

    const query_object = {};
    const options_object = {
      limit: posts_per_page,
      skip: (parseInt(requested_page) - 1) * posts_per_page,
    };

    if(requested_cate !== "" && requested_cate){
      query_object.category = requested_cate;
    }

    if(requested_sort !== "" && requested_sort){
      if(requested_sort === "date_as"){
        options_object.sort.createdAt  = {
          createdAt: 1
        };
      } else if(requested_sort === "date_ds"){
        options_object.sort.createdAt  = {
          createdAt: -1
        };
      } else if(requested_sort === "view_as"){
        options_object.sort = {
          viewCount: 1
        };
      } else {
        options_object.sort = {
          viewCount: -1
        };
      }
    } else {
      options_object.sort = {
        createdAt: -1
      };
    }

    return Posts.find(query_object, options_object).fetch();
  },

  "get_post_by_id": function(post_id){
    //validation
    if(!/^[0-9A-Za-z]{17}$/ig.test(post_id)){
      throw new Meteor.Error(404, "Invalid id");
    } else if(!Posts.findOne(post_id)){
      throw new Meteor.Error(404, "No such post");
    }

    return Posts.findOne(post_id);
  },
})
