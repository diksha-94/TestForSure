var express = require('express');
var app = express();



//app.use(express.static('WebContent'));
app.use(express.static(__dirname + '/WebContent')); 
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));

app.get('/getenv',function(req,res){
		
		var servicesIp = process.env.SERVICES_IP;
		
		var details = servicesIp;
		res.send(details);

} );


var port = 8084;
var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})