import Img from '../images/default.jpg';

export {
    Img
}


/* Global Variables */

/*
<Input Fields>
1. City
2. Date - What type of input should it be? What about cross browser rendering?

<Output Fields>

geoName:  latitude, longitude, country

1. City & Country
2. The trip to ** is ** days away.
3. Typical weather for then is:
4. High - 46, Low - 35
6. Mostly Cloudy throughout the day.

* Replace the openweather api with geonames api.
* The weather data array was named differently, what do we need to change the name to?
* The weather data only had 1 object in the array, the geoname api outputs multiple objects. How do we call the first object?


*** geneName API Url ex): http://api.geonames.org/searchJSON?q=cities&maxRows=1&username=haydenlee22

{
  "totalResultsCount": 140,
  "geonames": [
    {
      "adminCode1": "TN",
      "lng": "-82.40709",
      "geonameId": 4663236,
      "toponymName": "Tri-Cities Regional TN/VA Airport",
      "countryId": "6252001",
      "fcl": "S",
      "population": 0,
      "countryCode": "US",
      "name": "Tri-Cities Regional TN/VA Airport",
      "fclName": "spot, building, farm",
      "adminCodes1": {
        "ISO3166_2": "TN"
      },
      "countryName": "United States",
      "fcodeName": "airport",
      "adminName1": "Tennessee",
      "lat": "36.48069",
      "fcode": "AIRP"
    }
  ]
}

*** weatherBit Current API URL ex) https://api.weatherbit.io/v2.0/current?city=Raleigh,NC&key=API_KEY
{
  "data": [
    {
      "weather": {
        "icon": "c02d",
        "code": 801,
        "description": "Few clouds"
      },
      "wind_dir": 191,
      "max_dhi": null,
      "clouds_hi": 0,
      "precip": 0,
      "low_temp": 21.3,
      "max_temp": 32.9,
      "moonset_ts": 1592880486,
      "datetime": "2020-06-22",
      "temp": 28.1,
      "min_temp": 21.3,
      "clouds_mid": 1,
      "clouds_low": 10
    }
  ],
  "city_name": "Raleigh",
  "lon": "-78.63861",
  "timezone": "America/New_York",
  "lat": "35.7721",
  "country_code": "US",
  "state_code": "NC"
}

*** weatherBit Future API URL ex) https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=API_KEY&days=[integer]

{
  "data": [
    {
      "high_temp": 32.9,
      "app_min_temp": 22.2,
      "wind_spd": 3.34532,
      "pop": 0,
      "wind_cdir_full": "south",
      "slp": 1014.02,
      "moon_phase_lunation": 0.06,
      "valid_date": "2020-06-22",
      "app_max_temp": 35.7,
      "vis": 20.6857,
      "dewpt": 21.1,
      "snow": 0,
      "uv": 10.8022,
      "weather": {
        "icon": "c02d",
        "code": 801,
        "description": "Few clouds"
      },
      "wind_dir": 191,
      "max_dhi": null,
      "clouds_hi": 0,
      "precip": 0,
      "low_temp": 21.3,
      "max_temp": 32.9,
      "datetime": "2020-06-22",
      "temp": 28.1,
      "min_temp": 21.3,
      "clouds_mid": 1,
      "clouds_low": 10
    }
  ],
  "city_name": "Raleigh",
  "lon": "-78.63861",
  "timezone": "America/New_York",
  "lat": "35.7721",
  "country_code": "US",
  "state_code": "NC"
}

** Pixabay API url ex) https://pixabay.com/api/?key=17163729-cdee9600c3a4a8f5a8abaad0e&q=yellow+flowers&image_type=photo&pretty=true

*/
const geoNameUserName = process.env.USERNAME;
const goeNameUrl = "http://api.geonames.org/searchJSON?q=[CITY]&maxRows=1&username=[USERNAME]";
// ex) http://api.geonames.org/searchJSON?q=Atlanta&maxRows=1&username=haydenlee22

const weatherApiKey = process.env.Weather_API_KEY;
const futureWeatherURL = "https://api.weatherbit.io/v2.0/forecast/daily?city=[CITY]&key=[KEY]&days=[DAYS]";
const currentWeatherURL = "https://api.weatherbit.io/v2.0/current?city=[CITY]&key=[KEY]";

const pixabayApiKey = process.env.PixaBay_API_KEY;
const pixBayURL = "https://pixabay.com/api/?key=[KEY]&q=[CITY]&image_type=photo&pretty=true&category=places";


// Default Image
const defaultImg = new Image();
defaultImg.src = Img; 

const placeHolderImg = defaultImg.src;

