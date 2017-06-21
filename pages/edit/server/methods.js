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
        tags: object.tags,
        lastModified: new Date()
    }})
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
  },
  "get_s3_signature": function(access_key){
    //only user with access_key can get the s3 hash
    if(access_key !== Meteor.settings.PNCTSRC_ACCESS_KEY){
      console.log("key - " + access_key);
      throw new Meteor.Error(100, "Access denied");
    }

    var FroalaEditor = require('/node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js');

    var configs_file = {
      // The name of your bucket.
      bucket: Meteor.settings.S3_BUCKET_NAME,

      // S3 region. If you are using the default us-east-1, it this can be ignored.
      region: 'us-east-1',

      // The folder where to upload the images.
      keyStart: Meteor.settings.S3_PATH_NAME + "files/",

      // File access.
      acl: 'public-read',

      // AWS keys.
      accessKey: Meteor.settings.AWS_ACCESS_KEY,
      secretKey: Meteor.settings.AWS_SECRET_KEY
    }

    var configs_image = {
      // The name of your bucket.
      bucket: Meteor.settings.S3_BUCKET_NAME,

      // S3 region. If you are using the default us-east-1, it this can be ignored.
      region: 'us-east-1',

      // The folder where to upload the images.
      keyStart: Meteor.settings.S3_PATH_NAME + "images/",

      // File access.
      acl: 'public-read',

      // AWS keys.
      accessKey: Meteor.settings.AWS_ACCESS_KEY,
      secretKey: Meteor.settings.AWS_SECRET_KEY
    }

    var s3Hash_file = FroalaEditor.S3.getHash(configs_file);
    var s3Hash_image = FroalaEditor.S3.getHash(configs_image);

    return {
      file: s3Hash_file,
      image: s3Hash_image
    }
  }
})
