Router.route('/api/v1/file', function(){
  this.response.setHeader('Access-Control-Allow-Origin', '*');

  if (this.request.method === "OPTIONS"){
    this.response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    this.response.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
    this.response.end('Set OPTIONS.');
  } else {
    API.handleRequest(this, 'files', this.request.method);
  }
}, {
  where: 'server'
});


Router.route('/resources/files/:filename', function(){
  this.response.setHeader('Access-Control-Allow-Origin', '*');

  if (this.request.method === "OPTIONS"){
    this.response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    this.response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    this.response.end('Set OPTIONS.');
  } else {
    this.request.query.fileName = this.params.filename;
    this.request.query.api_key = Meteor.settings.PNCTSRC_ACCESS_KEY;
    API.handleRequest(this, 'files', this.request.method);
  }
}, {
  where: 'server'
});
