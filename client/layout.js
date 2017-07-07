Template.layout.onRendered(function(){
  var page_type = Router.current().url.match(/(work|post|about)/);
  if(!page_type) return;

  var link_type;
  if(page_type[0] === "post"){
    link_type = "blog";
  } else if (page_type[0] === "work"){
    link_type = "works";
  } else if (page_type[0] === "about"){
    link_type = "about";
  }

  $("#link_list a").removeClass("active");
  $("#collapse_button ul a").removeClass("active");
  $("#collapse_button ul a[class=" + link_type + "_link]").addClass("active");
  $("#link_list a[class=" + link_type + "_link]").addClass("active");
})

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

Template.layout.helpers({
  "homepage": function(){
    return Homepage.findOne();
  },
})
