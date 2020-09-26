const message = document.getElementById("message")

let lat = 52.23333;
let lon = 21.01667;

document.querySelector("#button").addEventListener("click", () => {
    fetch(`/.netlify/functions/weather?lat=${lat}&lon=${lon}`)
        .then((data) => data.json())
        // .then(({ msg }) => console.log(msg) || (message.innerHTML = msg))
        .then(meinSchatz => console.log(meinSchatz))
})