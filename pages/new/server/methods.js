Meteor.methods({
  "test": function(){
    var FroalaEditor = require('/node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js');
  },

  "submit_post": function(object){
    //server-side validation

    //insert into database
    Posts.insert({
        HTML_content: object.HTML_content,
        title: object.title,
        description: object.description,
        tags: object.tags,
        createdAt: new Date()
    })
  }
})
