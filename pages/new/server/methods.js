Meteor.methods({
  "submit_post": function(object, access_key){
    //server-side validation
    if(access_key !== Meteor.settings.PNCTSRC_ACCESS_KEY){
      console.log("key - " + access_key);
      throw new Meteor.Error(100, "Access denied");
    }

    //insert into database
    return Posts.insert({
        HTML_content: object.HTML_content,
        title: object.title,
        description: object.description,
        tags: object.tags,
        createdAt: new Date()
    })
  }
})
