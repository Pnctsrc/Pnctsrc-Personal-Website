Template.summernote.onCreated(function(){
  this.editorDict = this.data.editorDict;
})

Template.summernote.helpers({
  "dataReady": function(){
    return Template.instance().editorDict.get("data_object");
  },
  "editorDict": function(){
    return Template.instance().editorDict;
  }
})

Template.summernote_editor.onCreated(function(){
  this.editorDict = this.data.editorDict;

  //attach sticky toolbar listener
  $(window).scroll(function(){
    const page_top = $(window).scrollTop();
    const editor_top = $(".note-editor")[0].offsetTop;
    const toolbar_top = editor_top - page_top;
    const $toolbar = $(".note-toolbar");
    const $editor = $(".note-editor");
    const $editing_area = $(".note-editing-area");

    if(toolbar_top <= 0){
      const editor_width = $editor.width();
      $toolbar.css("position", "fixed");
      $toolbar.css("top", "0");
      $toolbar.css("width", editor_width);
      $toolbar.css("z-index", 1);
      $editing_area.css("z-index", 0);
    } else {
      $toolbar.css("position", "");
      $toolbar.css("top", "");
      $toolbar.css("width", "");
      $toolbar.css("z-index", "");
      $editing_area.css("z-index", "");
    }
  })

  $(window).resize(function(){
    const page_top = $(window).scrollTop();
    const editor_top = $(".note-editor")[0].offsetTop;
    const toolbar_top = editor_top - page_top;

    if(toolbar_top <= 0){
      const $editor = $(".note-editor");
      const $toolbar = $(".note-toolbar");
      const editor_width = $editor.width();
      $toolbar.css("width", editor_width);
    }
  })
})

Template.summernote_editor.onRendered(function(){
  //initialize page elements
  const self = this;
  setTimeout(function () {
    $('#summernote').summernote({
      callbacks: {
        onImageUpload: function(files) {
          // upload image to server and create imgNode...
          data = new FormData();
          data.append("file", files[0]);
          $.ajax({
            data: data,
            type: "POST",
            url: "/api/v1/pic?api_key=" + encodeURIComponent(access_key),
            cache: false,
            contentType: false,
            processData: false,
            success: function(url) {
              $('#summernote').summernote('insertImage', url.link);
            },
            error: function(err){
              const error = err.responseJSON;
              window.alert(error.message + "[" + error.error + "]");
            }
          });
        },
        onMediaDelete: function($img){
          $.ajax({
            type: "DELETE",
            url: "/api/v1/pic",
            data: {
              src: $img[0].src,
              api_key: access_key
            },
            dataType: "application/json"
          });
        }
      }
    });

    $(".note-popover").appendTo(".summernote_popover_wrapper");
    self.editorDict.set("data_ready", true);//shows content after the initialization is finished
  }, 300);
})
