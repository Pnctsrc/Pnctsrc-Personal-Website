import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  //update databse metadata
  const posts_count = Posts.find().count();
  const posts_per_page = 10;
  if(!MetaData.findOne({type: "posts"})){
    MetaData.insert({
      type: "posts",
      total_count: posts_count,
      posts_per_page: posts_per_page
    })
  } else {
    MetaData.update({
      type: "posts"
    }, {
      $set: {
        total_count: posts_count,
        posts_per_page: posts_per_page
      }
    })
  }
});