window.addEventListener('DOMContentLoaded', (event) => {
document.getElementById("img").innerHTML =`<img src="${placeHolderImg}" class="preview-img">`;
});

// 1. Get data from geoName.
const getData = async (goeNameUrl, futureWeatherURL, pixBayURL) => {
   
    const response = await fetch(goeNameUrl);
    const response2 = await fetch(futureWeatherURL);
    const response3 = await fetch(pixBayURL);

	try {
        const newData =  await response.json();
        const newData2 =  await response2.json();
        const newData3 =  await response3.json();
        const totalData = {...newData, ...newData2, ...newData3 }

        const test = JSON.stringify(totalData);
		console.log("pixBayData: " + test);
		console.log("url: " + pixBayURL);
		return (totalData);

	} catch(error) {
		console.log("error", error);
	}
}

// 2. Post geoName data to App
const postData = async ( url= '', data = {}) => {
    const response = await fetch(url, {
        method: "POST",
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        console.log("postData2: " + newData);
        return newData;
    } catch (error) {
        console.log("error", error);
    }
}


// Create an event listener for the element with the id: save, with a callback function to execute when it is clicked.

document.getElementById("save").addEventListener("click", performAction);

function performAction(e) {
	let city = document.getElementById('city').value;
    let travelDate = document.getElementById('date').value;

    const days = dateDifference(travelDate);

    const finalGeoURL = goeNameUrl.replace("[CITY]", city).replace("[USERNAME]", geoNameUserName);  

    // 3. Integrate the Weatherbit API
    const futureURL = futureWeatherURL.replace("[CITY]", city).replace("[KEY]", weatherApiKey).replace("[DAYS]", days);
    const currentURL = currentWeatherURL.replace("[CITY]", city).replace("[KEY]", weatherApiKey);

    // Integrate with pixabay
    const imgURL = pixBayURL.replace("[CITY]", city).replace("[KEY]", pixabayApiKey);
  
   // getData(finalGeoURL, futureURL, imgURL)

   
   postData('http://localhost:8081/getInfo', {city: city, days: days, lng:"", lat:"", countryName:"", description:"", temp:"", img: ""})
   .then( () => {
    getData('http://localhost:8081/geonames', 'http://localhost:8081/weatherbit', 'http://localhost:8081/pixabay');
   })
	.then(function(data) {
        let test = JSON.stringify(data);
            console.log("test: " + data.geonames[0].lng);

        let imgResult = ((data.hits[0] == null) ||  (typeof data.hits[0] == 'undefined')) ? placeHolderImg : data.hits[0].webformatURL;

            postData('http://localhost:8081/getTrip', {lng:data.geonames[0].lng, lat:data.geonames[0].lat, countryName:data.geonames[0].countryName, description:data.data[0].weather.description, temp:data.data[0].temp, city: city, days: days, img: imgResult});
    })
    .then(() => updateUI());


}

document.getElementById("remove").addEventListener("click", removeData);

function removeData(){
    document.querySelector(".preview-img").setAttribute("src", placeHolderImg);
	document.getElementById("entryHolder").innerHTML ='';
    postData('http://localhost:8081/getTrip', {});
}
/*
const clearData = async (url= '', data = {}) => {
    return fetch(url, {
        method: "DELETE",
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(res => res.json());
};
*/


function dateDifference(travelDate) {
     // Create a new date instance dynamically with JS
     let d = new Date();
     var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
     let currentDate = months[d.getMonth()]+' '+ d.getDate()+', '+ d.getFullYear();
 
     const date1 = new Date(currentDate);
     const date2 = new Date(travelDate);
     const timeDDifference = Math.abs(date2 - date1);
     const days = Math.ceil(timeDDifference / (1000 * 60 * 60 * 24)); 

     console.log("current Date: "+ currentDate +  "travelDate: "+ travelDate+  "Days: "+ days);

     return days;   
}



const updateUI = async () => {
	const request = await fetch('http://localhost:8081/all');

	try {
		const allData = await request.json();

	//	const updateUI = JSON.stringify(allData);

        //let count = allData.length - 1;
        
        /*
            newEntry = {
                lng: req.body.lng,
                lat: req.body.lat,
                countryName: req.body.countryName,
                description: req.body.description,
                temp: req.body.temp
            }
        */

       document.querySelector(".preview-img").setAttribute("src", allData.img);
		document.getElementById("entryHolder").innerHTML =`<p class="overview">${allData.city}, ${allData.countryName} is ${allData.days} days away.</p>
		
		<p class="overview">Typical weather for then is:</p>
        <p class="overview">Temperature: ${allData.temp}.</p>
        <p>${allData.description}°.</p>
		
		</div>`

	} catch (error) {
		console.log("error", error);

	}
}

