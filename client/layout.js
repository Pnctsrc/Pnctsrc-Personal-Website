Template.layout.events({
  "click #link_list > a": function(event){
    $("#link_list a").removeClass("active");
    $("#collapse_button ul a").removeClass("active");
    $(event.currentTarget).addClass("active");
    const link_type = event.currentTarget.innerHTML.toLowerCase();
    $("#collapse_button ul a[class=" + link_type + "_link]").addClass("active");
  },

  "click #collapse_button ul a": function(event){
    $("#collapse_button ul a").removeClass("active");
    $("#link_list a").removeClass("active");
    $(event.currentTarget).addClass("active");
    const link_type = event.currentTarget.innerHTML.toLowerCase();
    $("#link_list a[class=" + link_type + "_link]").addClass("active");
  },
})
