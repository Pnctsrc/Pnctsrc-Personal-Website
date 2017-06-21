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
  },
  "get_s3_signature": function(){
    var FroalaEditor = require('/node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js');
    var configs = {
      // The name of your bucket.
      bucket: Meteor.settings.S3_BUCKET_NAME,

      // S3 region. If you are using the default us-east-1, it this can be ignored.
      region: 'us-east-1',

      // The folder where to upload the images.
      keyStart: Meteor.settings.S3_PATH_NAME,

      // File access.
      acl: 'public-read',

      // AWS keys.
      accessKey: Meteor.settings.AWS_ACCESS_KEY,
      secretKey: Meteor.settings.AWS_SECRET_KEY
    }

    var s3Hash = FroalaEditor.S3.getHash(configs);

    return s3Hash;
  }
})
