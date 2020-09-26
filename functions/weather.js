require('isomorphic-fetch')

exports.handler = async (event, context) => {
    const lat = event.queryStringParameters.lat || "noLat";
    const lon = event.queryStringParameters.lon || "noLon";
    const apiKey = process.env.OWM_API_KEY;

    let weatherData = {coś: 'to ja'};

    // fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    //     .then(resp => resp.json())
    //     .then(resp => {
    //         console.log(resp);
    //         weatherData = resp;
    //     })
    //     .catch((err) => {
    //         weatherData = {error: `${err} — Couldn\'t fetch the data. :(`}
    //     })


    let response = await fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    let data = await response.json();
    weatherData = await data;

    return{
        statusCode: 200,
        body: JSON.stringify(weatherData)
    }
}

// exports.handler = async (event, context) => {
//     try {
//         //   const subject = event.queryStringParameters.name || "World"
//         //   return { statusCode: 200, body: JSON.stringify({ msg: `Hello ${subject}` }) }

//         const lat = event.queryStringParameters.lat || "noLat";
//         const lon = event.queryStringParameters.lon || "noLon";
//         const apiKey = process.env.OWM_API_KEY;

//         let weatherData = {coś: 'to ja'};

//         fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
//             .then(resp => resp.json())
//             .then(resp => {
//                 console.log(resp);
//                 weatherData = resp;
//             })
//             .catch((err) => {
//                 weatherData = {error: `${err} — Couldn\'t fetch the data. :(`}
//             })

//         return{
//             statusCode: 200,
//             body: JSON.stringify(weatherData)
//         }
//     }
//     catch (err) {
//         return { statusCode: 500, body: err.toString() }
//     }
// }