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
  $(".affix_view").toggle("hide");
})

Template.affix_tag_list.helpers({
  "current_level_tags": function(parent_tag){
    if(!Session.get("view_html_content")) return;
    var tags = [];

    var HTML_content = Session.get("view_html_content");
    var tag_list = HTML_content.match(/<h[1-6] id=\"[\w_\d]+(-[\w_\d]+)?\">/gi);
    if(!tag_list) return;

    for(var tag of tag_list){
      var tag_regex;
      if(parent_tag){
        tag_regex = new RegExp("id=\"" + parent_tag + "-[\\w_\\d]+\"", "gi");
      } else {
        tag_regex = new RegExp("id=\"[\\w_\\d]+\"", "gi");
      }

      if(tag.match(tag_regex)){
        tags.push(tag.match(/[\w_\d]+(-[\w_\d]+)?/gi)[2]);
      }
    }

    //display the affix
    if(!parent_tag){
      setTimeout(function(){
        $(".affix_view").toggle("hide");
      }, 350)
    }

    return tags;
  },
  "has_sub_tags": function(parent_tag){
    if(!Session.get("view_html_content")) return;

    var HTML_content = Session.get("view_html_content");
    var tag_list = HTML_content.match(/<h[1-6] id=\"([\w_\d]+-?)+\">/gi);

    for(var tag of tag_list){
      var tag_regex;
      if(parent_tag){
        tag_regex = new RegExp("id=\"" + parent_tag + "-[\\w_\\d]+\"", "gi");
      } else {
        tag_regex = new RegExp("id=\"[\\w_\\d]+\"", "gi");
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
  },
  "getTagName": function(tag){
    if(tag.indexOf("-") === -1){
      return tag.replace(/_/gi, " ");
    } else {
      return tag.substring(tag.indexOf("-") + 1).replace(/_/gi, " ");
    }
  }
})
