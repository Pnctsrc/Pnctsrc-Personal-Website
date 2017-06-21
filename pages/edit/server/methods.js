Meteor.methods({
  "submit_post_edit": function(object, post_id){
    //server-side validation
    if(!/^[0-9A-Za-z]{17}$/ig.test(post_id)){
      throw Meteor.Error(404, "Invalid id");
    } else if(!Posts.findOne(post_id)){
      throw Meteor.Error(404, "No such post");
    }

    //update the database
    Posts.update(post_id, {$set: {
        HTML_content: object.HTML_content,
        title: object.title,
        description: object.description,
        tags: object.tags,
        lastModified: new Date()
    }})
  }
})
