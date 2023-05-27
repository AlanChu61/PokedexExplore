from datetime import datetime
import os
import json
from random import choice, randint
import model
import crud
import server
import datetime
# 1. drop db and create db
os.system('dropdb pokemons')
os.system('createdb pokemons')

# 2. connect to db and create all db from models.py
model.connect_to_db(server.app)
model.db.create_all()

# 3. load data
pokemons_in_db = []

for pokemon_data_file in sorted(os.listdir('data')):
    print("Data Loading:", pokemon_data_file)
    with open(os.path.join('data', pokemon_data_file)) as f:
        pokemon_data = json.load(f)

    # handle pokemon_data as a list of dictionaries
    for pokemon in pokemon_data:
        print("Creating Pokemon:", pokemon.get('id'),":", pokemon.get('name'))
        if pokemon.get('id') > 1010:
            break
        abilities = pokemon.get('abilities')
        base_experience = pokemon.get('base_experience')
        forms = pokemon.get('forms')
        game_indices = pokemon.get('game_indices')
        height = pokemon.get('height')
        held_items = pokemon.get('held_items')
        is_default = pokemon.get('is_default')
        location_area_encounters = pokemon.get('location_area_encounters')
        moves = pokemon.get('moves')
        name = pokemon.get('name')
        order = pokemon.get('order')
        past_types = pokemon.get('past_types')
        species = pokemon.get('species')
        sprites = pokemon.get('sprites')
        stats = pokemon.get('stats')
        types = pokemon.get('types')
        weight = pokemon.get('weight')

        pokemon = crud.create_fetch_pokemon(abilities, base_experience, forms, game_indices, height, held_items,
                                            is_default, location_area_encounters, moves, name, order, past_types, species, sprites, stats, types, weight)
        pokemons_in_db.append(pokemon)
# 4. add all pokemons to session and commit
model.db.session.add_all(pokemons_in_db)
model.db.session.commit()

# 5 Create Player

user_list =[
        "Alan",
        "Bella",
        "Cathy",
        "David",
        "Ella",
        "Frank",
    ]
user_photo=[
    "/static/img/Player1.png",
    "/static/img/Player2.png",
    "/static/img/Player3.png",
    "/static/img/Player4.png",
    "/static/img/Player5.png",
    "/static/img/Player6.png",
]
for i in range(0, len(user_list)):
    email = f"test{i+1}"
    password = f"test{i+1}"
    username = f"{user_list[i]}"
    img = f"{user_photo[i]}"
    print(f"Creating Player: {username}")
    winning_rate ={
        "win": randint(0, 10),
        "lose": randint(0, 10),
    }
    player = crud.create_player(email, password, username,img,winning_rate)

    # Create Pokemon 6 times for each player
    for i in range(0, 6):
        random_pokemon = choice(pokemons_in_db)
        nickname = random_pokemon.name
        content = f"{nickname} is my favorite pokemon!"
        captured_date = datetime.datetime.now()
        level = randint(5, 50)
        stats = {
            "hp": randint(5, 100),
            "attack": randint(5, 50),
            "defense": randint(5, 50),
        }
        pokemon = crud.create_pokemon(
            nickname,  level, stats, random_pokemon.pokemon_id)
        comment = crud.create_comment(player, pokemon, content)
        player.pokemons.append(pokemon)
    model.db.session.add(player)
model.db.session.commit()
