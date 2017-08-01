Template.profile.onRendered(function(){
  $('.ui.form').form({
    fields: {
      firstname: {
        identifier: 'firstname',
        rules: [
          {
            type   : 'regExp[/^[a-zA-Z]{2,50}$/]',
            prompt : 'Please enter a first name of 2-50 letters'
          }
        ]
      },
      lastname: {
        identifier: 'lastname',
        rules: [
          {
            type   : 'regExp[/^[a-zA-Z]{2,50}$/]',
            prompt : 'Please enter a last name of 2-50 letters'
          }
        ]
      }
    },
    onSuccess: function(event){
      event.preventDefault();
    }
  });
})

Template.profile.helpers({
  "getFirstname": function(){
    const profile = Meteor.users.findOne()
    return profile ? (profile.pnctsrc ? (profile.pnctsrc.last_name ? profile.pnctsrc.first_name : "") : "") : "";
  },
  "getLastname": function(){
    const profile = Meteor.users.findOne()
    return profile ? (profile.pnctsrc ? (profile.pnctsrc.last_name ? profile.pnctsrc.last_name : "") : "") : "";
  },
  "getUserEmail": function(){
    const profile = Meteor.users.findOne()
    return profile ? profile.services.google.email : "";
  },
})

Template.profile.events({
  "click .js-save-change": function(event){
    if(!$(".ui.form").form("is valid")) return;

    //check difference
    const profile = Meteor.users.findOne();
    const first_name = $(".js-first-name").val();
    const last_name = $(".js-last-name").val();

    if((profile.pnctsrc && profile.pnctsrc.first_name === first_name) && (profile.pnctsrc && profile.pnctsrc.last_name === last_name)){
      return;
    }

    //send changes
    $(".js-save-change").attr("class", "ui primary loading disabled submit button js-save-change");
    const new_profile = {
      first_name: first_name,
      last_name: last_name
    }
    Meteor.call("save_profile_change", new_profile, function(err){
      if(err){
        window.alert(err);
        return;
      }

      $(".js-save-change").attr("class", "ui primary submit button js-save-change");
      $('.blue.message').transition('scale');
  		setTimeout(function(){
  			$('.blue.message').transition('scale');
  		}, 3000)
    })
  }
})
