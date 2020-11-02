let weatherDOM = {
    current: {
        clouds: document.querySelector('#current .clouds'),
        dew_point: null,
        dt: document.querySelector('#current .dt'),
        feels_like: document.querySelector('#current .feels_like'),
        humidity: document.querySelector('#current .humidity'),
        pressure: document.querySelector('#current .pressure'),
        sunrise: document.querySelector('#current .sunrise'),
        sunset: document.querySelector('#current .sunset'),
        temp: document.querySelector('#current .temp'),
        uvi: null,
        visibility: null,
        weather: [
            {
                description: document.querySelector('#current .description'),
                icon: document.querySelector('#current .icon img'),
                id: null,
                main: null
            }
        ],
        wind_icon: document.querySelector('#current .wind_icon'),
        wind_speed: document.querySelector('#current .wind_speed'),
    }
}
const background = document.querySelector("#background img");

// ZMIENNA Z DANYMI POGODOWYMI
let weather;

// MODALE
const modal = document.querySelector(".modal");
const modals = document.querySelectorAll('.modal>section');
const closeBtns = document.querySelectorAll('.modal .close-btn');
closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal)
});

// O MNIE
const aboutBtn = document.querySelector('#info');
aboutBtn.addEventListener('click', ()=>{
    debugger;
    openModal('about');
})

// USTAWIENIA STRONY
const settingsBtn = document.querySelector('#settings');
settingsBtn.addEventListener('click', () => {
    openModal('settings');
})

// USTAWIENIE MIASTA

const cityForm = document.querySelector("#city-form");
const cityInput = document.querySelector("#city-input");
const setCity = document.querySelector('#set-city');
const searchStatus = document.querySelector('#search-status')

const city = document.querySelector("#location");
const changeLoc = document.querySelector('#change-loc');
changeLoc.addEventListener('click', ()=>{
    openModal('set-weather');
})



// POBRANIE DANYCH
function initMap(){
    const geocoder = new google.maps.Geocoder();
    setCity.addEventListener("click", () => {
        updateCity(geocoder);
    });
    
    cityForm.addEventListener("submit", function(event){
        event.preventDefault();
        setCity.click();
    })

    function reverseGeo(lat, lng){
        latlng = {
            lat: lat,
            lng: lng
        };
        geocoder.geocode({location: latlng}, (results, status) => {
            if(status === "OK"){
                if(results[0]){
                    for(let result = 0; result < results.length; result++){
                        if(results[result].types[0] === "locality"){
                            console.log(results[result]);

                            let locationName = '';
                            for(let i=0; i<results[result].address_components.length;i++){
                                if (results[result].address_components[i].types[0] === "locality"){
                                    locationName=locationName.concat(results[result].address_components[i].long_name);
                                }
                                if (results[result].address_components[i].types[0] === "country"){
                                    locationName=locationName.concat(`, ${results[result].address_components[i].long_name}`);
                                }
                                lat = results[result].geometry.location.lat();
                                lon = results[result].geometry.location.lng();
                                city.textContent = locationName;
                                cityInput.value = locationName;
                            }
                            
                            setCity.click();
                            break;
                        }
                        else if(result + 1 === results.length){
                            console.log('coś poszło nie tak');
                        }
                    }
                }
                else{
                    console.log('no results found');
                }
            }
            else{
                console.log(`Geocoder failed due to: ${status}`);
            }
        });
    }

    // POBRANIE DANYCH O LOKALIZACJI
    const getPos = document.querySelector('#get-pos');

    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    function success(pos) {
        let crd = pos.coords;
        cityInput.value = `Pobrano współrzędne…`;
        reverseGeo(crd.latitude, crd.longitude);
    }
    function error(err) {
        searchStatus.style.display = '';
        searchStatus.textContent = `Nie można było pobrać współrzędnych.`;
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    getPos.addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition(success, error, options);
    })
}

