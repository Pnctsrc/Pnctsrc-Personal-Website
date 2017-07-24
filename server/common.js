Schemas = {};

SimpleSchema.messages({
    "unsafeHTML": "HTML is unsafe",
    "invalidTitle": "Invalid title",
    "notUniqueTitle": "Title is not unique"
})

Schemas.Works = new SimpleSchema({
  HTML_content: {
    type: String,
    min: 1,
    custom: function(){
      if(this.value.match(/(<script>|<\/script>)/gi)){
          return "unsafeHTML"
      }
    },
  },
  title: {
    type: String,
    max: 200,
    min: 1,
    custom: function(){
      if(this.value.match(/_/gi)){
          return "invalidTitle"
      }

      const uniqueDocument = Works.findOne({title: this.value});
      if(uniqueDocument){
        if((this.isUpdate && uniqueDocument._id !== this.docId) || this.isInsert){
          return "notUniqueTitle"
        }
      }
    },
  },
  description: {
    type: String,
    min: 1
  },
  view_count: {
    type: Number,
    min: 0,
    custom: function(){
      return (typeof this.value === 'number') && (this.value % 1 === 0);
    }
  },
  date: {
    type: String,
    regEx: /^\d{4}-\d{2}-\d{2}$/
  },
  type: {
    type: String,
    allowedValues: ["Tech", "Music", "Other"]
  },
  thumbnail: {
    type: String,
    regEx: /^\/resources\/images\/thumbnail_\d+\.(jpg|jpeg|png)$/
  },
  createdAt: {
    type: Date
  },
  lastModified: {
    type: Date,
    optional: true
  },
});

Works.attachSchema(Schemas.Works);

Schemas.Posts = new SimpleSchema({
  HTML_content: {
    type: String,
    min: 1,
    custom: function(){
      if(this.value.match(/(<script>|<\/script>)/gi)){
          return "unsafeHTML"
      }
    },
  },
  title: {
    type: String,
    max: 200,
    min: 1,
    custom: function(){
      if(this.value.match(/_/gi)){
          return "invalidTitle"
      }

      const uniqueDocument = Posts.findOne({title: this.value});
      if(uniqueDocument){
        if((this.isUpdate && uniqueDocument._id !== this.docId) || this.isInsert){
          return "notUniqueTitle"
        }
      }
    },
  },
  description: {
    type: String,
    min: 1
  },
  view_count: {
    type: Number,
    min: 0,
    custom: function(){
      return (typeof this.value === 'number') && (this.value % 1 === 0);
    }
  },
  type: {
    type: String,
    allowedValues: ["Tech", "Music", "Other"]
  },
  createdAt: {
    type: Date
  },
  lastModified: {
    type: Date,
    optional: true
  },
});

Posts.attachSchema(Schemas.Posts);

Schemas.About = new SimpleSchema({
  HTML_content: {
    type: String,
    min: 1,
    custom: function(){
      if(this.value.match(/(<script>|<\/script>)/gi)){
          return "unsafeHTML"
      }
    },
  },
});

About.attachSchema(Schemas.About);
