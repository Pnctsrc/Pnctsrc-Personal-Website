Template.about.onCreated(function(){
  this.aboutDict = new ReactiveDict();
  this.aboutDict.set("data_ready", false);

  const aboutDict = this.aboutDict;
  if(this.data){//if editing
    const access_key = this.data.authDict.get("access_key");
    
    Meteor.call("authenticate", access_key, function(err, result){
      if(err){
        Router.go("/about");
        window.alert(err);
        return;
      }

      //get about page content
      Meteor.call("get_about", function(err, data){
        if(err){
          window.alert(err);
          return;
        }

        aboutDict.set("about_object", data);

        setTimeout(function () {
          $('.froala-editor').froalaEditor({
            imageUploadURL: '/api/v1/pic?api_key=' + encodeURIComponent(access_key),
            fileUploadURL: '/api/v1/file?api_key=' + encodeURIComponent(access_key),
            codeMirror: true,
            codeMirrorOptions: {
              indentWithTabs: true,
              lineNumbers: true,
              lineWrapping: true,
              mode: 'text/html',
              tabMode: 'indent',
              tabSize: 4
            },
            tabSpaces: 4,
          })

          aboutDict.set("isEditing", true);
          aboutDict.set("data_ready", true);
        }, 300);


      })
    })
  } else {
    Meteor.call("get_about", function(err, data){
      if(err){
        window.alert(err);
        return;
      }

      aboutDict.set("about_object", data);
      aboutDict.set("data_ready", true);
    })
  }
})

Template.about.helpers({
  "dataNotReady": function(){
    return !Template.instance().aboutDict.get("data_ready");
  },

  "aboutDict": function(){
    return Template.instance().aboutDict;
  },

  "about": function(){
    return Template.instance().aboutDict.get("about_object");
  },

  "isEditing": function(){
    return Template.instance().aboutDict.get("isEditing");
  },
})

Template.about.events({
  "click #about_submit": function(){
    $("#about_submit").attr("class", "ui right floated blue loading disabled button");
    const HTML_content = $('.froala-editor').froalaEditor('html.get', true);
    const aboutDict = Template.instance().aboutDict;

    Meteor.call("update_about", HTML_content, Template.instance().data.authDict.get("access_key"), function(err, result){
      if(err){
        window.alert(err);
        $("#about_submit").attr("class", "ui right floated blue button");
        return;
      }

      //retrieve new data
      aboutDict.set("about_object");
      aboutDict.set("data_ready", false);
      Router.go("/about");
    })
  },
})
