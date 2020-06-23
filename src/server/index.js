const dotenv = require('dotenv');
dotenv.config();

// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
const request = require('request');

// Start up an instance of app
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
})

/* Middleware*/
const bodyParser = require('body-parser');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server

const port = 8081;

const server = app.listen(port, listening);

function listening() {
	console.log("server running");
	console.log(`running on localhose: ${port}`);
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
app.get("/geonames", (req, res) => {
  const url = goeNameUrl.replace("[CITY]", valueData.city); 
  console.log(url);
  request({ url: url }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(500).json({ type: "error", message: error });
    }
    res.json(JSON.parse(body));
  });
});

app.get("/weatherbit", (req, res) => {
  const url = futureWeatherURL.replace("[CITY]", valueData.city).replace("[KEY]", weatherApiKey).replace("[DAYS]", valueData.days);
  console.log(url);
  request({ url: url }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(500).json({ type: "error", message: error });
    }
    res.json(JSON.parse(body));
  });
});

app.get("/pixabay", (req, res) => {
  const url = pixBayURL.replace("[CITY]", valueData.city).replace("[KEY]", pixabayApiKey);
  console.log("pixabay url: " + url);
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
  console.log("server post allData: " + projectData);
  console.log("server post allData JSON: " + test);
};


valueData = {};

// POST
app.post('/valuePost', getValues);

function getValues(req,res){
  const test1 = JSON.stringify(req.body);
    console.log("getTrip1: " + test1);
    newEntry = {
      city: req.body.city,
      days: req.body.days
    }
    valueData = newEntry;
    res.send(valueData);

    const test = JSON.stringify(valueData);

    console.log("server post: " + test);
}

app.post('/postTrip', postTrip);

function postTrip(req,res){
  const test1 = JSON.stringify(req.body);
    console.log("getTrip1: " + test1);
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

    console.log("server post2: " + test);
}



