Meteor.methods({
  "get_about": function(){
    return About.findOne();
  },

  "update_about": function(HTML_content, access_key){
    //server-side validation
    if(access_key !== Meteor.settings.PNCTSRC_ACCESS_KEY){
      console.log("key - " + access_key);
      throw new Meteor.Error(100, "Access denied.");
    } else if(!HTML_content || typeof HTML_content !== "string"){
      throw new Meteor.Error(400, "Invalid HTML_content.");
    } 

    if(About.findOne()){
      About.update(About.findOne()._id, {$set:{HTML_content: HTML_content}});
    } else {
      About.insert({HTML_content: HTML_content});
    }
  },
})
