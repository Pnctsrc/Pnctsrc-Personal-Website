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
    pic: {
      GET: function(context, connection){},
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

            if(file_size > 10485760){
              API.utility.sendError(context, 400, "Image size larger than 10MB.");
              ifError = true;
            }
          })

          if(_.indexOf(["jpg", "jpeg", "png"], fileExtension) === -1){
            API.utility.sendError(context, 400, "Image type not allowed.");
            ifError = true;
          }

          if(ifError) return;

          final_filename = (new Date()).getTime() + "." + fileExtension;
          var saveTo = Meteor.settings.IMAGE_PATH + final_filename;

          file.pipe(fs.createWriteStream(saveTo));
        });

        busboy.on('finish', function() {
          if(ifError) return;

          API.utility.response(context, 200, {link: "http://localhost:3000/resources/images/" + final_filename});
        });

        context.request.pipe(busboy);
      },
      PUT: function(context, connection){},
      DELETE: function(context, connection){}
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
    }
  }
};
