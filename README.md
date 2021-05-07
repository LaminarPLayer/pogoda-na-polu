# ![logo na polu](https://github.com/LaminarPLayer/pogoda-na-polu/blob/master/readme-resources/logo4.svg)
Pogoda na Polu to aplikacja pogodowa wykorzystująca API serwisu OpenWeatherMap oraz API Map Google w celu wyświetlania aktualnej prognozy pogody.

## Użyte języki i narzędzia 🔧
### HTML
Wykorzystano język HTML z jego wszystkimi dobrodziejstwami typu znaczniki semantyczne `header`, `section`, `footer`, także szereg meta tagów np. Open Graph pozwalających na dodanie podglądu linków do strony.

### CSS (SASS)
Do zaprojektowania strony użyto języka SASS interpretowanego docelowo do CSS-a. 😍

### Vanilla JavaScript
Choć stworzenie podobnej strony z wykorzystaniem bibliotek lub frameworków typu React, Vue ~~lub Angular~~ byłoby prawdopodobnie szybsze i prostsze, to ta strona pokazuje, że dla czystego JavaScriptu również nie ma ograniczeń. Wiele elementów strony jest jednak, podobnie jak w tych frameworkach renderowana przez JavaScript dopiero po pobraniu danych. 📲

### PWA
Strona została również przygotowana jako aplikacja PWA – dodano service-worker, wyświetlanie strony w trybie offline itp. Dzięki temu wszystkie kategorie w teście Lighthouse są ocenione „na zielono”. 🟢🟢🟢🟢🟢

### Back-end (API i Netlify Functions)
#### [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview) 🗺️
W celu pobierania danych geograficznych o wpisanym mieście oraz w celu pobrania nazwy miasta na podstawie lokalizacji urządzenia stosowane jest Google Maps JavaScript API. Klucz znajduje się w kodzie, ale jest zabezpieczony przed kradzieżą w konsoli Google Cloud przez ograniczenie jego działania do wykorzystywanej domeny. 😎
#### [OpenWeatherMap](https://openweathermap.org/api) 🌤️
Dane pogodowe pobierane są z serwisu [OpenWeatherMap](https://openweathermap.org/api). Na żądanie zawierające szerokość i długość geograficzną oraz klucz API otrzymywane są dane dla danejgo miejsca dotyczące aktualnej pogody, prognozy 60-minutowej, 48-godzinnej 🕐 oraz 8-dniowej. 📆
#### Netlify Functions
Aby klucz API do serwisu OpenWeatherMap nie dostał się w niepowołane ręce, jest przechowywany jako zmienna środowiskowa w serwisie [Netlify](https://www.netlify.com/) oraz wprowadzany do żądania przez Funkcję Netlify pośredniczącą między front-endem a API.

## Animowane ikony SVG ⛈️
Na potrzeby aplikacji utworzona została seria animowanych ikonek odpowiadających różnych warunkom pogodowym:

<img width="150" alt="Bezchmurnie w dzień" src="https://github.com/LaminarPLayer/pogoda-na-polu/blob/master/readme-resources/01d.svg">  <img width="150" alt="Bezchmurnie w nocy" src="https://github.com/LaminarPLayer/pogoda-na-polu/blob/master/readme-resources/01n.svg">  <img width="150" alt="Małe zachmurzenie w dzień" src="https://github.com/LaminarPLayer/pogoda-na-polu/blob/master/readme-resources/02d.svg">  <img width="150" alt="Małe zachmurzenie w nocy" src="https://github.com/LaminarPLayer/pogoda-na-polu/blob/master/readme-resources/02n.svg">

<img width="150" alt="Zachmurzenie" src="https://github.com/LaminarPLayer/pogoda-na-polu/blob/master/readme-resources/03d.svg"> <img width="150" alt="Duże zachmurzenie" src="https://github.com/LaminarPLayer/pogoda-na-polu/blob/master/readme-resources/04d.svg">  <img width="150" alt="Deszcz" style="transform: skew(-11deg)" src="https://github.com/LaminarPLayer/pogoda-na-polu/blob/master/readme-resources/09d.svg"> <img width="150" alt="Burza" style="transform: skew(-11deg)" src="https://github.com/LaminarPLayer/pogoda-na-polu/blob/master/readme-resources/11d.svg">

<img width="150" alt="Śnieg" src="https://github.com/LaminarPLayer/pogoda-na-polu/blob/master/readme-resources/13d.svg">  <img width="150" alt="Mgła itp." src="https://github.com/LaminarPLayer/pogoda-na-polu/blob/master/readme-resources/50d.svg">

Utworzono także ikony przy informacjach o ciśnieniu, godzinach wschodu i zachodu słońca oraz przy prędkości wiatru (zależne od jej wartości):

<img height="80" alt="Ciśnienie atmosferyczne" src="https://github.com/LaminarPLayer/pogoda-na-polu/blob/master/readme-resources/condition-pressure.svg"> <img height="80" alt="Wschód i zachód słońca" src="https://github.com/LaminarPLayer/pogoda-na-polu/blob/master/readme-resources/condition-sunrise-sunset.svg">

<img width="70" alt="Lekki wiatr" src="https://github.com/LaminarPLayer/pogoda-na-polu/blob/master/readme-resources/condition-wind-light.svg">
<img width="70" alt="Średni wiatr" src="https://github.com/LaminarPLayer/pogoda-na-polu/blob/master/readme-resources/condition-wind-moderate.svg">
<img width="70" alt="Mocny wiatr" src="https://github.com/LaminarPLayer/pogoda-na-polu/blob/master/readme-resources/condition-wind-strong.svg">

## A jaka jest pogoda na dworze?
Po wybraniu lokalizacji zakresu szerokości geograficznej od 50,65°N do 54,9°N oraz długości geograficznej od 14,12°E do 24,15°E, to na stronie zmienia się logo 🙃

<img width="150" alt="Logo na dworze" src="https://github.com/LaminarPLayer/pogoda-na-polu/blob/master/readme-resources/logo4-na-dworze.svg">
