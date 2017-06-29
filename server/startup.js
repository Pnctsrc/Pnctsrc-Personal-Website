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

  const works_count = Works.find().count();
  const works_per_page = 9;
  if(!MetaData.findOne({type: "works"})){
    MetaData.insert({
      type: "works",
      total_count: works_count,
      works_per_page: works_per_page
    })
  } else {
    MetaData.update({
      type: "works"
    }, {
      $set: {
        total_count: works_count,
        works_per_page: works_per_page
      }
    })
  }
});
