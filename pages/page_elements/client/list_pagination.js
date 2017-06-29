Template.list_pagination.onCreated(function(){
  this.listDict = this.data.listDict;
})

Template.list_pagination.helpers({
  "getPageNum": function(){
    if(!Router.current().params.query){
      return "";
    } else {
      return Router.current().params.query.page;
    }
  },
})

Template.list_pagination.events({
  "change .page_num": function(){
    const text = $("input.page_num").val();
    const current_page = parseInt(Router.current().params.query.page);
    const page_type = Template.instance().data.pageType;
    var total_pages = Math.ceil(MetaData.findOne().total_count / MetaData.findOne()[page_type + "_per_page"]);

    var final_page_num;

    if(!/^-?\d+$/i.test(text)){
      $("input.page_num").val(current_page);
      final_page_num = current_page;
    } else if (parseInt(text) > total_pages){
      $("input.page_num").val(total_pages);
      final_page_num = total_pages;
    } else if(parseInt(text) <= 0){
      $("input.page_num").val(1);
      final_page_num = 1;
    } else {
      $("input.page_num").val(text);
      final_page_num = text;
    }

    if(final_page_num != current_page){//if it will stay on the same page, data won't be refreshed
      Template.instance().listDict.set("data_ready", false);
    }
    Router.go("/" + page_type +"?page=" + final_page_num);
  },

  "keypress .page_num": function(event){
    if(event.which === 13){
      const text = $("input.page_num").val();
      const current_page = parseInt(Router.current().params.query.page);
      const page_type = Template.instance().data.pageType;
      const total_pages = Math.ceil(MetaData.findOne().total_count / MetaData.findOne()[page_type + "_per_page"]);
      var final_page_num;

      if(!/^-?\d+$/i.test(text)){
        $("input.page_num").val(current_page);
        final_page_num = current_page;
      } else if (parseInt(text) > total_pages){
        $("input.page_num").val(total_pages);
        final_page_num = total_pages;
      } else if(parseInt(text) <= 0){
        $("input.page_num").val(1);
        final_page_num = 1;
      } else {
        $("input.page_num").val(text);
        final_page_num = text;
      }

      if(final_page_num != current_page){//if it will stay on the same page, data won't be refreshed
        Template.instance().listDict.set("data_ready", false);
      }
      Router.go("/" + page_type +"?page=" + final_page_num);
    }
  },

  "click .js-next-page": function(){
    const current_page = parseInt(Router.current().params.query.page);
    const page_type = Template.instance().data.pageType;
    const total_pages = Math.ceil(MetaData.findOne().total_count / MetaData.findOne()[page_type + "_per_page"]);

    if(current_page + 1 <= total_pages){
      Template.instance().listDict.set("data_ready", false);
      Router.go("/" + page_type +"?page=" + (current_page + 1));
    }
  },

  "click .js-prev-page": function(){
    const current_page = parseInt(Router.current().params.query.page);
    const page_type = Template.instance().data.pageType;
    const total_pages = Math.ceil(MetaData.findOne().total_count / MetaData.findOne()[page_type + "_per_page"]);

    if(current_page - 1 >= 1){
      Template.instance().listDict.set("data_ready", false);
      Router.go("/" + page_type +"?page=" + (current_page - 1));
    }
  },
})
