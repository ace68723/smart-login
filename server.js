var express = require('express');
var faker = require('faker');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

//test token
var jwtSecret = 'sdfaklqmsdfjk125125/dsf/asd';

//test user data
var user = {
	username:"aiden",
	password:"aiden123"
}

var smartJwt = express();

smartJwt.use(cors());
smartJwt.use(bodyParser.json());
smartJwt.use(expressJwt({ secret: jwtSecret }).unless({ path:['/login']}));

smartJwt.get('/random-data',function(req, res) {
	
	var headers = req.headers;
	var authorizationSplit = headers.authorization.split(" ", 2);
	var token = authorizationSplit[1]
	// console.log(token)
	 

	jwt.verify(token, jwtSecret, function(err, decoded) {
	  console.log(decoded) 
	});

	var user = faker.Helpers.userCard();
	user.avatar = faker.Image.avatar();

	res.json(user);

})

smartJwt.post('/login', authenticate, function(req, res) {
	
	//encode the data by jwtSecret which defind in line 8
	var token = jwt.sign({
					username: user.username
				},jwtSecret)
	
	res.send({
		token: token,
		username: user.username
	})

})

smartJwt.listen(3000, function() {
	console.log("smartJwt listening on 3000")
})

//authenticate function
function authenticate (req,res,next) {

	var body = req.body;

	if (!body.username || !body.password) {
		res.status(400).end("Must have username or password");
	}

	if(body.username !== user.username || body.password !== user.password){
		res.status(401).end("Username or password incorrect")

	}

	//pass authenticate
	next();


}