function updateCity(geocoder){
    let lat;
    let lon;
    geocoder.geocode({address: cityInput.value}, (results, status)=>{
        if(status === "OK"){
            let locationName = '';
            let locSuccess = false;

            for(let i=0; i<results[0].address_components.length;i++){
                if (results[0].address_components[i].types[0] === "locality"){
                    locationName=locationName.concat(results[0].address_components[i].long_name);
                    locSuccess = true;
                }
                if (results[0].address_components[i].types[0] === "country"){
                    locationName=locationName.concat(`, ${results[0].address_components[i].long_name}`);
                }
                lat = results[0].geometry.location.lat();
                lon = results[0].geometry.location.lng();
            }
            if(locSuccess){
                city.textContent = locationName;
                searchStatus.style.display = 'none';
                fetchData(lat, lon);
            }
            else{
                searchStatus.style.display = '';
                searchStatus.textContent ="Nie znaleziono takiego miasta.";
            }
            
        }
        else{
            searchStatus.style.display = '';
            searchStatus.textContent ="Nie znaleziono takiego miejsca lub wystąpił błąd z wyszukiwaniem.";
        }
    });
}

function openModal(mode){
    modal.classList.remove('closed');
    for(let i = 0; i<modals.length; i++){
        if(modals[i].classList.contains(mode)){
            modals[i].classList.remove('closed');
        }
        else{
            modals[i].classList.add('closed');
        }
    }
    // żeby pozostałe były zamknięte…
}
function closeModal(){
    modal.classList.add("closed");
    for(let i = 0; i<modals.length; i++){
        modals[i].classList.add('closed');
    }
}

function fetchData(lat, lon){

    // POBIERANIE DANYCH
    // język i jednostki
    fetch(`/.netlify/functions/weather?lat=${lat}&lon=${lon}`)
        .then((data) => data.json())
        .then(jsonData => {
            console.log(jsonData);
            weather = jsonData;
            closeModal();
            updateData();
        })

        

    // RĘCZNE DANE
    // fetch(`sample.json`)
    //     .then((data) => data.json())
    //     .then(jsonData => {
    //         console.log(jsonData);
    //         weather = jsonData;
    //         closeModal();

    //         setTimeout(updateData, 500);
    //     })
}

function updateData(){
    updateCurrent();

    updateMinutely()
    updateHourly();
    updateDaily();
}

