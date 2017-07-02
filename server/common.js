Schemas = {};

SimpleSchema.messages({
    "unsafeHTML": "HTML is unsafe",
})

Schemas.Works = new SimpleSchema({
  HTML_content: {
    type: String,
    custom: function(){
      if(this.value.match(/(<script>|<\/script>)/gi)){
          return "unsafeHTML"
      }
    },
  },
  title: {
    type: String,
    max: 200,
    unique: true
  },
  description: {
    type: String
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
    regEx: SimpleSchema.RegEx.Url
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
