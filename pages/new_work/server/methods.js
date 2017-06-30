Meteor.methods({
  "submit_work": function(object, access_key){
    //server-side validation
    if(access_key !== Meteor.settings.PNCTSRC_ACCESS_KEY){
      console.log("key - " + access_key);
      throw new Meteor.Error(100, "Access denied");
    }

    //insert into database
    const _id = Works.insert({
        HTML_content: object.HTML_content,
        title: object.title,
        description: object.description,
        view_count: 0,
        date: object.date,
        type: object.type,
        createdAt: new Date()
    })

    MetaData.update({
      type: "works"
    }, {
      $set: {
        total_count: MetaData.findOne({type: "works"}).total_count + 1
      }
    })

    return _id;
  }
})
