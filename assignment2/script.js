// JavaScript logic for fetching weather data
const apiKey = "b4ef87fc37c01f79754946b1846a616b";
const logBox = document.getElementById("log");
function log(message){
    console.log(message);
    logBox.innerHTML += message + "\n";
}

log("App Started");
loadHistory();
async function getWeather(){
    const city = document.getElementById("cityInput").value;
    if(city === ""){
        alert("Please enter a city name");
        return;
    }
    log("Start Fetching");
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        log("Fetch Response Received");
        const data = await response.json();
        if(data.cod != 200){
            throw new Error(data.message);
        }
        displayWeather(data);
        saveHistory(city);
    }
    catch(error){
        document.getElementById("weatherResult").innerHTML =
        "<p style='color:red'>City not found</p>";
        log("Error: " + error.message);
    }
    log("End Fetching");
}

function displayWeather(data){
    document.getElementById("weatherResult").innerHTML =
    `City: ${data.name}<br>
     Temperature: ${data.main.temp} °C<br>
     Weather: ${data.weather[0].main}<br>
     Humidity: ${data.main.humidity}%<br>
     Wind Speed: ${data.wind.speed} m/s`;
}

function saveHistory(city){
    let history = JSON.parse(localStorage.getItem("cities")) || [];
    if(!history.includes(city)){
        history.push(city);
        localStorage.setItem("cities", JSON.stringify(history));
    }
    loadHistory();
}

function loadHistory(){
    let history = JSON.parse(localStorage.getItem("cities")) || [];
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "";
    history.forEach(city => {
        const btn = document.createElement("button");
        btn.innerText = city;
        btn.onclick = function(){
            document.getElementById("cityInput").value = city;
            getWeather();
        };
        historyDiv.appendChild(btn);
    });
}
