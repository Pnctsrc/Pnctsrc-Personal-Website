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
