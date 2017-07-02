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
      return Meteor.call("upload_thumbnail_to_S3", object, image_base64, file_type, access_key);
    };
  },

  "upload_thumbnail_to_S3": function(object, image_base64, file_type, access_key){
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
      //insert into database
      const _id = Works.insert({
          HTML_content: object.HTML_content,
          title: object.title,
          description: object.description,
          view_count: 0,
          date: object.date,
          type: object.type,
          thumbnail: img_URL,
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
    }).catch(function(err) {
      throw new Meteor.Error(100, err);
    });
  },
})
