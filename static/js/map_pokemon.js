'use strict';
let map;
const sfBayCoords = {
    lat: 37.601773,
    lng: -122.20287,
};

function capturePokemon(evt) {
    const name = evt.target.parentElement.children[1].innerHTML.split(":")[1].trim();
    const nickname = prompt("Please enter a nickname for your pokemon?", name);
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
            directionsRenderer.setDirections(response); ㄇㄩ
        }

    });
}


function initMap() {
    const userLocation = sfBayCoords;

    map = new google.maps.Map(document.querySelector('#map'), {
        center: userLocation,
        scrollwheel: false,
        zoom: 10,
        zoomControl: true,
        panControl: false,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });
    const addUserMarkerBtn = document.getElementById('addUserMakerBtn');
    addUserMarkerBtn.addEventListener('click', addUserMarker);
    const addPokemonMarkersBtn = document.getElementById('addPokemonMakerBtn');
    addPokemonMarkersBtn.addEventListener('click', addPokemonMarkers);
    const addPlayerMarkersBtn = document.getElementById('addPlayerMakerBtn');
    addPlayerMarkersBtn.addEventListener('click', addPlayerMarkers);
}
function addUserMarker() {
    const userLocation = sfBayCoords;  // Replace with your desired user location
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
}

function addPokemonMarkers() {
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
                const pokeLocation = {
                    lat: (map.center.lat() + (Math.random() - 0.5) * 0.5).toFixed(2) * 1,
                    lng: (map.center.lng() + (Math.random() - 0.5) * 0.5).toFixed(2) * 1,
                }
                pokemon.level += Math.floor(Math.random() * 60);
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
                    const pokemonInfo = new google.maps.InfoWindow();
                    pokemonInfo.setContent(pokemonInfoContent);
                    pokemonInfo.open(map, pokemonMarker);
                });
            });
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}
function addPlayerMarkers() {
    fetch('/player_list_json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log(data)
            const players = data.players;

            players.forEach((player) => {
                const playerLocation = {
                    lat: (map.center.lat() + (Math.random() - 0.5) * 0.5).toFixed(2) * 1,
                    lng: (map.center.lng() + (Math.random() - 0.5) * 0.5).toFixed(2) * 1,
                }
                const playerInfoContent = `
            <div class="player-info">
            <p>Name: ${player.username}</p>
            <p>Location: lat:${playerLocation.lat}, lng:${playerLocation.lng}</p>
            <form action="/battle" method="GET">
                    <input type="hidden" name="player_id" value=${player.player_id} />
                    <button type="submit">Let's battle</button>
                </form>
            </div>`;
                const icon = player.img
                    ? { url: player.img, scaledSize: new google.maps.Size(50, 50) }
                    : {
                        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                        fillColor: 'red',
                        fillOpacity: 1,
                        strokeColor: 'white',
                        strokeWeight: 2,
                        scale: 5,
                    };
                const playerMarker = new google.maps.Marker({
                    position: {
                        lat: playerLocation.lat,
                        lng: playerLocation.lng,
                    },
                    title: player.username,
                    map: map,
                    icon: icon,
                });
                playerMarker.addListener('click', () => {
                    const playerInfo = new google.maps.InfoWindow();
                    playerInfo.setContent(playerInfoContent);
                    playerInfo.open(map, playerMarker);
                });
            });
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}