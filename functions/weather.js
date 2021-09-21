require('isomorphic-fetch')

exports.handler = async (event, context) => {
    const lat = event.queryStringParameters.lat || "noLat";
    const lon = event.queryStringParameters.lon || "noLon";
    const apiKey = process.env.API_KEY;

    let weatherData;

    let response = await fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&&lang=pl`);
    let data = await response.json();
    weatherData = await data;

    return{
        statusCode: 200,
        body: JSON.stringify(weatherData)
    }
}