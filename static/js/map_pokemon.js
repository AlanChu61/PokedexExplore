'use strict';
const sfBayCoords = {
    lat: 37.601773,
    lng: -122.20287,
};

function capturePokemon(evt) {
    const name = evt.target.parentElement.children[1].innerHTML.split(":")[1];
    const nickname = prompt("Please enter a nickname for your pokemon", name);
    const level = evt.target.parentElement.children[2].innerHTML.split(":")[1]
    const [lat, lng] = evt.target.parentElement.children[2].innerHTML.split(":");
    const kind_id = evt.target.parentElement.children[0].innerHTML.split(":")[1]
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            nickname: nickname,
            level: level,
            kind_id: kind_id,
            lat: lat, lng: lng
        })
    };
    fetch('/capture_pokemon', requestOptions)
        .then((response) => response.json())
        .then((data) => {
            alert(data.status);
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function calCommuteTime(evt) {
    const locationString = evt.target.parentElement.children[3].innerHTML;
    const regex = /lat:([-+]?\d+(?:\.\d+)?), lng:([-+]?\d+(?:\.\d+)?)/;
    const matches = locationString.match(regex);
    let pokeLat;
    let pokeLng;
    if (matches && matches.length === 3) {
        pokeLat = parseFloat(matches[1]);
        pokeLng = parseFloat(matches[2]);
    } else {
        console.log("Invalid location string");
    }
    let userLocation = new google.maps.LatLng(sfBayCoords.lat, sfBayCoords.lng);
    let pokeLocation = new google.maps.LatLng(pokeLat, pokeLng);
    let request = {
        origin: userLocation,
        destination: pokeLocation,
        travelMode: 'DRIVING'
    };
    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();
    directionsService.route(request, function (response, status) {
        if (status === 'OK') {
            const commuteTime = response.routes[0].legs[0].duration.text;
            const commuteDiv = document.getElementById('calCommuteTime');
            commuteDiv.innerHTML = "<div>Here shows run time info:</div>";
            const commuteDetail = document.createElement('div');
            commuteDetail.innerHTML = `<p>Commute Time: ${commuteTime}by ${request.travelMode}</p> `;
            commuteDiv.appendChild(commuteDetail);
            console.log(response)

            directionsRenderer.setMap(map);
            directionsRenderer.setDirections(response);

        }

    });
}


function initMap() {
    const userLocation = sfBayCoords;

    const map = new google.maps.Map(document.querySelector('#map'), {
        center: userLocation,
        scrollwheel: false,
        zoom: 10,
        zoomControl: true,
        panControl: false,
        streetViewControl: false,
        // styles: MAPSTYLES, // mapStyles is defined in mapstyles.js
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    const userMarker = new google.maps.Marker({
        position: userLocation,
        title: 'You are here',
        map: map,
        icon: {
            url: 'https://archives.bulbagarden.net/media/upload/thumb/d/d3/Lets_Go_Pikachu_Eevee_Red.png/250px-Lets_Go_Pikachu_Eevee_Red.png',
            scaledSize: new google.maps.Size(25, 25),
        },
    });
    userMarker.addListener('click', () => {
        const userInfoWindow = new google.maps.InfoWindow({
            content: 'You are here',
        });
        userInfoWindow.open(map, userMarker);

    });
    const pokemonInfo = new google.maps.InfoWindow();

    fetch('/fetch_pokemon_json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            const pokemons = data.pokemons;
            pokemons.forEach((pokemon) => {
                const sizeParameter = (Math.random() - 0.5) * 0.5
                const pokeLocation = {
                    lat: (userLocation.lat + sizeParameter).toFixed(2) * 1,
                    lng: (userLocation.lng + sizeParameter).toFixed(2) * 1,
                }
                pokemon.level += Math.floor(Math.random() * 10);
                const pokemonInfoContent = `
                <div class="pokemon-info">
                <p>Kind ID: ${pokemon.pokemon_id}</p>
                <p>Name: ${pokemon.name}</p>
                <p>LV: ${pokemon.level}</p>
                <p>Location: lat:${pokeLocation.lat}, lng:${pokeLocation.lng}</p>
                <button onclick="capturePokemon(event)">Capture</button>
                <button onclick="calCommuteTime(event)">Cal Commute Time</button>
                </div>`;
                const pokemonMarker = new google.maps.Marker({
                    position: {
                        lat: pokeLocation.lat,
                        lng: pokeLocation.lng,
                    },
                    title: pokemon.name,
                    map: map,
                    icon: {
                        url: pokemon.icon,
                        scaledSize: new google.maps.Size(75, 75),
                    },
                });
                pokemonMarker.addListener('click', () => {
                    pokemonInfo.setContent(pokemonInfoContent);
                    pokemonInfo.open(map, pokemonMarker);
                });
            });
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}
