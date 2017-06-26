Meteor.publish("metadata", function(type){
  if(type === "posts" || type === "works"){
    return MetaData.find({
      type: type
    });
  } else {
    return [];
  }
})
