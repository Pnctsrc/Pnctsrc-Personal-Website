Template.content_view.onRendered(function(){
  //initialize the code blocks
  const hljs = require("highlight.js");
  hljs.configure({
    tabReplace: '  '
  })
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  setTimeout(function(){
    //display the content
    $("div#card_view").css("opacity", 1);
  }, 200)
  
  //jump to hashtag if there is
  if(Router.current().params.hash){
    window.location.hash = "";
    window.location.hash = Router.current().params.hash;
  }
})