function updateCurrent(){
    let wDOMc = weatherDOM.current;
    let wc = weather.current;

    let miliseconds = new Date(wc.dt*1000);
    let currentTime = miliseconds.toLocaleString('pl', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
    miliseconds = new Date(wc.sunrise*1000);
    let sunriseTime = miliseconds.toLocaleTimeString('pl', {hour: 'numeric', minute:'2-digit'});
    miliseconds = new Date(wc.sunset*1000);
    let sunsetTime = miliseconds.toLocaleTimeString('pl', {hour: 'numeric', minute:'2-digit'});

    wDOMc.dt.textContent = `${currentTime}`;
    wDOMc.weather[0].description.textContent = `${wc.weather[0].description}`;
    wDOMc.temp.textContent         = `${Math.round(wc.temp)}°`;
    wDOMc.feels_like.textContent   = `${Math.round(wc.feels_like)}°`;
    wDOMc.pressure.textContent = `${wc.pressure} hPa`;
    wDOMc.humidity.textContent = `${wc.humidity}%`;
    wDOMc.clouds.textContent = `${wc.clouds}%`;
    wDOMc.wind_icon.style.transform=`scale(.8) rotate(${90+wc.wind_deg}deg)`;
    wDOMc.wind_speed.textContent = (`${Math.round(wc.wind_speed * 3.6)} km/h`).replace(/\./g, ',');
    wDOMc.sunrise.textContent = `${sunriseTime}`;
    wDOMc.sunset.textContent = `${sunsetTime}`;

    // change icon
    wDOMc.weather[0].icon.src = `icons/${wc.weather[0].icon}.svg`;

    if( wc.weather[0].icon === '09d'||
        wc.weather[0].icon === '09n'||
        wc.weather[0].icon === '10d'||
        wc.weather[0].icon === '10n'||
        wc.weather[0].icon === '11d'||
        wc.weather[0].icon === '11n'){
            wDOMc.weather[0].icon.classList.add("skew");
    }
    else if(wc.weather[0].icon === '13d'||
            wc.weather[0].icon === '13n'){
                wDOMc.weather[0].icon.classList.add("small");
    }
    else{
        wDOMc.weather[0].icon.classList.remove("skew");
        wDOMc.weather[0].icon.classList.remove("small");
    }

    // change photo
    background.src = `pictures/${wc.weather[0].icon}.jpg`;
    if( wc.weather[0].icon === '01d'||
        wc.weather[0].icon === '02n'){
        background.style.objectPosition = '28% center';
    }
    else if(wc.weather[0].icon === '04n'){
        background.style.objectPosition = '36% center';
    }
    else{
        background.style.objectPosition = 'center';
    }
}

function updateMinutely(){
    const minutelyForecast = document.querySelector(".forecast-section.minutely");
    const chart = document.querySelector(".forecast-section.minutely .chart svg");
    const description = document.querySelector(".forecast-section.minutely .opis");
    const quarterTimes = document.querySelectorAll(".forecast-section.minutely .time .hour");

    chart.textContent = '';

    let rain;
    if(weather.minutely[0].precipitation === 0){
        rain = false;
    }
    else{
        rain = true;
    }
    let change = false;
    const dateNow = new Date (weather.minutely[0].dt * 1000);

    let quarterCounter = 0;


    let line = `0,4`;
    
    for(let minute = 0; minute<weather.minutely.length; minute++){
        const date = new Date(weather.minutely[minute].dt * 1000);
        const time = date.toLocaleTimeString('pl', {hour: 'numeric', minute: '2-digit'});
        const precision = 100;
        const value = Math.round(Math.log(weather.minutely[minute].precipitation + 1) * precision) / precision; 
        
        line = line.concat(' ', `${minute},${4 - (value)}`);

        // DODANIE GODZIN POD WYKRESEM
        if(minute%15 === 0){
            quarterTimes[quarterCounter].textContent = time;
            quarterCounter++;
        }

        // SPRAWDZENIE CZY ZACZYNA SIĘ LUB KOŃCZY DESZCZ
        if(rain && !change && weather.minutely[minute].precipitation===0){
            description.innerHTML = `Opady skończą się za ok. <span>${odmianaMinuty((date - dateNow)/60000)}</span>.`;
            change = true;
        }
        else if(!rain && !change && weather.minutely[minute].precipitation !== 0){
            description.innerHTML = `Opady zaczną się za ok. <span>${odmianaMinuty((date - dateNow)/60000)}</span>.`;
            change = true;
        }
    }

    if(!change){
        if(rain){
            description.innerHTML = "<span>Opady</span> przynajmniej przez najbliższą godzinę."
        }
        else{
            description.innerHTML = "<span>Bez opadów</span> przynajmniej przez najbliższą godzinę."
        }
    }

    chart.insertAdjacentHTML('beforeend',
        `<polyline points="${line} 61,4" fill="#41DAEF" stroke="none"/>`
    )
}
function updateHourly(){
    const hourlyForecast = document.querySelector(".forecast-section.hourly");
    hourlyForecast.textContent = '';
    
    const dayNames = ['dzisiaj', 'jutro', 'pojutrze'];
    let day = 0;

    for(let hour = 0; hour < weather.hourly.length; hour++){
        const icon = weather.hourly[hour].weather[0].icon;
        const temp = Math.round(weather.hourly[hour].temp);
        const pop = Math.round(weather.hourly[hour].pop * 100);
        const time = new Date(weather.hourly[hour].dt*1000);
        const timeHour = time.toLocaleTimeString('pl', {hour: 'numeric', minute:'2-digit'});
        if(hour !== 0 && timeHour==="0:00"){
            day++;
        }
        const timeDay = dayNames[day];

        // WYBÓR KROPLI
        let droplet = `<img src="icons/daily-droplet-3.svg" alt="">`;
        if(pop===0){
            droplet = `<img src="icons/daily-droplet-0.svg" alt="">`;
        } else if(pop < 33){
            droplet = `<img src="icons/daily-droplet-1.svg" alt="">`;
        } else if(pop < 67){
            droplet = `<img src="icons/daily-droplet-2.svg" alt="">`;
        }

        // TRANSFORMACJA DESZCZU
        let iconMod = "";

        if( icon === '09d'||
            icon === '09n'||
            icon === '10d'||
            icon === '10n'||
            icon === '11d'||
            icon === '11n'){
                iconMod = 'skew';
        } else if(  icon === '13d'||
                    icon === '13n'){
                        iconMod = 'small';
        } else {
            iconMod = '';
        }

        // WPROWADZENIE DANYCH NA STRONĘ
        hourlyForecast.insertAdjacentHTML('beforeend',
            `<div class="hourly-column">
            <div class="hourly-icon">
                <img src="icons/${icon}.svg" alt="" class="${iconMod}">
            </div>
            <div class="hourly-temp">
                ${temp}°
            </div>
            <div class="hourly-precipitation">
                ${droplet}
                <span class="hourly-pop">${pop}%</span>
            </div>
            <div class="hourly-time">
                <div class="hourly-hour">${timeHour}</div>
                <div class="hourly-day">${timeDay}</div>
            </div>
        </div>`
        );
    }


}
function updateDaily(){
    const dailyForecast = document.querySelector(".forecast-section.daily .wrapper");

    dailyForecast.textContent = '';

    for(let day = 0; day < weather.daily.length; day++){
        const time = new Date(weather.daily[day].dt*1000);
        const weekday = (time.toLocaleDateString('pl', {weekday: 'short'})).replace(/\./g, '');
        const date = time.toLocaleDateString('pl', {day: 'numeric', month: 'numeric'});
        const icon = weather.daily[day].weather[0].icon;
        // const icon = '10n';
        const tempDay = Math.round(weather.daily[day].temp.day);
        const tempNight = Math.round(weather.daily[day].temp.night);
        const pop = Math.round(weather.daily[day].pop * 100);
        const windDeg = weather.daily[day].wind_deg;
        const windSpeed = Math.round(weather.daily[day].wind_speed*3.6);
        const pressure = weather.daily[day].pressure;
        
        // WYBÓR KROPLI
        let droplet = `<img src="icons/daily-droplet-3.svg" alt="">`;
        if(pop===0){
            droplet = `<img src="icons/daily-droplet-0.svg" alt="">`;
        } else if(pop < 33){
            droplet = `<img src="icons/daily-droplet-1.svg" alt="">`;
        } else if(pop < 67){
            droplet = `<img src="icons/daily-droplet-2.svg" alt="">`;
        }

        // TRANSFORMACJA DESZCZU
        let iconMod = "";

        if( icon === '09d'||
            icon === '09n'||
            icon === '10d'||
            icon === '10n'||
            icon === '11d'||
            icon === '11n'){
                iconMod = 'skew';
        } else if(  icon === '13d'||
                    icon === '13n'){
                        iconMod = 'small';
        } else {
            iconMod = '';
        }

        // WPROWADZENIE DANYCH NA STRONĘ
        dailyForecast.insertAdjacentHTML('beforeend',
            `<div class="daily-row">
                <div class="daily-time">
                    <div class="daily-weekday">${weekday}</div>
                    <div class="daily-date">${date}</div>
                </div>
                <div class="daily-icon"><img src="icons/${icon}.svg" alt="" class="${iconMod}"></div>
                <div class="daily-temp"   >
                    <span class="daily-temp-day">${tempDay}°</span>&nbsp/&nbsp<span class="daily-temp-night">${tempNight}°</span>
                </div>
                <div class="daily-precipitation">
                    ${droplet}
                    <span class="daily-pop">${pop}%</span>
                </div>
                <div class="daily-wind">
                    <img src="icons/daily-wind.svg" alt="" style="transform: rotate(${90+windDeg}deg)">
                    <span class="daily-wind-speed">${windSpeed} km/h</span>
                </div>
                <div class="daily-pressure">
                    ${pressure} hPa
                </div>
            </div>`
        );
    }
}

function odmianaMinuty(minNum){
    if (minNum === 1){
        return `minutę`;
    }
    else if (minNum % 100 > 10 && minNum % 100 < 15){
        return `${minNum} minut`;
    }
    else if (minNum % 10 > 1 && minNum % 10 < 5){
        return `${minNum} minuty`;
    }
    else{
        return `${minNum} minut`;
    }
}

// // ręczna pogoda :D
// setTimeout(()=>{
//     weather.current.weather[0].icon='09n';
//     updateData();
// }, 350)