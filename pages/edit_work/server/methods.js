Meteor.methods({
  "submit_work_edit": function(object, work_id, access_key, image_base64, file_type){
    //only user with access_key can edit
    if(access_key !== Meteor.settings.PNCTSRC_ACCESS_KEY){
      console.log("key - " + access_key);
      throw new Meteor.Error(100, "Access denied.");
    }

    //server-side validation
    if(!object || !object instanceof Object){
      throw new Meteor.Error(400, "Invalid work.");
    } else if(!work_id || typeof work_id !== "string"){
      throw new Meteor.Error(400, "Invalid work ID.");
    } else if(!/^[0-9A-Za-z]{17}$/ig.test(work_id)){
      throw new Meteor.Error(400, "Invalid ID.");
    } else if(!Works.findOne(work_id)){
      throw new Meteor.Error(404, "No such work.");
    }

    if(!image_base64){
      //update the database
      Works.update(work_id, {$set: {
          HTML_content: object.HTML_content,
          title: object.title,
          description: object.description,
          date: object.date,
          type: object.type,
          thumbnail: object.thumbnail,
          lastModified: new Date()
      }})

      return Works.findOne(work_id).title;
    } else {
      return Meteor.call("save_work_thumbnail", object, image_base64, file_type, access_key, work_id);
    };
  },

  "delete_work": function(work_id, access_key){
    //only user with access_key can delete
    if(access_key !== Meteor.settings.PNCTSRC_ACCESS_KEY){
      console.log("key - " + access_key);
      throw new Meteor.Error(100, "Access denied.");
    }

    //server-side validation
    if(!work_id || typeof work_id !== "string"){
      throw new Meteor.Error(400, "Invalid work ID.");
    } else if(!/^[0-9A-Za-z]{17}$/ig.test(work_id)){
      throw new Meteor.Error(400, "Invalid ID.");
    } else if(!Works.findOne(work_id)){
      throw new Meteor.Error(404, "No such work.");
    }

    //update the database
    Works.remove(work_id);

    //update the metadata
    MetaData.update({
      type: "works"
    }, {
      $set: {
        total_count: MetaData.findOne({type: "works"}).total_count - 1
      }
    })
  },
})
