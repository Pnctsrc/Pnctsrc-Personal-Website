Meteor.methods({
  "get_works": function(query){
    //validation
    const requested_page = query.page;
    const total_pages = Math.ceil(MetaData.findOne({type: "works"}).total_count / MetaData.findOne({type: "works"}).works_per_page);
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
    const works_per_page = MetaData.findOne({type: "works"}).works_per_page;

    const query_object = {};
    const options_object = {
      limit: works_per_page,
      skip: (parseInt(requested_page) - 1) * works_per_page,
    };

    if(requested_cate !== "" && requested_cate){
      query_object.type = requested_cate.charAt(0).toUpperCase() + requested_cate.slice(1);
    }

    if(requested_sort !== "" && requested_sort){
      if(requested_sort === "date_as"){
        options_object.sort = {
          date: 1,
          createdAt: -1
        };
      } else if(requested_sort === "date_ds"){
        options_object.sort = {
          date: -1,
          createdAt: -1
        };
      } else if(requested_sort === "view_as"){
        options_object.sort = {
          view_count: 1,
          date: -1,
          createdAt: -1
        };
      } else {
        options_object.sort = {
          view_count: -1,
          date: -1,
          createdAt: -1
        };
      }
    } else {
      options_object.sort = {
        date: -1,
        createdAt: -1
      };
    }

    return Works.find(query_object, options_object).fetch();
  },

  "get_work_by_id": function(work_id){
    //validation
    if(!/^[0-9A-Za-z]{17}$/ig.test(work_id)){
      throw new Meteor.Error(404, "Invalid id");
    } else if(!Works.findOne(work_id)){
      throw new Meteor.Error(404, "No such post");
    }

    return Works.findOne(work_id);
  },

  "get_work_by_title": function(work_title){
    const title_replaced = work_title.replace(/_/g, " ");

    //validation
    if(title_replaced.length < 1){
      throw new Meteor.Error(404, "Invalid title");
    } else if(!Works.findOne({title: title_replaced})){
      throw new Meteor.Error(404, "No such work");
    }

    return Works.findOne({title: title_replaced});
  },


  "viewCount+1_work": function(work_id){
    //validation
    if(!/^[0-9A-Za-z]{17}$/ig.test(work_id)){
      throw new Meteor.Error(404, "Invalid id");
    } else if(!Works.findOne(work_id)){
      throw new Meteor.Error(404, "No such work");
    }

    //update the view count
    const current_view_count = Works.findOne(work_id).view_count;
    if(!current_view_count){
      Works.update(work_id, {
        $set: {
          view_count: 1
        }
      })
    } else {
      Works.update(work_id, {
        $set: {
          view_count: current_view_count + 1
        }
      })
    }
  },

  "get_works_metadata": function(query){
    //validation
    const requested_cate = query.category;
    if(requested_cate !== "music" &&
       requested_cate !== "tech" &&
       requested_cate !== "other" &&
       requested_cate !== "" &&
       requested_cate){

      return;
    }

    const current_metadata = MetaData.findOne({type: "works"});

    if(!requested_cate){
      return {
        total_count: current_metadata.total_count,
        works_per_page: current_metadata.works_per_page
      }
    } else {
      return {
        total_count: Works.find({
          type: requested_cate.charAt(0).toUpperCase() + requested_cate.slice(1)
        }).count(),
        works_per_page: current_metadata.works_per_page
      }
    }
  },
})
