'use strict';
let map;
let userMarker;
let overview_path;
const sunnyvaleCoords = {
    lat: 37.3816,
    lng: -122.0374,
};
function moveUserMarker(deltaLat, deltaLng) {
    const currentPosition = userMarker.getPosition();
    const newPosition = new google.maps.LatLng(
        currentPosition.lat() + deltaLat,
        currentPosition.lng() + deltaLng
    );
    userMarker.setPosition(newPosition);
}

function bringMeThere(lat, lng) {
    let index = 0;
    function loop() {
        if (index >= overview_path.length) {
            return;  // break the loop
        }
        setTimeout(() => {
            // console.log(userMarker.getPosition().lat(), userMarker.getPosition().lng());
            lat = overview_path[index].lat();
            lng = overview_path[index].lng();
            let newPosition = new google.maps.LatLng(lat, lng);
            userMarker.setPosition(newPosition);
            // console.log(userMarker.getPosition().lat(), userMarker.getPosition().lng());
            index++;
            loop();  // 
        }, 200); // 

    }
    loop();  // start the loop
}

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

    let userLocation = new google.maps.LatLng(userMarker.getPosition().lat(), userMarker.getPosition().lng());
    let pokeLocation = new google.maps.LatLng(pokeLat, pokeLng);

    let request = {
        origin: userLocation,
        destination: pokeLocation,
        travelMode: 'DRIVING'
    };

    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();

    directionsService.route(request, function (response, status) {
        // output the overview_path of the response
        // [{'lat': 37.3816, 'lng': -122.0374},...]
        overview_path = response.routes[0].overview_path;
        if (status === 'OK') {
            directionsRenderer.setMap(map);
            directionsRenderer.setDirections(response);
            const commuteTime = response.routes[0].legs[0].duration.text;
            const startAddress = response.routes[0].legs[0].start_address;
            const endAddress = response.routes[0].legs[0].end_address;

            const commuteDiv = document.getElementById('calCommuteTime');
            commuteDiv.innerHTML = "<div>Here shows run time info:</div>";

            const commuteDetail = document.createElement('div');
            commuteDetail.innerHTML = `
                <p>Commute Time: ${commuteTime} by ${request.travelMode}</p>
                <p>Start Address: ${startAddress}</p>
                <p>End Address: ${endAddress}</p>
            `;
            commuteDiv.appendChild(commuteDetail);

        }
    });
}



function initMap() {
    const userLocation = sunnyvaleCoords;

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
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');

    rightBtn.addEventListener('click', () => moveUserMarker(0, 0.005));
    leftBtn.addEventListener('click', () => moveUserMarker(0, -0.005));
    downBtn.addEventListener('click', () => moveUserMarker(-0.005, 0));
    upBtn.addEventListener('click', () => moveUserMarker(0.005, 0));
}

function addUserMarker() {
    const userLocation = sunnyvaleCoords;  // Replace with your desired user location
    userMarker = new google.maps.Marker({
        position: userLocation,
        title: 'You are here',
        map: map,
        icon: {
            url: document.getElementById("userImg").getAttribute("src"),
            scaledSize: new google.maps.Size(50, 50),
        }

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
                    lat: (map.center.lat() + (Math.random() - 0.5) * 0.5) * 1,
                    lng: (map.center.lng() + (Math.random() - 0.5) * 0.5) * 1,
                }
                pokemon.level += Math.floor(Math.random() * 60);
                const distance = ((pokeLocation.lat - userMarker.getPosition().lat()) ** 2 + (pokeLocation.lng - userMarker.getPosition().lng()) ** 2) ** 0.5;

                const buttonContent = distance <= 0.2 ? "<button onclick='capturePokemon(event)'>Capture</button>" : "Too far";

                const pokemonInfoContent = `
                <div class="pokemon-info">
                <div>Kind ID: ${pokemon.pokemon_id}</div>
                <div>Name: ${pokemon.name}</div>
                <div>LV: ${pokemon.level}</div>
                <div>Location: lat:${pokeLocation.lat.toFixed(2)}, lng:${pokeLocation.lng.toFixed(2)}</div>
                ${buttonContent}
                <button onclick="calCommuteTime(event)">Cal Commute Time</button>
                <button onclick="bringMeThere(event)">bringMeThere</button>
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
                        scaledSize: new google.maps.Size(50, 50),
                    },
                });
                pokemonMarker.addListener('click', () => {
                    const pokemonInfo = new google.maps.InfoWindow();
                    pokemonInfo.setContent(pokemonInfoContent);
                    pokemonInfo.open(map, pokemonMarker);
                    google.maps.event.addListenerOnce(map, 'click', () => {
                        pokemonInfo.close();
                    });
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
            const players = data.players;

            players.forEach((player) => {
                const playerLocation = {
                    lat: (map.center.lat() + (Math.random() - 0.5) * 0.5).toFixed(2) * 1,
                    lng: (map.center.lng() + (Math.random() - 0.5) * 0.5).toFixed(2) * 1,
                }
                const playerInfoContent = `
            <div class="player-info">
            <div>Name: ${player.username}</div>
            <div>Location: lat:${playerLocation.lat}, lng:${playerLocation.lng}</div>
            <form action="/battle" method="GET">
                    <input type="hidden" name="player_id" value=${player.player_id} />
                    <button type="submit">Let's battle</button>
                </form>
            </div>`;

                const playerMarker = new google.maps.Marker({
                    position: {
                        lat: playerLocation.lat,
                        lng: playerLocation.lng,
                    },
                    title: player.username,
                    map: map,
                    icon: {
                        url: player.img,
                        scaledSize: new google.maps.Size(50, 50),
                    }
                });
                playerMarker.addListener('click', () => {
                    const playerInfo = new google.maps.InfoWindow();
                    playerInfo.setContent(playerInfoContent);
                    playerInfo.open(map, playerMarker);
                    google.maps.event.addListenerOnce(map, 'click', () => {
                        playerInfo.close();
                    });
                });
            });
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}