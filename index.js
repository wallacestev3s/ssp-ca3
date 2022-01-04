const http = require('http'), // this module provides the HTTP server
      path = require('path'), // allows us to work with files and directory paths
      express = require('express'),// allow the the app to respond to http requests
      fs =require('fs'), // this module allow us to work with the file system
      xmlParse = require('xslt-processor').xmlParse,// wors with xml files
      xsltProcess = require('xslt-processor').xsltProcess,// this module utilize XSl transformations,
      xml2js = require('xml2js');// this module does xml to JSON conversion

const router = express(),     //creating an instance through express
      server = http.createServer(router);// This instance allow the server to be serving the requests

 router.get('/', function(req,res){
        res.writeHead(200,{'Content-Type' : 'text/html'});
        // 200 means that our page exist.

      let xml = fs.readFileSync('WallyForge.xml','utf8'),
          xsl = fs.readFileSync('WallyForge.xsl','utf8');
      let doc = xmlParse(xml),
            stylesheet = xmlParse(xsl);
      let result = xsltProcess(doc,stylesheet);      

      res.end(result.toString());
 });
//


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function()
{
    const addr = server.address();
    console.log("Server listening at", addr.address +":" + addr.port)
});