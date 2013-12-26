var Pound   = require('pound');

var pound = Pound.create({
  publicDir:  '../public',
  staticUrlRoot: '/'
});
  
bundle  = pound.defineAsset;

bundle('home', {
  css:[
    '$css/app'  
  , '$css/bootstrap.min'
  , '$css/bootstrap-responsive.min'
  , '$css/font-awesome'
  ],

  // JS assets
  js:[
    '$js/jquery.min'  
  , '$js/bootstrap.min'
  ]
});

bundle({name:'app', extend:'home'}, {

  css:[
    '$css/app' 
  , '$css/bootstrap.min'
  , '$css/bootstrap-responsive.min'
  , '$css/font-awesome'
  ],

  js:[
      {'MyApp.env':{}} 
    , '$js/bootbox'
  ]
});

module.exports = pound;