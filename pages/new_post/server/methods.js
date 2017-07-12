Meteor.methods({
  "submit_post": function(object, access_key){
    //server-side validation
    if(access_key !== Meteor.settings.PNCTSRC_ACCESS_KEY){
      console.log("key - " + access_key);
      throw new Meteor.Error(100, "Access denied");
    }

    //insert into database
    const _id = Posts.insert({
        HTML_content: object.HTML_content,
        title: object.title,
        description: object.description,
        type: object.type,
        view_count: 0,
        createdAt: new Date()
    })

    MetaData.update({
      type: "posts"
    }, {
      $set: {
        total_count: MetaData.findOne({type: "posts"}).total_count + 1
      }
    })

    return object.title;
  }
})
