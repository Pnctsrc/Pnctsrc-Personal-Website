Meteor.publish("post_list", function(page_num){
  const posts_per_page = 10;

  //validating the page number
  var page_number = page_num;
  if(!/^[0-9]+$/gi.test(page_num)){
    return [];
  } else if(page_num <= 0) {
    return [];
  }

  return Posts.find({},{
    limit: posts_per_page,
    skip: (parseInt(page_number) - 1) * posts_per_page,
    sort: {
      createdAt: -1
    }
  })
})

Meteor.publish("get_post", function(post_id){
  //validating the id
  if(!post_id.match(/^[0-9A-Za-z]{17}(?=(#[0-9a-zA-Z_-]+)?$)/gi)){
    return [];
  }

  return Posts.find(post_id, {
    limit: 1,
  })
})

Meteor.publish("metadata", function(type){
  if(type === "posts" || type === "works"){
    return MetaData.find({
      type: type
    });
  } else {
    return [];
  }
})
