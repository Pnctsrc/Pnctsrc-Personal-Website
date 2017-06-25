Template.posts.helpers({
  "post_list": function(){
    return Posts.find({},{
      sort:{
        createdAt: -1
      }
    }).fetch();
  },

  "getTime": function(date){
    return $.timeago(date);
  },
})

Template.posts.events({
  "click #post_title": function(event){
    const post_id = event.currentTarget.attributes[2].nodeValue
    Router.go("/posts/view/" + post_id);
  },
})
