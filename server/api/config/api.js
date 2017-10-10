API = {
  authentication: function(apiKey){
    return apiKey === Meteor.settings.PNCTSRC_ACCESS_KEY;
  },
  connection: function(request){
    var getRequestContents = API.utility.getRequestContents(request),
        apiKey = getRequestContents.api_key,
        validUser = API.authentication(apiKey);

    if(validUser){
      delete getRequestContents.api_key;
      return {
        data: getRequestContents
      }
    } else {
      return {
        error: 401,
        message: "Invalid access key."
      }
    }
  },
  handleRequest: function(context, resource, method){
    var connection = API.connection(context.request);
    if(!connection.error){
      API.methods[resource][method](context, connection);
    } else {
      API.utility.response(context, 401, connection);
    }
  },
  methods: {
    search: {
      GET: function(context, connection){
        const keyword = connection.data.keyword.replace(/[^a-z0-9]/gi, "\\$&");

        if(keyword.match(/^ *$/gi)){
          API.utility.sendError(context, 400, "Invalid keyword");
          return;
        }

        const search_regex = new RegExp(keyword, "gi");
        const post_title_array = Posts.find({title: {$regex: search_regex}}, {fields: {title: 1, description: 1}}).fetch();
        const work_title_array = Works.find({title: {$regex: search_regex}}, {fields: {title: 1, description: 1}}).fetch();
        const result = {
          post_result: post_title_array,
          work_result: work_title_array
        };

        API.utility.response(context, 200, result);
      },
      POST: function(context, connection){},
      PUT: function(context, connection){},
      DELETE: function(context, connection){}
    },
    images: {
      GET: function(context, connection){
        const fileName = connection.data.fileName;

        //validate type
        const fileType = fileName.substring(fileName.lastIndexOf(".") + 1);

        if(!fileName.match(/\./)){
          API.utility.responseIMG(context, 400, {
            error: 400,
            message: "Invalid file name."
          }, true)
        } else if (_.indexOf(Meteor.settings.ALLOWED_IMAGE_TYPE, fileType) === -1){
          API.utility.responseIMG(context, 400, {
            error: 400,
            message: "Invalid file type."
          }, true)
        } else {
          //check if the image exists
          const fs = require("fs");
          if(fs.existsSync(Meteor.settings.IMAGE_PATH + fileName)){
            const data = fs.readFileSync(Meteor.settings.IMAGE_PATH + fileName);
            API.utility.responseIMG(context, 200, data, false, fileType);
          } else {
            API.utility.responseIMG(context, 404, {
              error: 404,
              message: "No such image."
            }, true)
          }
        }
      },
      POST: function(context, connection){
        var Busboy = require('busboy');
        var path = require('path');
        var fs = require('fs');
        var busboy = new Busboy({headers: context.request.headers});

        var final_filename;
        var ifError = false;//true if any error happens later
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
          const fileExtension = mimetype.substring(6).replace("e", "");

          //validate the file
          var file_size = 0;
          file.on('data', function(data){
            file_size += data.length;
            if(ifError) return;

            if(file_size > 10485760){
              API.utility.sendError(context, 400, "Image size larger than 10MB.");
              ifError = true;
            }
          })

          if(_.indexOf(Meteor.settings.ALLOWED_IMAGE_TYPE, fileExtension) === -1){
            API.utility.sendError(context, 400, "Image type not allowed.");
            ifError = true;
          }

          final_filename = (new Date()).getTime() + "." + fileExtension;
          var saveTo = Meteor.settings.IMAGE_PATH + final_filename;

          if(ifError) {
            if(fs.existsSync(saveTo)){
              fs.unlinkSync(saveTo);
            }
            return;
          }

          file.pipe(fs.createWriteStream(saveTo));
        });

        busboy.on('finish', function() {
          if(ifError) return;

          API.utility.response(context, 200, {link: "/resources/images/" + final_filename});
        });

        context.request.pipe(busboy);
      },
      PUT: function(context, connection){},
      DELETE: function(context, connection){
        var fs = require('fs');
        const fileName = connection.data.src.substring(connection.data.src.lastIndexOf('/') + 1);
        const path = Meteor.settings.IMAGE_PATH + fileName;

        //check if the file exists
        if(fs.existsSync(path)){
          fs.unlinkSync(path);
          API.utility.response(context, 200, {message: "Success."});
        } else {
          API.utility.sendError(context, 404, "No such Image");
        }
      }
    },
    files: {
      GET: function(context, connection){
        const fileName = connection.data.fileName;

        //validate type
        const fileType = fileName.substring(fileName.lastIndexOf(".") + 1);

        if(!fileName.match(/\./)){
          API.utility.responseFILE(context, 400, {
            error: 400,
            message: "Invalid file name."
          }, true)
        } else if (_.indexOf(Meteor.settings.ALLOWED_FILE_TYPE, fileType) === -1){
          API.utility.responseFILE(context, 400, {
            error: 400,
            message: "Invalid file type."
          }, true)
        } else {
          //check if the image exists
          const fs = require("fs");
          if(fs.existsSync(Meteor.settings.FILE_PATH + fileName)){
            const data = fs.readFileSync(Meteor.settings.FILE_PATH + fileName);
            if(fileType === "pdf"){
              API.utility.responsePDF(context, 200, data);
            } else if(fileType === "mp3" || fileType === "mp4"){
              var stat = fs.statSync(Meteor.settings.FILE_PATH + fileName);
              API.utility.responseMEDIA(context, 200, data, fileType, stat.size);
            } else {
              API.utility.responseFILE(context, 200, data, false);
            }
          } else {
            API.utility.responseFILE(context, 404, {
              error: 404,
              message: "No such file."
            }, true)
          }
        }
      },
      POST: function(context, connection){
        var Busboy = require('busboy');
        var path = require('path');
        var fs = require('fs');
        var busboy = new Busboy({headers: context.request.headers});

        var final_filename;
        var ifError = false;//true if any error happens later
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
          //validate the file
          if(!filename.match(/\./)){
            API.utility.sendError(context, 400, "Invalid file name.");
            ifError = true;
          } else {
            var regex_string = "(";
            for(var type of Meteor.settings.ALLOWED_FILE_TYPE){
              regex_string += type + "|";
            }
            regex_string = regex_string.substring(0, regex_string.length - 1) + ")";
            var type_regex = new RegExp(regex_string);
            if(!filename.substring(filename.lastIndexOf(".") + 1).match(type_regex)){
              API.utility.sendError(context, 400, "File type not allowed.");
              ifError = true;
            }
          }

          var saveTo = Meteor.settings.FILE_PATH + filename;
          if(fs.existsSync(saveTo)){
            API.utility.sendError(context, 400, "File already exists.");
            ifError = true;
          }

          var file_size = 0;
          file.on('data', function(data){
            file_size += data.length;

            if(file_size > 10485760){
              API.utility.sendError(context, 400, "File size larger than 10MB.");
              ifError = true;
            }
          })

          if(ifError) return;

          file.pipe(fs.createWriteStream(saveTo));
          final_filename = filename;
        });

        busboy.on('finish', function() {
          if(ifError) return;

          API.utility.response(context, 200, {link: "/resources/files/" + final_filename});
        });

        context.request.pipe(busboy);
      },
      PUT: function(context, connection){},
      DELETE: function(context, connection){
        var fs = require('fs');
        const fileName = connection.data.filename;
        const path = Meteor.settings.FILE_PATH + fileName;

        //check if the file exists
        if(fs.existsSync(path)){
          fs.unlinkSync(path);
          API.utility.response(context, 200, {message: "Success."});
        } else {
          API.utility.sendError(context, 404, "No such file.");
        }
      }
    }
  },
  resources: {},
  utility: {
    getRequestContents: function(request){
      switch (request.method){
        case "GET":
        case "POST":
          return request.query;
        case "PUT":
        case "DELETE":
          return request.body;
      }
    },
    hasData: function(data){
      return Object.keys(data).length > 0 ? true : false;
    },
    response: function(context, statusCode, data){
      context.response.setHeader('Content-Type', 'application/json');
      context.response.statusCode = statusCode;
      context.response.end(JSON.stringify(data));
    },
    validate: function(data, pattern){
      return Match.test(data, pattern);
    },
    sendError: function(context, statusCode, message){
      API.utility.response(context, statusCode, {
        error: 400,
        message: message
      });
    },
    responseIMG: function(context, statusCode, data, hasErr, fileType){
      context.response.statusCode = statusCode;

      if(hasErr){
        context.response.setHeader('Content-Type', 'application/json');
        context.response.end(JSON.stringify(data));
      } else {
        context.response.setHeader('Content-Type', 'image/' + fileType.replace("e", ""));
        context.response.end(data);
      }
    },
    responseFILE: function(context, statusCode, data, hasErr){
      context.response.statusCode = statusCode;

      if(hasErr){
        context.response.setHeader('Content-Type', 'application/json');
        context.response.end(JSON.stringify(data));
      } else {
        context.response.setHeader('Content-Type', 'application/octet-stream');
        context.response.end(data);
      }
    },
    responsePDF: function(context, statusCode, data){
      context.response.statusCode = statusCode;
      context.response.setHeader('Content-Type', 'application/pdf');
      context.response.end(data);
    },
    responseMEDIA: function(context, statusCode, data, fileType, size){
      context.response.statusCode = statusCode;
      context.response.setHeader('Content-Length', size);
      context.response.setHeader('Accept-Ranges', 'bytes');

      if(fileType === "mp4"){
        context.response.setHeader('Content-Type', 'video/mp4');
      } else if(fileType === "mp3"){
        context.response.setHeader('Content-Type', 'audio/mp3');
      }
      context.response.end(data);
    },
  }
};
