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
*** weatherBit Current API URL ex) https://api.weatherbit.io/v2.0/current?city=Raleigh,NC&key=API_KEY
*** weatherBit Future API URL ex) https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=API_KEY&days=[integer]
** Pixabay API url ex) https://pixabay.com/api/?key=17163729-cdee9600c3a4a8f5a8abaad0e&q=yellow+flowers&image_type=photo&pretty=true

*/

// Default Image
const defaultImg = new Image();
defaultImg.src = Img; 

const placeHolderImg = defaultImg.src;

window.addEventListener('DOMContentLoaded', (event) => {
document.getElementById("img").innerHTML =`<img src="${placeHolderImg}" class="preview-img">`;
});


let finalData = {};

// 1. Get data

const getData = async (goeNameURL, futureWeatherURL, pixBayURL) => {
   
  const response = await fetch(goeNameURL);
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


const getDataSingle = async (url) => {
   
  const response = await fetch(url);

  try {
        const newData =  await response.json();
        const test = JSON.stringify(newData);
    console.log("singleData: " + test);
    return (newData);

  } catch(error) {
    console.log("error", error);
  }
}

// 2. Post data to App
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

   // const finalGeoURL = goeNameURL.replace("[CITY]", city).replace("[USERNAME]", geoNameUserName);  

   postData('http://localhost:8081/valuePostCountry', {city: city}) // add : cityValue -  "city" value is stored in cityValue
   .then( (data) => {
    return getDataSingle('http://localhost:8081/geonameGetCountry'); // add : cityValue - get response data with cityValue.city to retrieve country name 
   })
   .then( (data) => {
       postData('http://localhost:8081/countryPost', {countryName:data.geonames[0].countryName}); // get data from : countryValue - post country name data to countryPost to query country image from pixBay.
   })
   .then( () => {

    postData('http://localhost:8081/valuePost', {city: city, days: days});  // add : valuData
  })
   .then( (data) => {
    let d = JSON.stringify(data);
    let test = console.log("Coco: " + d);

    return getData('http://localhost:8081/geonames', 'http://localhost:8081/weatherbit', 'http://localhost:8081/pixabay'); // get data from : valuData
   })
	.then((data) => {

        console.log("POST test: " + data.data[0].weather.description);
        let test = JSON.stringify(data);
            
            console.log("country img?: " + test);

           let imgResult = ((data.hits[0] == null) ||  (typeof data.hits[0] == 'undefined')) ? placeHolderImg : data.hits[0].webformatURL;
          //  document.querySelector(".preview-img").setAttribute("src", imgResult);

          if ( (data.hits[0] != null) || ( typeof data.hits[0] != 'undefined')) {
            postData('http://localhost:8081/postTrip', {lng:data.geonames[0].lng, lat:data.geonames[0].lat, countryName:data.geonames[0].countryName, description:data.data[0].weather.description, temp:data.data[0].temp, city: city, days: days, img: data.hits[0].webformatURL});  // add : projectData
          } else {

              getData('http://localhost:8081/geonames', 'http://localhost:8081/weatherbit', 'http://localhost:8081/getCountry')
              .then ( (data) => {
                postData('http://localhost:8081/postTrip', {lng:data.geonames[0].lng, lat:data.geonames[0].lat, countryName:data.geonames[0].countryName, description:data.data[0].weather.description, temp:data.data[0].temp, city: city, days: days, img: data.hits[0].webformatURL});  // add : projectData
              }) 
          }
           
    })
    .then(() => updateUI());  // get data from: projetData

}

document.getElementById("remove").addEventListener("click", removeData);

function removeData(){
    document.querySelector(".preview-img").setAttribute("src", placeHolderImg);
	document.getElementById("entryHolder").innerHTML ='';
    postData('http://localhost:8081/postTrip', {});
}

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


