import requests
import json

url = "https://pokeapi.co/api/v2/pokemon/"


def fetch_pokemon_data(start, end):
    pokemons = []
    for i in range(start, end):
        response = requests.get(url + str(i))
        if response.status_code == 200:
            pokemon = response.json()
            pokemons.append(pokemon)
            print("ID:", pokemon.get("id"), "Name:", pokemon.get("name"))
        else:
            print("Error:", i)

    with open(f'data/pokemon_data_{start}-{end}.json', 'w') as f:
        json.dump(pokemons, f)


fetch_pokemon_data(1, 301)
fetch_pokemon_data(301, 601)
fetch_pokemon_data(601, 901)
fetch_pokemon_data(901, 1101)
