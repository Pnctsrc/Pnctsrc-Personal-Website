Meteor.methods({
  "get_about": function(){
    return About.findOne();
  },

  "update_about": function(HTML_content, access_key){
    //server-side validation
    if(access_key !== Meteor.settings.PNCTSRC_ACCESS_KEY){
      console.log("key - " + access_key);
      throw new Meteor.Error(100, "Access denied");
    }

    if(About.findOne()){
      About.update(About.findOne()._id, {HTML_content: HTML_content});
    } else {
      About.insert({HTML_content: HTML_content});
    }
  },
})
