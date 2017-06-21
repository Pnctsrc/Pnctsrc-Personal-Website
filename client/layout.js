Template.layout.events({
  "click #buttons_list > a": function(event){
    $("#buttons_list a").removeClass("active");
    $(event.currentTarget).addClass("active");
  }
})
