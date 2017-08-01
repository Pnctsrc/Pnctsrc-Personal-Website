Schemas = {};

SimpleSchema.messages({
    "unsafeHTML": "HTML is unsafe",
    "invalidTitle": "Invalid title",
    "notUniqueTitle": "Title is not unique"
})

Schemas.Google = new SimpleSchema({
    accessToken: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    expiresAt: {
        type: Number,
        optional: true
    },
    family_name: {
        type: String
    },
    given_name: {
        type: String,
    },
    id: {
        type: String
    },
    idToken: {
        type: String
    },
    locale: {
        type: String
    },
    name: {
        type: String,
        max: 100,
    },
    picture: {
        type: String,
        regEx: SimpleSchema.RegEx.Url
    },
    scope: {
        type: [String],
    },
    verified_email: {
        type: Boolean,
        optional: true
    }
})

Schemas.Services = new SimpleSchema({
    resume: {
        type: Schemas.Resume,
        blackbox: true,
        optional: true,
    },
    google: {
        type: Schemas.Google,
    },
    password: {
        type: Object,
        blackbox: true,
        optional: true
    }
})

Schemas.Resume = new SimpleSchema({
    loginTokens: {
        type: [Object],
    },
    'loginTokens.0': {
        type: Object,
        optional: true
    },
    'loginTokens.0.when': {
        type: Date
    },
    'loginTokens.0.hashedToken': {
        type: String
    }
})

Schemas.UserProfile = new SimpleSchema({
    firstName: {
        type: String,
        optional: true
    },
    lastName: {
        type: String,
        optional: true
    },
    name: {
        type: String,
        optional: true
    },
    birthday: {
        type: Date,
        optional: true
    },
    gender: {
        type: String,
        allowedValues: ['Male', 'Female'],
        optional: true
    },
    organization : {
        type: String,
        optional: true
    },
    website: {
        type: String,
        regEx: SimpleSchema.RegEx.Url,
        optional: true
    },
    bio: {
        type: String,
        optional: true
    },
    country: {
        type: Schemas.UserCountry,
        optional: true
    }
});

Schemas.Pnctsrc = new SimpleSchema({
    first_name: {
        type: String,
        regEx: /^[a-zA-Z]{2,50}$/
    },
    last_name: {
        type: String,
        regEx: /^[a-zA-Z]{2,50}$/
    },
});

Schemas.User = new SimpleSchema({
    username: {
        type: String,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true,
        max: 100
    },
    emails: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        max: 50,
    },
    "emails.$.verified": {
        type: Boolean
    },
    // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
    registered_emails: {
        type: [Object],
        optional: true,
        blackbox: true
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: Schemas.UserProfile,
    },
    // Make sure this services field is in your schema if you're using any of the accounts packages
    services: {
        type: Schemas.Services,
    },
    // Add `roles` to your schema if you use the meteor-roles package.
    // Option 1: Object type
    // If you specify that type as Object, you must also specify the
    // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
    // Example:
    // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
    // You can't mix and match adding with and without a group since
    // you will fail validation in some cases.
    roles: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Option 2: [String] type
    // If you are sure you will never need to use role groups, then
    // you can specify [String] as the type
    roles: {
        type: [String],
        optional: true
    },
    // In order to avoid an 'Exception in setInterval callback' from Meteor
    heartbeat: {
        type: Date,
        optional: true
    },
    //custom field for pnctsrc.me
    pnctsrc: {
      type: Schemas.Pnctsrc,
      optional: true
    }
});

Meteor.users.attachSchema(Schemas.User);

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
