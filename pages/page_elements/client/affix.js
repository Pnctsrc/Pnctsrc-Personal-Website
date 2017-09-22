Template.affix.onCreated(function(){
  Session.set("view_html_content", null);
})

Template.affix.onRendered(function(){
  $('body').scrollspy({
    target: '.scrollspy'
  });

  //disable default scroll on affix 
  $('.affix_view').on('mousewheel DOMMouseScroll', function(e){
    var e0 = e.originalEvent;
    var delta = e0.wheelDelta || -e0.detail;

    this.scrollTop += (delta < 0 ? 1 : -1) * 30;
    e.preventDefault();
  });
})

Template.affix.onDestroyed(function(){
  Session.set("view_html_content");

  //hide the affix
  $(".affix_view").css("opacity", 0);
  setTimeout(function () {
    $(".affix_view").css("display", "block");
  }, 350);
})

Template.affix_tag_list.helpers({
  "current_level_tags": function(parent_tag){
    if(!Session.get("view_html_content")) return;
    var tags = [];

    var HTML_content = Session.get("view_html_content");
    var tag_list = HTML_content.match(/<h[1-6] id=\"(\w|-|\d)+\">/gi);
    if(!tag_list) return;

    for(var tag of tag_list){
      var tag_regex;
      if(parent_tag){
        tag_regex = new RegExp("id=\"" + parent_tag + "-\\w+\"", "gi");
      } else {
        tag_regex = new RegExp("id=\"\\w+\"", "gi");

        //display the affix
        $(".affix_view").css("display", "block");
        setTimeout(function () {
          $(".affix_view").css("opacity", 1);
        }, 350);
      }

      if(tag.match(tag_regex)){
        tags.push(tag.match(/(\w|-|\d)+/gi)[2]);
      }
    }

    return tags;
  },
  "has_sub_tags": function(parent_tag){
    if(!Session.get("view_html_content")) return;

    var HTML_content = Session.get("view_html_content");
    var tag_list = HTML_content.match(/<h[1-6] id=\"(\w|-|\d)+\">/gi);

    for(var tag of tag_list){
      var tag_regex;
      if(parent_tag){
        tag_regex = new RegExp("id=\"" + parent_tag + "-\\w+\"", "gi");
      } else {
        tag_regex = new RegExp("id=\"\\w+\"", "gi");
      }

      if(tag.match(tag_regex)) return true;
    }

    return false;
  },
  "getAttrSpy": function(parent_tag){
    return parent_tag ? null : "affix";
  },
  "getId": function(parent_tag){
    return parent_tag ? null : "affix_nav";
  }
})
