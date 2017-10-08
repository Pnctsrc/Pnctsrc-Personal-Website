Meteor.methods({
  "get_posts": function(query){
    //validation
    if(!query || !query instanceof Object){
      throw new Meteor.Error(400, "Invalid query.");
    }
    const requested_page = query.page;
    const total_pages = Math.ceil(MetaData.findOne({type: "posts"}).total_count / MetaData.findOne({type: "posts"}).posts_per_page);
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
      sort: {}
    };

    if(requested_cate !== "" && requested_cate){
      query_object.type = requested_cate.charAt(0).toUpperCase() + requested_cate.slice(1);
    }

    if(requested_sort !== "" && requested_sort){
      if(requested_sort === "date_as"){
        options_object.sort = {
          createdAt: 1
        };
      } else if(requested_sort === "date_ds"){
        options_object.sort = {
          createdAt: -1
        };
      } else if(requested_sort === "view_as"){
        options_object.sort = {
          view_count: 1,
          createdAt: -1
        };
      } else {
        options_object.sort = {
          view_count: -1,
          createdAt: -1
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
    if(!post_id || typeof post_id !== "string"){
      throw new Meteor.Error(400, "Invalid post ID.");
    } else if(!/^[0-9A-Za-z]{17}$/ig.test(post_id)){
      throw new Meteor.Error(400, "Invalid ID.");
    } else if(!Posts.findOne(post_id)){
      throw new Meteor.Error(404, "No such post.");
    }

    return Posts.findOne(post_id);
  },

  "get_post_by_title": function(post_title){
    if(!post_title || typeof post_title !== "string"){
      throw new Meteor.Error(400, "Invalid post title.");
    }
    const title_replaced = post_title.replace(/_/g, " ");

    //validation
    if(title_replaced.length < 1){
      throw new Meteor.Error(400, "Invalid title.");
    } else if(!Posts.findOne({title: title_replaced})){
      throw new Meteor.Error(404, "No such post.");
    }

    return Posts.findOne({title: title_replaced});
  },

  "viewCount+1": function(post_id){
    //validation
    if(!post_id || typeof post_id !== "string"){
      throw new Meteor.Error(400, "Invalid post ID.");
    } else if(!/^[0-9A-Za-z]{17}$/ig.test(post_id)){
      throw new Meteor.Error(400, "Invalid ID.");
    } else if(!Posts.findOne(post_id)){
      throw new Meteor.Error(404, "No such post.");
    }

    //update the view count
    const current_view_count = Posts.findOne(post_id).view_count;
    if(!current_view_count){
      Posts.update(post_id, {
        $set: {
          view_count: 1
        }
      })
    } else {
      Posts.update(post_id, {
        $set: {
          view_count: current_view_count + 1
        }
      })
    }
  },

  "get_posts_metadata": function(query){
    //validation
    if(!query || !query instanceof Object){
      throw new Meteor.Error(400, "Invalid query.");
    }
    const requested_cate = query.category;
    if(requested_cate !== "music" &&
       requested_cate !== "tech" &&
       requested_cate !== "other" &&
       requested_cate !== "" &&
       requested_cate){

      return;
    }

    const current_metadata = MetaData.findOne({type: "posts"});

    if(!requested_cate){
      return {
        total_count: current_metadata.total_count,
        posts_per_page: current_metadata.posts_per_page
      }
    } else {
      return {
        total_count: Posts.find({
          type: requested_cate.charAt(0).toUpperCase() + requested_cate.slice(1)
        }).count(),
        posts_per_page: current_metadata.posts_per_page
      }
    }
  },
})
