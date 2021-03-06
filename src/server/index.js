const dotenv = require('dotenv');
dotenv.config();

// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
var path = require('path')
const express = require('express');
const mockAPIResponse = require('./mockAPI.js')
const request = require('request');

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require('body-parser');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// Setup Server

const port = 8888;

const server = app.listen(port, listening);

function listening() {
	console.log("server running");
	console.log(`running on localhost: ${port}`);
}




// POST route - add a POST route that adds incoming data to projectData
/*
The POST route should anticipate receiving three pieces of data from the request body
1. temperature
2. date
3. user response

Make sure your POST route is setup to add each of these values with a key to projectData
*/

const geoNameUserName = process.env.USERNAME;
const goeNameUrl = "http://api.geonames.org/searchJSON?q=[CITY]&maxRows=1&username=haydenlee22";
// ex) http://api.geonames.org/searchJSON?q=Atlanta&maxRows=1&username=haydenlee22

const weatherApiKey = process.env.Weather_API_KEY;
const futureWeatherURL = "https://api.weatherbit.io/v2.0/forecast/daily?city=[CITY]&key=[KEY]&days=[DAYS]";
const currentWeatherURL = "https://api.weatherbit.io/v2.0/current?city=[CITY]&key=[KEY]";

const pixabayApiKey = process.env.PixaBay_API_KEY;
const pixBayURL = "https://pixabay.com/api/?key=[KEY]&q=[CITY]&image_type=photo&pretty=true&category=places";


// GET Routs
app.get("/geonameGetCountry", (req, res) => {
  const url = goeNameUrl.replace("[CITY]", cityValue.city);  // get response data with cityValue.city  to retrieve country name  
  console.log("geonameGetCountry!!: " + url);
  request({ url: url }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(500).json({ type: "error", message: error });
    }
    res.json(JSON.parse(body));
  });
});

app.get("/getCountry", (req, res) => {
  const url = pixBayURL.replace("[CITY]", countryValue.countryName).replace("[KEY]", pixabayApiKey);
 // console.log("countryValue url: " + url);
  request({ url: url }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(500).json({ type: "error", message: error });
    }
    res.json(JSON.parse(body));
  });
});


app.get("/geonames", (req, res) => {
  const url = goeNameUrl.replace("[CITY]", valueData.city); 
  //console.log(url);
  request({ url: url }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(500).json({ type: "error", message: error });
    }
    res.json(JSON.parse(body));
  });
});

app.get("/weatherbit", (req, res) => {
  const url = futureWeatherURL.replace("[CITY]", valueData.city).replace("[KEY]", weatherApiKey).replace("[DAYS]", valueData.days);
  //console.log(url);
  request({ url: url }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(500).json({ type: "error", message: error });
    }
    res.json(JSON.parse(body));
  });
});

app.get("/pixabay", (req, res) => {
  const url = pixBayURL.replace("[CITY]", valueData.city).replace("[KEY]", pixabayApiKey);
 // console.log("pixabay url: " + url);
  request({ url: url }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(500).json({ type: "error", message: error });
    }
    res.json(JSON.parse(body));
  });
});


app.get('/all', getData);

function getData (request, response) {
  response.send(projectData);
  const test = JSON.stringify(projectData);
  console.log("server post allData: " + test);
  //console.log("server post allData JSON: " + test);
};


valueData = {};

// POST
app.post('/valuePost', getValues);

function getValues(req,res){
  const test1 = JSON.stringify(req.body);
    //console.log("getTrip1: " + test1);
    newEntry = {
      city: req.body.city,
      days: req.body.days,
      countryImg: req.body.countryImg
    }
    valueData = newEntry;
    res.send(valueData);

    const test = JSON.stringify(valueData);

    console.log("got countrImg: " + test);
}




cityValue = {};  // Get country data from geoNames

app.post('/valuePostCountry', getValues2);

function getValues2(req,res){
  const test1 = JSON.stringify(req.body);
   // console.log("getTrip2: " + test1);
    newEntry = {
      city: req.body.city
    }
    cityValue = newEntry;
    res.send(cityValue); // "city" value is stored in cityValue

    const test = JSON.stringify(cityValue);  

    //console.log("valuePostCountry: " + test);
}


countryValue = {};
app.post('/countryPost', getCountry);

function getCountry(req,res){
  const test1 = JSON.stringify(req.body);
    newEntry = {
      countryName:req.body.countryName
    }
    countryValue = newEntry;
    res.send(countryValue); // stored country name to countryValue

    const test = JSON.stringify(countryValue);  

    console.log("countryPost countryName: " + test);
}



app.post('/postTrip', postTrip);

function postTrip(req,res){
  const test1 = JSON.stringify(req.body);
    //console.log("getTrip1: " + test1);
    newEntry = {
      lng: req.body.lng,
      lat: req.body.lat,
      countryName: req.body.countryName,
      description: req.body.description,
      temp: req.body.temp,
      city: req.body.city,
      days: req.body.days,
      img: req.body.img
    }
    projectData = newEntry;
    res.send(projectData);

    const test = JSON.stringify(projectData);

    //console.log("server post2: " + test);
}



