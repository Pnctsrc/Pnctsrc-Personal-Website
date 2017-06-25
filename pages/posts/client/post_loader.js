Template.post_loader.onRendered(function(){
  const postsDict = this.data.postsDict;
  setTimeout(function () {
    //show the dimmer if the data is not ready after 1 second
    if(!postsDict.get("data_ready")){
      $(".dimmer").dimmer("add content", "div.mainContent");
      $(".dimmer").dimmer("set active");
    }
  }, 1000);
})
