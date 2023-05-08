import requests
import json

url = "https://pokeapi.co/api/v2/pokemon/"

pokemons = []

for i in range(1, 201):
    response = requests.get(url + str(i))
    if response.status_code == 200:
        pokemon = response.json()
        pokemons.append(pokemon)
        print("ID:", pokemon.get("id"), "Name:", pokemon.get("name"))
    else:
        print("Error:", i)

with open('pokemon_data.json', 'w') as f:
    json.dump(pokemons, f)
