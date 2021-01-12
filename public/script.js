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
modal.addEventListener('click', function(e){
    if(e.currentTarget === e.target){
        closeModal();
    }
});

// O MNIE
const aboutBtn = document.querySelector('#info');
aboutBtn.addEventListener('click', ()=>{
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
const searchStatus = document.querySelector('#search-status');

// Ustawienie logo
const logoImg = document.querySelector('#logo img');

// pasek ładowania
const loadBar = document.querySelector('#load-bar');

const city = document.querySelector("#location");
const changeLoc = document.querySelector('#change-loc');
changeLoc.addEventListener('click', ()=>{
    openModal('set-weather');
})

// DRAG TO SCROLL
const hourlyForecast = document.querySelector(".forecast-section.hourly");
let hourlyScroll = { top: 0, left: 0, x: 0, y: 0 };
const mouseDownHandler = function(e) {
    // Change the cursor and prevent user from selecting the text
    hourlyForecast.style.cursor = 'grabbing';
    hourlyForecast.style.userSelect = 'none';
    hourlyScroll = {
        // The current scroll 
        left: hourlyForecast.scrollLeft,
        top: hourlyForecast.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};
const mouseMoveHandler = function(e) {
    // How far the mouse has been moved
    const dx = e.clientX - hourlyScroll.x;
    const dy = e.clientY - hourlyScroll.y;

    // Scroll the element
    hourlyForecast.scrollLeft = hourlyScroll.left - dx;
    hourlyForecast.scrollTop = hourlyScroll.top - dy;
};
const mouseUpHandler = function() {
    hourlyForecast.style.cursor = 'grab';
    hourlyForecast.style.removeProperty('user-select');

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
};
hourlyForecast.addEventListener('mousedown', mouseDownHandler);

// POBRANIE DANYCH
function initMap(){
    const geocoder = new google.maps.Geocoder();
    setCity.addEventListener("click", () => {
        loadBar.classList.add('loading');
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
        loadBar.classList.remove('loading');
    }
    getPos.addEventListener('click', () => {
        loadBar.classList.add('loading');
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

            // TESTOWANKO
            console.log(results);

            for(let i=0; i<results[0].address_components.length;i++){
                for(let iComponent=0; iComponent<results[0].address_components[i].types.length; iComponent++){
                    if (results[0].address_components[i].types[iComponent] === "locality"){
                        locationName=locationName.concat(results[0].address_components[i].long_name);
                        locSuccess = true;
                    }
                }
                if (results[0].address_components[i].types[0] === "country"){
                    locationName=locationName.concat(`, ${results[0].address_components[i].long_name}`);
                }
                lat = results[0].geometry.location.lat();
                lon = results[0].geometry.location.lng();

                // zapisanie do pamięci nazwy miasta i współrzędnych
                changeLoc.textContent = "ZMIEŃ LOKALIZACJĘ";
                localStorage.setItem('lastCity', locationName);
                localStorage.setItem('lastLat', lat);
                localStorage.setItem('lastLon', lon);

                // USUNIĘCIE POCZĄTKOWEGO MIGANIA PRZYSIKU WYBORU LOKALIZACJI
                alreadyVisited();

            }
            if(locSuccess){
                city.textContent = locationName;
                searchStatus.style.display = 'none';
                fetchData(lat, lon);
            }
            else{
                searchStatus.style.display = '';
                searchStatus.textContent ="Nie znaleziono takiego miasta.";
                loadBar.classList.remove('loading');
            }
            
        }
        else{
            searchStatus.style.display = '';
            searchStatus.textContent ="Nie znaleziono takiego miejsca lub wystąpił błąd z wyszukiwaniem.";
            loadBar.classList.remove('loading');
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

    // z CSS Tricks:
    const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}`;
}

function closeModal(){
    modal.classList.add("closed");
    for(let i = 0; i<modals.length; i++){
        modals[i].classList.add('closed');
    }

    // z CSS Tricks
    const body = document.body;
    const scrollY = body.style.top;
    body.style.position = '';
    body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
}

window.addEventListener('scroll', () => {
    document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
});


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
        .catch((error) => {
            console.error('Error:', error);
            loadBar.classList.remove('loading');
        });

        
    // RĘCZNE DANE
    // fetch(`sample.json`)
    //     .then((data) => data.json())
    //     .then(jsonData => {
    //         console.log(jsonData);
    //         weather = jsonData;
    //         closeModal();

    //         setTimeout(updateData, 500);
    //     })

    // ZMIANA LOGO - EASTER EGG
    if (lat>50.65 && lat<54.9 && lon>14.12 && lon<24.15) {
        logoImg.src = 'logo4-na-dworze.svg';
    }
    else{
        logoImg.src = 'logo4.svg';
    }
}

// FUNKCJA USTAWIAJĄCA OSTATNIĄ LOKALIZACJĘ
window.onload = function setLastLocation() {
    if(localStorage.getItem('lastCity') && localStorage.getItem('lastLat') && localStorage.getItem('lastLon') ){
        cityInput.value = localStorage.getItem('lastCity');
        setCity.click();
    }
    else{
        firstVisit();
    }
}
function firstVisit() {
    document.body.classList.add('first-visit');
}
function alreadyVisited() {
    document.body.classList.remove('first-visit');
}

function updateData(){
    updateCurrent();

    const minutelyTitle = document.querySelector(".minutely-title");
    const minutelyForecast = document.querySelector(".forecast-section.minutely");
    if(weather.minutely){
        minutelyTitle.style.display = "block";
        minutelyForecast.style.display = "flex";
        updateMinutely();
    }
    else{
        minutelyTitle.style.display = "none";
        minutelyForecast.style.display = "none";
    }
    updateHourly();
    updateDaily();

    loadBar.classList.remove('loading');
}

function updateCurrent(){
    let wDOMc = weatherDOM.current;
    let wc = weather.current;

    let miliseconds = new Date(wc.dt*1000);
    let currentTime = miliseconds.toLocaleString('pl', {
        hour: 'numeric',
        minute: '2-digit',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZoneName: 'short'
    });
    miliseconds = new Date(wc.sunrise*1000);
    miliseconds = locTime(miliseconds,weather.timezone_offset);
    let sunriseTime = miliseconds.toLocaleTimeString('pl', {hour: 'numeric', minute:'2-digit'});
    miliseconds = new Date(wc.sunset*1000);
    miliseconds = locTime(miliseconds,weather.timezone_offset);
    let sunsetTime = miliseconds.toLocaleTimeString('pl', {hour: 'numeric', minute:'2-digit'});

    wDOMc.dt.textContent = `Dane z: ${currentTime}`;
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

    // change wind icon
    if(wc.wind_speed * 3.6 < 9.5){
        weatherDOM.current.wind_icon.src='icons/condition-wind-light.svg';
    }
    else if(wc.wind_speed * 3.6 < 24.5){
        weatherDOM.current.wind_icon.src='icons/condition-wind-moderate.svg';
    }
    else{
        weatherDOM.current.wind_icon.src='icons/condition-wind-strong.svg';
    }

    // change photo
    background.src = `pictures/${wc.weather[0].icon}.jpg`;
    if( wc.weather[0].icon === '01d'){
        background.style.objectPosition = '28% center';
        background.style.filter="blur(.0625rem) brightness(.33)"
    }    
    else if(wc.weather[0].icon === '01n'){
        background.style.objectPosition = 'center';
        background.style.filter="blur(.0625rem) brightness(.67)"
    }
    else if(wc.weather[0].icon === '02n'){
        background.style.objectPosition = 'left center';
        background.style.filter="blur(.0625rem) brightness(.67)"
    }
    else if(wc.weather[0].icon === '04n'){
        background.style.objectPosition = '36% center';
        background.style.filter="blur(.0625rem) brightness(.25)"
    }
    else if(wc.weather[0].icon === '09d' ||
            wc.weather[0].icon === '10d'){
        background.style.objectPosition = '56% center';
        background.style.filter="blur(.0625rem) brightness(.33)"
    }
    else if(wc.weather[0].icon === '09n' ||
            wc.weather[0].icon === '10n'){
        background.style.objectPosition = '56% center';
        background.style.filter="blur(.0625rem) brightness(.5)"
    }
    else if(wc.weather[0].icon === '11d'){
        background.style.objectPosition = 'center';
        background.style.filter="blur(.0625rem) brightness(0.25) contrast(1.08)"
    }
    else if(wc.weather[0].icon === '11n'){
        background.style.objectPosition = 'center 75%';
        background.style.filter="blur(.0625rem) brightness(0.33) contrast(1.08)"
    }
    else if(wc.weather[0].icon === '13d'){
        background.style.objectPosition = 'center 33%';
        background.style.filter="blur(.0625rem) brightness(.25)"
    }
    else if(wc.weather[0].icon === '13n'){
        background.style.objectPosition = 'center 42%';
        background.style.filter="blur(.0625rem) brightness(.33)"
    }
    else{
        background.style.objectPosition = 'center';
        background.style.filter="blur(.0625rem) brightness(.33)"
    }
    // change mobile Chrome bar
    colorCodes = JSON.parse(`{
        "01d": "#0A1D2E",
        "01n": "#0B090D",
        "02d": "#14100C",
        "02n": "#0A111A",
        "03d": "#444b4c",
        "03n": "#090f13",
        "04d": "#14252b",
        "04n": "#140912",
        "09d": "#262b2e",
        "09n": "#0e1112",
        "10d": "#262b2e",
        "10n": "#0e1112",
        "11d": "#141313",
        "11n": "#110D17",
        "13d": "#1F1E1E",
        "13n": "#081014",
        "50d": "#151710",
        "50n": "#0f1011"
    }`);
    document.querySelector('meta[name="theme-color"]').setAttribute("content", colorCodes[wc.weather[0].icon]);
}

function updateMinutely(){
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
    let dateNow = new Date (weather.minutely[0].dt * 1000);
    dateNow = locTime(dateNow,weather.timezone_offset);

    let quarterCounter = 0;


    let line = `0,4`;
    
    for(let minute = 0; minute<weather.minutely.length; minute++){
        
        let date = new Date(weather.minutely[minute].dt * 1000);
        date = locTime(date,weather.timezone_offset);
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
            description.innerHTML = `Opady skończą się za <span>${odmianaMinuty((date - dateNow)/60000)}</span>.`;
            change = true;
        }
        else if(!rain && !change && weather.minutely[minute].precipitation !== 0){
            description.innerHTML = `Opady zaczną się za <span>${odmianaMinuty((date - dateNow)/60000)}</span>.`;
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
        `<polyline points="${line} 60,4" fill="#41DAEF" stroke="none"/>`
    )
}
function updateHourly(){
    
    hourlyForecast.textContent = '';
    
    const dayNames = ['dzisiaj', 'jutro', 'pojutrze'];
    let day = 0;
    let nightClass;

    for(let hour = 0; hour < weather.hourly.length; hour++){
        const icon = weather.hourly[hour].weather[0].icon;
        const temp = Math.round(weather.hourly[hour].temp);
        const pop = Math.round(weather.hourly[hour].pop * 100);
        let time = new Date(weather.hourly[hour].dt*1000);
        time = locTime(time,weather.timezone_offset);
        const timeHour = time.toLocaleTimeString('pl', {hour: 'numeric', minute:'2-digit'});
        if(hour !== 0 && timeHour==="0:00"){
            day++;
        }
        const timeDay = dayNames[day];

        // WYBÓR KROPLI
        let droplet = `<img src="icons/daily-droplet-3.svg" alt="" draggable="false">`;
        if(pop===0){
            droplet = `<img src="icons/daily-droplet-0.svg" alt="" draggable="false">`;
        } else if(pop < 33){
            droplet = `<img src="icons/daily-droplet-1.svg" alt="" draggable="false">`;
        } else if(pop < 67){
            droplet = `<img src="icons/daily-droplet-2.svg" alt="" draggable="false">`;
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

        // CZY MAMY DZIEŃ, CZY NOC
        if(icon.includes("d")){
            nightClass='';
        }
        else{
            nightClass=' night';
        }

        // WPROWADZENIE DANYCH NA STRONĘ
        hourlyForecast.insertAdjacentHTML('beforeend',
            `<div class="hourly-column${nightClass}">
                <div class="hourly-icon">
                    <img src="icons/${icon}.svg" alt="" class="${iconMod}" draggable="false">
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
        let time = new Date(weather.daily[day].dt*1000);
        // time = locTime(time,weather.timezone_offset);
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
        let dailyWindIcon;
        
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

        // ustawienie ikonki wiatru
        if(windSpeed < 9.5){
            dailyWindIcon='icons/daily-wind-light.svg';
        }
        else if(windSpeed < 24.5){
            dailyWindIcon='icons/daily-wind-moderate.svg';
        }
        else{
            dailyWindIcon='icons/daily-wind-strong.svg';
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
                    <img src="${dailyWindIcon}" alt="" style="transform: rotate(${90+windDeg}deg)">
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

function locTime(date, timezone_offset){
    // console.log(date);
    // console.log(date.getTimezoneOffset());
    // console.log(timezone_offset);

    date.setMinutes(date.getMinutes()+date.getTimezoneOffset())
    // console.log(date)
    
    date.setSeconds(date.getSeconds()+timezone_offset);
    // console.log(date);

    return date;
}