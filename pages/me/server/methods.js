Meteor.methods({
  "save_profile_change": function(profile){
    //validate
    if(!this.userId){
      throw new Meteor.Error("403", "Not logged in.");
    } else if (!/^[a-zA-Z]{2,50}$/.test(profile.first_name)){
      throw new Meteor.Error("400", "Invalid first name.");
    } else if (!/^[a-zA-Z]{2,50}$/.test(profile.last_name)){
      throw new Meteor.Error("400", "Invalid last name.");
    }

    Meteor.users.update({_id: this.userId}, {$set:{
      pnctsrc: {
        first_name: profile.first_name,
        last_name: profile.last_name
      }
    }}, function(err, result){
      if(err){
        console.log(err);
      }
    });
  }
})