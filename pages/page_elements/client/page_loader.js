Template.page_loader.onRendered(function(){
  const loaderDict = this.data.loaderDict;
  var wait_time = this.data.wait_time;
  if(wait_time !== 0) wait_time = 1000;

  setTimeout(function () {
    //show the dimmer if the data is not ready after 1 second
    if(!loaderDict.get("data_ready")){
      $(".dimmer").dimmer("add content", "div.mainContent");
      $(".dimmer").dimmer("set active");
    }
  }, wait_time);
})
