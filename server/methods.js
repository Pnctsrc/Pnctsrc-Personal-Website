Meteor.methods({
  "authenticate": function(access_key){
    //server-side validation
    if(access_key !== Meteor.settings.PNCTSRC_ACCESS_KEY){
      console.log("key - " + access_key);
      throw new Meteor.Error(100, "Access denied.");
    }
  },
  "save_work_thumbnail": function(object, image_base64, file_type, access_key, work_id){
    //server-side validation
    if(access_key !== Meteor.settings.PNCTSRC_ACCESS_KEY){
      console.log("key - " + access_key);
      throw new Meteor.Error(100, "Access denied.");
    } else if(!object || !object instanceof Object){
      throw new Meteor.Error(400, "Invalid work.");
    } else if(!file_type || typeof file_type !== "string"){
      throw new Meteor.Error(400, "Invalid file type.");
    } else if(work_id && typeof work_id !== "string"){
      throw new Meteor.Error(400, "Invalid work ID.");
    } else if(!image_base64 || typeof image_base64 !== "string"){
      throw new Meteor.Error(400, "Invalid base64.");
    }

    if(_.indexOf(["jpg", "jpeg", "png"], file_type) === -1){
      console.log("Image type - " + file_type);
      throw new Meteor.Error(400, "Image type not allowed.");
    }

    const fs = require("fs");

    //delete the previous thumbnail if exists
    if(work_id){
      const current_thumbnail = Works.findOne(work_id).thumbnail;
      const fileName = current_thumbnail.substring(current_thumbnail.lastIndexOf('/') + 1);
      const path = Meteor.settings.IMAGE_PATH + fileName;
      if(fs.existsSync(path)){
        fs.unlinkSync(path);
      }
    }

    //convert base64 to image_file buffer
    var image_file = new Buffer(image_base64, 'base64');

    //write file to disk
    const file_name = "thumbnail_" + (new Date()).getTime() + "." + file_type;
    const file_path = Meteor.settings.IMAGE_PATH + file_name;
    fs.writeFileSync(file_path, image_file);

    //update the document
    const img_URL = "/resources/images/" + file_name;

    if(work_id){
      Works.update(work_id, {$set: {
          HTML_content: object.HTML_content,
          title: object.title,
          description: object.description,
          date: object.date,
          type: object.type,
          thumbnail: img_URL,
          lastModified: new Date()
      }}, function(err){
        if(err){
          fs.unlinkSync(file_path);
          throw new Meteor.Error(err.sanitizedError.error, err.message);
        }
      })

      return Works.findOne(work_id).title;
    } else {
      Works.insert({
          HTML_content: object.HTML_content,
          title: object.title,
          description: object.description,
          view_count: 0,
          date: object.date,
          type: object.type,
          thumbnail: img_URL,
          createdAt: new Date()
      }, function(err){
        if(err){
          fs.unlinkSync(file_path);
          throw new Meteor.Error(err.sanitizedError.error, err.message);
        }
      })

      MetaData.update({
        type: "works"
      }, {
        $set: {
          total_count: MetaData.findOne({type: "works"}).total_count + 1
        }
      })

      return object.title;
    }
  },
})
