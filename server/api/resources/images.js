Router.route('/resources/images/:filename', function(){
  const fileName = this.params.filename;
  //validate type
  const fileType = fileName.substring(fileName.lastIndexOf(".") + 1);
  var hasErr = false;

  if(!fileName.match(/\./)){
    hasErr = true;
    response(this, 400, {
      error: 400,
      message: "Invalid file name."
    })
  } else if (_.indexOf(["jpg", "jpeg", "png"], fileType) === -1){
    hasErr = true;
    response(this, 400, {
      error: 400,
      message: "Invalid file type."
    })
  } else {
    //check if the image exists
    const fs = require("fs");
    if(fs.existsSync(Meteor.settings.IMAGE_PATH + fileName)){
      const data = fs.readFileSync(Meteor.settings.IMAGE_PATH + fileName);
      response(this, 200, data);
    } else {
      hasErr = true;
      response(this, 404, {
        error: 404,
        message: "No such image."
      })
    }
  }

  function response(context, statusCode, data){
    context.response.statusCode = statusCode;

    if(hasErr){
      context.response.setHeader('Content-Type', 'application/json');
      context.response.end(JSON.stringify(data));
    } else {
      context.response.setHeader('Content-Type', 'image/' + fileType.replace("e", ""));
      context.response.end(data);
    }
  }
}, {
  where: 'server'
});
