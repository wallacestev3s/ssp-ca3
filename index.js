const http = require('http'), // this module provides the HTTP server
      path = require('path'), // allows us to work with files and directory paths
      express = require('express'),// allow the the app to respond to http requests
      fs =require('fs'), // this module allow us to work with the file system
      xmlParse = require('xslt-processor').xmlParse,// wors with xml files
      xsltProcess = require('xslt-processor').xsltProcess,// this module utilize XSl transformations,
      xml2js = require('xml2js');// this module does xml to JSON conversion

const router = express(),     //creating an instance through express
      server = http.createServer(router);// This instance allow the server to be serving the requests

router.use(express.static(path.resolve(__dirname,'views')));
router.use(express.urlencoded({extended: true})); //We allow the data sent from the client to be encoded in a URL targeting our end point
router.use(express.json()); //We include support for JSON

//static content from views folder

function XMLtoJSON(filename, cb) {
    var filepath = path.normalize(path.join(__dirname, filename));
    fs.readFile(filepath, 'utf8', function(err, xmlStr) {
      if (err) throw (err);
      xml2js.parseString(xmlStr, {}, cb);
    });
};
  
  //Function to convert JSON to XML and save it
function JSONtoXML(filename, obj, cb) {
    var filepath = path.normalize(path.join(__dirname, filename));
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    fs.unlinkSync(filepath);
    fs.writeFile(filepath, xml, cb);
};


 router.get('/get/html', function(req,res){
        res.writeHead(200,{'Content-Type' : 'text/html'});
        // 200 means that our page exist.

      let xml = fs.readFileSync('WallyForge.xml','utf8'),
          xsl = fs.readFileSync('WallyForge.xsl','utf8');

          console.log(xml);
          console.log(xsl);    

      let doc = xmlParse(xml),
            stylesheet = xmlParse(xsl);
      let result = xsltProcess(doc,stylesheet); 
      console.log(result);     

      res.end(result.toString());
 });
//

router.post('/post/json', function (req, res) {

      function appendJSON(obj) {
  
          console.log(obj)
  
          XMLtoJSON('WallyForge.xml', function (err, result) {
              if (err) throw (err);
              
              result.menu.section[obj.sec_n].entry.push({'item': obj.item, 'price': obj.price});
  
              console.log(JSON.stringify(result, null, "  "));
  
              JSONtoXML('WallyForge.xml', result, function(err){
                  if (err) console.log(err);
              });
          });
      };
  
      appendJSON(req.body);
  
      res.redirect('back');
  
  });

  router.post('/post/delete', function (req, res) {

      function deleteJSON(obj) {
  
          console.log(obj)
  
          XMLtoJSON('WallyForge.xml', function (err, result) {
              if (err) throw (err);
              
              delete result.menu.section[obj.section].entry[obj.entree];
  
              console.log(JSON.stringify(result, null, "  "));
  
              JSONtoXML('WallyForge.xml', result, function(err){
                  if (err) console.log(err);
              });
          });
      };
  
      deleteJSON(req.body);
  
      res.redirect('back');
  
  });



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function()
{
    const addr = server.address();
    console.log("Server listening at", addr.address +":" + addr.port)
});