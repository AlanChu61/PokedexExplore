'use strict';
let map;
let userMarker;
let overview_path;
let directionsRenderer;
const isLogin = document.getElementById("userInfoBtn");
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

function bringMeThere() {
    let index = 0;
    let lat, lng;
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
            index++;
            loop();  // 
        }, 50); // 

        // check if distance is close to capture

        let pokeLocation = overview_path.slice(-1)[0];
        let distance = ((pokeLocation.lat() - userMarker.getPosition().lat()) ** 2 + (pokeLocation.lng() - userMarker.getPosition().lng()) ** 2) ** 0.5;

        const captureBtn = document.getElementById('capturability');
        if (!captureBtn) {
            return;
        }
        const captureBtnParent = captureBtn.parentElement;
        if (distance > 0.02) {
            captureBtn.innerHTML = "Too far";
            captureBtn.style.color = "red";
        }
        else {
            captureBtnParent.removeChild(captureBtn);
            const newCaptureBtn = document.createElement('button');
            newCaptureBtn.innerHTML = "Capture";
            newCaptureBtn.addEventListener("click", capturePokemon);
            captureBtnParent.insertAdjacentElement("beforeend", newCaptureBtn);
        }

    }
    loop();  // start the loop
}

function capturePokemon(evt) {
    const name = evt.target.parentElement.children[1].innerHTML.split(":")[1].trim();
    let nickname = prompt("Please enter a nickname for your pokemon?", name);
    if (nickname == null) {
        nickname = name
    }
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
            updatePokemonNum();
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function getCommuteTime(evt) {
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
    if (directionsRenderer) {
        directionsRenderer.setMap(null);
        directionsRenderer.setDirections(null);
    }

    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsService.route(request, function (response, status) {
        // output the overview_path of the response
        // [{'lat': 37.3816, 'lng': -122.0374},...]
        overview_path = response.routes[0].overview_path;
        if (status === 'OK') {
            overview_path = response.routes[0].overview_path;
            directionsRenderer.setMap(map);
            directionsRenderer.setDirections(response);
            const commuteTime = response.routes[0].legs[0].duration.text;
            const startAddress = response.routes[0].legs[0].start_address;
            const endAddress = response.routes[0].legs[0].end_address;

            const commuteDiv = document.getElementById('showCommuteTime');
            commuteDiv.innerHTML = "";

            const commuteDetail = document.createElement('div');
            commuteDetail.innerHTML = `
                <div>Commute Time: ${commuteTime} by ${request.travelMode}</div>
                <div>Start Address: ${startAddress}</div>
                <div>End Address: ${endAddress}</div>
            `;
            commuteDiv.appendChild(commuteDetail);
            const bringMeThereBtn = document.getElementById('bringMeThereBtn');
            bringMeThereBtn.style.display = 'inline-block';

        } else {
            console.error('Directions request failed with status: ' + status);
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

    if (isLogin) {
        const addUserMarkerBtn = document.getElementById('addUserMakerBtn');
        addUserMarkerBtn.addEventListener('click', addUserMarker);
        const addPokemonMarkersBtn = document.getElementById('addPokemonMakerBtn');
        addPokemonMarkersBtn.addEventListener('click', addPokemonMarkers);
        // add event listener for adding player markers
        document.getElementById('addPlayerOne').addEventListener('click', function () {
            addPlayerMarkers(1);
        });

        document.getElementById('addPlayerTwo').addEventListener('click', function () {
            addPlayerMarkers(2);
        });

        document.getElementById('addPlayerThree').addEventListener('click', function () {
            addPlayerMarkers(3);
        });
    }

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
    if (isLogin == false) {
        alert("Please login first!");
        return;
    }

    const userLocation = sunnyvaleCoords;
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
let pokemonMarkers = [];

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
                };
                pokemon.level += Math.floor(Math.random() * 60);

                const pokemonInfoContent = `
                    <div class="pokemon-info">
                        <div>Kind ID: ${pokemon.pokemon_id}</div>
                        <div>Name: ${pokemon.name}</div>
                        <div>LV: ${pokemon.level}</div>
                        <div>Location: lat:${pokeLocation.lat.toFixed(2)}, lng:${pokeLocation.lng.toFixed(2)}</div>
                        <button onclick="getCommuteTime(event)">Get Commute Time</button>
                        <button id="bringMeThereBtn" onclick="bringMeThere(event)"style="display: none;">Go</button>
                        <div id="capturability"></div>
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

                pokemonMarkers.push(pokemonMarker);

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

let playerMarkers = [];

function addPlayerMarkers(battleMode) {

    clearPlayerMarkers();

    fetch('/battle_players_json')
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
                };

                const playerInfoContent = `
                    <div class="player-info">
                        <div>Name: ${player.username}</div>
                        <div>Location: lat:${playerLocation.lat}, lng:${playerLocation.lng}</div>
                        <form action="/battle" method="GET">
                            <input type="hidden" name="player_id" value="${player.player_id}" />
                            <input type="hidden" name="battle_mode" value="${battleMode}" />
                            <button type="submit" ${battleMode <= player.pokemons.length ? '' : 'disabled'}>Let's battle</button>
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
                        scaledSize: new google.maps.Size(25, 50),
                    }
                });

                playerMarkers.push(playerMarker);

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

function clearPlayerMarkers() {
    playerMarkers.forEach((marker) => {
        marker.setMap(null);
    });
    playerMarkers = [];
}