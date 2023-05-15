'use strict';

function capturePokemon(evt) {
    const kind_id = evt.target.parentElement.children[0].innerHTML.split(":")[1]
    const name = evt.target.parentElement.children[1].innerHTML.split(":")[1];
    const [lat, lng] = evt.target.parentElement.children[2].innerHTML.split(":");
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind_id: kind_id, name: name, lat: lat, lng: lng })
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

function initMap() {
    const sfBayCoords = {
        lat: 37.601773,
        lng: -122.20287,
    };

    const map = new google.maps.Map(document.querySelector('#map'), {
        center: sfBayCoords,
        scrollwheel: false,
        zoom: 6,
        zoomControl: true,
        panControl: false,
        streetViewControl: false,
        // styles: MAPSTYLES, // mapStyles is defined in mapstyles.js
        mapTypeId: google.maps.MapTypeId.TERRAIN,
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
                let lat = (sfBayCoords.lat + Math.random() * 2).toFixed(2) * 1;
                let lng = (sfBayCoords.lng + Math.random() * 2).toFixed(2) * 1;
                const pokemonInfoContent = `
          <div class="pokemon-info">
            <p>Kind ID: ${pokemon.pokemon_id}</p>
            <p>Name: ${pokemon.name}</p>
            <p>Location: lat:${lat}, lng:${lng}</p>
            <button onclick="capturePokemon(event)">Capture</button>
          </div>
        `;
                const pokemonMarker = new google.maps.Marker({
                    position: {
                        lat: lat,
                        lng: lng,
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
