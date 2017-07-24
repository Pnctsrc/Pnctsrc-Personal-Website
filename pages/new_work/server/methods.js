Meteor.methods({
  "submit_work": function(object, access_key, image_base64, file_type){
    //server-side validation
    if(access_key !== Meteor.settings.PNCTSRC_ACCESS_KEY){
      console.log("key - " + access_key);
      throw new Meteor.Error(100, "Access denied");
    }

    if(!image_base64){
      throw new Meteor.Error(100, "No thumbnail");
    } else {
      return Meteor.call("save_work_thumbnail", object, image_base64, file_type, access_key);
    };
  },
})
