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
  } else if (_.indexOf(["jpg", "jepg", "png"], fileType) === -1){
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
    if(hasErr){
      context.response.setHeader('Content-Type', 'application/json');
    } else {
      context.response.setHeader('Content-Type', 'image/' + fileType.replace("e", ""));
    }
    context.response.statusCode = statusCode;
    context.response.end(data);
  }
}, {
  where: 'server'
});
