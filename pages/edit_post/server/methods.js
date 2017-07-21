Meteor.methods({
  "submit_post_edit": function(object, post_id, access_key){
    //only user with access_key can get the s3 hash
    if(access_key !== Meteor.settings.PNCTSRC_ACCESS_KEY){
      console.log("key - " + access_key);
      throw new Meteor.Error(100, "Access denied");
    }

    //server-side validation
    if(!/^[0-9A-Za-z]{17}$/ig.test(post_id)){
      throw new Meteor.Error(404, "Invalid id");
    } else if(!Posts.findOne(post_id)){
      throw new Meteor.Error(404, "No such post");
    }

    //update the database
    Posts.update(post_id, {$set: {
        HTML_content: object.HTML_content,
        title: object.title,
        description: object.description,
        type: object.type,
        lastModified: new Date()
    }})

    return Posts.findOne(post_id).title;
  },
  "delete_post": function(post_id, access_key){
    //only user with access_key can get the s3 hash
    if(access_key !== Meteor.settings.PNCTSRC_ACCESS_KEY){
      console.log("key - " + access_key);
      throw new Meteor.Error(100, "Access denied");
    }

    //server-side validation
    if(!/^[0-9A-Za-z]{17}$/ig.test(post_id)){
      throw new Meteor.Error(404, "Invalid id");
    } else if(!Posts.findOne(post_id)){
      throw new Meteor.Error(404, "No such post");
    }

    //update the database
    Posts.remove(post_id);

    //update the metadata
    MetaData.update({
      type: "posts"
    }, {
      $set: {
        total_count: MetaData.findOne({type: "posts"}).total_count - 1
      }
    })
  },
  "validate_access": function(access_key){
    //only user with access_key can get the s3 hash
    if(access_key !== Meteor.settings.PNCTSRC_ACCESS_KEY){
      console.log("key - " + access_key);
      throw new Meteor.Error(100, "Access denied");
    }
  }
})
