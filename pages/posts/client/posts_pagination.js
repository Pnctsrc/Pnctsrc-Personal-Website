Template.posts_pagination.helpers({
  "getPageNum": function(){
    return Router.current().params.page_num;
  },
})

Template.posts_pagination.events({
  "change .page_num": function(){
    const text = $("input.page_num").val();
    const current_page = parseInt(Router.current().params.page_num);
    const total_pages = Math.ceil(MetaData.findOne().total_count / MetaData.findOne().posts_per_page);
    var final_page_num;

    if(!/^\d+$/i.test(text)){
      $("input.page_num").val(current_page);
      final_page_num = current_page;
    } else if (parseInt(text) > total_pages){
      $("input.page_num").val(total_pages);
      final_page_num = total_pages;
    } else {
      $("input.page_num").val(text);
      final_page_num = text;
    }

    Router.go("/posts/" + final_page_num);
  },

  "keypress .page_num": function(event){
    if(event.which === 13){
      const text = $("input.page_num").val();
      const current_page = parseInt(Router.current().params.page_num);
      const total_pages = Math.ceil(MetaData.findOne().total_count / MetaData.findOne().posts_per_page);
      var final_page_num;

      if(!/^\d+$/i.test(text)){
        $("input.page_num").val(current_page);
        final_page_num = current_page;
      } else if (parseInt(text) > total_pages){
        $("input.page_num").val(total_pages);
        final_page_num = total_pages;
      } else {
        $("input.page_num").val(text);
        final_page_num = text;
      }

      Router.go("/posts/" + final_page_num);
    }
  },

  "click .js-next-page": function(){
    const current_page = parseInt(Router.current().params.page_num);
    const total_pages = Math.ceil(MetaData.findOne().total_count / MetaData.findOne().posts_per_page);

    if(current_page + 1 <= total_pages){
      Router.go("/posts/" + (current_page + 1));
    }
  },

  "click .js-prev-page": function(){
    const current_page = parseInt(Router.current().params.page_num);
    const total_pages = Math.ceil(MetaData.findOne().total_count / MetaData.findOne().posts_per_page);

    if(current_page - 1 >= 1){
      Router.go("/posts/" + (current_page - 1));
    }
  },
})
