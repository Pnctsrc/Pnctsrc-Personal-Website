if(!ServiceConfiguration.configurations.findOne({service: "google"})){
  ServiceConfiguration.configurations.insert({
    service: "google",
    clientId: Meteor.settings.GOOGLE_CLIENT_ID,
    loginStyle: "popup",
    secret: Meteor.settings.GOOGLE_SECRET
  });
}
