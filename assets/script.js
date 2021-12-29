var cities=[];

var citySearchFormEl=document.querySelector('#city-search-form');
var cityInputEl=document.querySelector('#city');
var weatherContainerEl=document.querySelector('#current-weather-container');
var citySearchInputEL=document.querySelector('#searched-city');
var forecastTitle=document.querySelector('#forecast');
var forecastContainerEl=document.querySelector('#fiveday-container');
var pastSearchButtonEl=document.querySelector('#past-search-buttons');

var formSumbitHandler = function (event) {
    event.preventDefault();
    var city =cityInputEl.value.trim();
    if (city){
        getCityWeather(city);
        get3DayForecast(city);
        cities.unshift({city});
        cityInputEl.value ="";
    } else  {
        alert("Please enter a city");
    }
    saveSearch();
    searchHistory(city);
}

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
}

var getCityWeather = function(city){
   // console.log("weather api call");
    var apiKey = "6e66f544e0ed4dcdb02203527212812"
    var apiURL = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
}

var displayWeather = function(weather, searchCity){
    //clear old content
    weatherContainerEl.textContent= "";  
    citySearchInputEL.textContent=searchCity;

    console.log(weather);



var currentDate =document.createElement("span")
currentDate.textContent="(" + moment(weather.location.localtime.value).format("MMM D, YYYY") +")";
citySearchInputEL.appendChild(currentDate);


//Create icon/image element
var weatherIcon =document.createElement("img");
weatherIcon.classList = "list-group-item";
//console.log(dailyForecast.day.condition.icon)
weatherIcon.setAttribute("src", `https:${weather.current.condition.icon}`)
weatherIcon.setAttribute("alt", weather.current.condition.text)
citySearchInputEL.appendChild(weatherIcon);

//Create temp element
  var currentTemp =document.createElement("span");
  currentTemp.textContent ="Temp: " + weather.current.temp_f + "° F";
  currentTemp.classList = "list-group-item";
  weatherContainerEl.appendChild(currentTemp);

//Create Wind element
var currentWind =document.createElement("span");
currentWind.textContent ="Wind: " + weather.current.wind_mph +  " mph";
currentWind.classList = "list-group-item";
weatherContainerEl.appendChild(currentWind);

//Create Humidity element
var currentHum =document.createElement("span");
currentHum.textContent ="Humidity: " + weather.current.humidity + "%";
currentHum.classList = "list-group-item";
weatherContainerEl.appendChild(currentHum);

// Create UV index element
displayUvIndex(weather.current.uv)

};

var displayUvIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index

    if(index <=2){
        uvIndexValue.classList = "favorable"
    }else if(index >2 && index<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value >8){
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);

    //append index to current weather
    weatherContainerEl.appendChild(uvIndexEl);
}

var get3DayForecast = function (city){
    var apiKey = "6e66f544e0ed4dcdb02203527212812"
    var apiURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=no`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            display3DayForecast(data);
        });
    });
}

var display3DayForecast = function(weather){
    forecastContainerEl.textContent =""
  forecastTitle.textContent ="3-Day Forecast:";

  var forecastdata = weather.forecast.forecastday;
  //console.log(forecastdata.length);
  for(var i = 0; i < forecastdata.length; i=i+1){
      var dailyForecast = forecastdata[i];
      console.log(dailyForecast);

      var forecastEl=document.createElement("div");
      forecastEl.classList = "card bg-primary text-light m-2";


      //Create date element
      var forecastDate =document.createElement("h5");
      forecastDate.textContent=moment(dailyForecast.date).format("MMM D, YYYY");
      forecastDate.classList = "card-header text-center";
      forecastEl.appendChild(forecastDate);


      //Create icon/image element
      var weatherIcon =document.createElement("img");
      weatherIcon.classList = "card-header text-center";
      //console.log(dailyForecast.day.condition.icon)
      weatherIcon.setAttribute("src", `https:${dailyForecast.day.condition.icon}`)
      weatherIcon.setAttribute("alt", dailyForecast.day.condition.text)
      forecastEl.appendChild(weatherIcon);

      //Create temp element
      var forecastTemp =document.createElement("span");
      forecastTemp.textContent ="Temp: " + dailyForecast.day.avgtemp_f + "° F";  
      forecastTemp.classList = "card-header text-center";
      forecastEl.appendChild(forecastTemp);
      
      //Create Wind element
      var forecastWind =document.createElement("span");
      forecastWind.textContent ="Wind: " + dailyForecast.day.maxwind_mph + " mph";
      forecastWind.classList = "card-header text-center";
      forecastEl.appendChild(forecastWind);

      //Create Humidity element
      var forecastHum =document.createElement("span");
      forecastHum.textContent ="Humidity: " + dailyForecast.day.avghumidity + "%";
      forecastHum.classList = "card-header text-center";
      forecastEl.appendChild(forecastHum);
  
      //Create UV index element
      var forecastUv =document.createElement("span");
      forecastUv.textContent ="UV Index: " + dailyForecast.day.uv;
      forecastUv.classList = "card-header text-center";
      forecastEl.appendChild(forecastUv);

      forecastContainerEl.appendChild(forecastEl);

  }
}

var searchHistory = function (pastSearch){

    searchHistoryEl = document.createElement("button");
    searchHistoryEl.textContent = pastSearch;
    searchHistoryEl.classList ="d-flex w-100 btn-light border p-2";
    searchHistoryEl.setAttribute("data-city",pastSearch)
    searchHistoryEl.setAttribute("type", "sumbit");
    pastSearchButtonEl.prepend(searchHistoryEl);
}

var pastSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get3DayForecast(city);
    }
}

// pastSearch();

citySearchFormEl.addEventListener("submit", formSumbitHandler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);