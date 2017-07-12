Meteor.methods({
  "submit_work_edit": function(object, work_id, access_key, image_base64, file_type){
    //only user with access_key can get the s3 hash
    if(access_key !== Meteor.settings.PNCTSRC_ACCESS_KEY){
      console.log("key - " + access_key);
      throw new Meteor.Error(100, "Access denied");
    }

    //server-side validation
    if(!/^[0-9A-Za-z]{17}$/ig.test(work_id)){
      throw new Meteor.Error(404, "Invalid id");
    } else if(!Works.findOne(work_id)){
      throw new Meteor.Error(404, "No such work");
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
      return Meteor.call("upload_thumbnail_to_S3_edit", object, work_id, image_base64, file_type, access_key);
    };
  },

  "delete_work": function(work_id, access_key){
    //only user with access_key can get the s3 hash
    if(access_key !== Meteor.settings.PNCTSRC_ACCESS_KEY){
      console.log("key - " + access_key);
      throw new Meteor.Error(100, "Access denied");
    }

    //server-side validation
    if(!/^[0-9A-Za-z]{17}$/ig.test(work_id)){
      throw new Meteor.Error(404, "Invalid id");
    } else if(!Works.findOne(work_id)){
      throw new Meteor.Error(404, "No such work");
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

  "upload_thumbnail_to_S3_edit": function(object, work_id, image_base64, file_type, access_key){
    //server-side validation
    if(access_key !== Meteor.settings.PNCTSRC_ACCESS_KEY){
      console.log("key - " + access_key);
      throw new Meteor.Error(100, "Access denied");
    }

    //convert base64 to image_file blob
    var image_file = new Buffer(image_base64, 'base64');

    // Import the Amazon S3 service client
    var S3 = Npm.require('aws-sdk/clients/s3');

    // Set credentials and region
    var s3 = new S3({
        apiVersion: '2006-03-01',
        region: 'us-east-1',
        accessKeyId: Meteor.settings.AWS_ACCESS_KEY,
        secretAccessKey: Meteor.settings.AWS_SECRET_KEY,
    });

    var params = {
      Bucket: Meteor.settings.S3_BUCKET_NAME,
      Key: Meteor.settings.S3_PATH_NAME + "images/thumbnail_" + (new Date()).getTime() + "." + file_type.substring(6),
      ACL: "public-read",
      Body: image_file
    };

    return s3.upload(params).promise().then(function(data) {
      const img_URL = data.Location;
      //update the database
      Works.update(work_id, {$set: {
          HTML_content: object.HTML_content,
          title: object.title,
          description: object.description,
          date: object.date,
          type: object.type,
          thumbnail: img_URL,
          lastModified: new Date()
      }})

      return Works.findOne(work_id).title;
    }).catch(function(err) {
      throw new Meteor.Error(100, err);
    });
  },
})
