from flask import Flask, render_template, request, flash, redirect, session, jsonify
from model import connect_to_db, db, Fetch_Pokemon, Player
import crud
from jinja2 import StrictUndefined
from random import sample
import json
app = Flask(__name__)
app.secret_key = "ThisIsASecretKey"
app.jinja_env.undefined = StrictUndefined


@app.route('/')
def homepage():
    """Show homepage."""

    return render_template('homepage.html')


@app.route('/fetch_pokemons')
def fetch_pokemons():
    """Show all pokemons."""
    pokemons = crud.get_fetch_pokemon()
    return render_template('fetch_pokemons.html', pokemons=pokemons)


@app.route('/fetch_pokemon_json')
def fetch_pokemon_json():
    """Show all pokemons."""
    pokemons = crud.get_fetch_pokemon()  # array
    random_pokemons = sample(pokemons, 3)  # array
    pokemons = []
    for pokemon in random_pokemons:
        # print("pokemon:", pokemon)
        pokemon_dict = convert_pokemon_obj2dict(pokemon)
        pokemons.append(pokemon_dict)
    # print("pokemons", pokemons)
    return jsonify({'pokemons': pokemons})


@app.route('/capture_pokemon', methods=['POST'])
def capture_pokemon():
    kind_id = request.json.get('kind_id')
    print("kind_id", kind_id)
    pokemon = crud.create_pokemon(nickname='test', kind_id=kind_id)

    # get a user take 1 for example
    player = crud.get_player_by_id(1)
    player.pokemons.append(pokemon)
    db.session.commit()
    return {
        "success": True,
        "status": f"Your captured successfully!"}


@app.route('/view_pokemons')
def view_pokemons():
    return render_template('view_pokemons.html')


@app.route('/view_pokemons_json')
def view_pokemons_json():
    # get a user take 1 for example
    player = crud.get_player_by_id(1)
    # get pokemons with player_id
    player_pokemons = crud.get_pokemons_by_user_id(player.player_id)
    pokemons = []
    for pokemon in player_pokemons:
        pokemon_dict = {}
        pokemon_dict['pokemon_id'] = pokemon.pokemon_id
        pokemon_dict['nickname'] = pokemon.nickname
        kind_id = pokemon.kind_id
        # get pokemon info
        pokemon_info = crud.get_fetch_pokemon_by_id(kind_id)
        print(type(pokemon_info))
        pokemon_dict['kind_info'] = convert_pokemon_obj2dict(pokemon_info)
        pokemons.append(pokemon_dict)
    return jsonify({'pokemons': pokemons})


@app.route('/delete_pokemon/<int:pokemon_id>', methods=['DELETE'])
def delete_pokemon(pokemon_id):
    """Delete a pokemon."""
    if crud.delete_pokemon_by_pokemon_id(pokemon_id):
        return {
            "success": True,
            "status": f"Your deleted successfully!"}
    else:
        return {
            "success": False,
            "status": f"Your deleted failed!"}


def convert_pokemon_obj2dict(pokemon):
    pokemon_dict = {}
    pokemon_dict['pokemon_id'] = pokemon.pokemon_id
    pokemon_dict['name'] = pokemon.name
    # pokemon_dict['height'] = pokemon.height
    # pokemon_dict['weight'] = pokemon.weight
    pokemon_dict['image'] = pokemon.sprites['other'].get(
        'official-artwork').get('front_default')
    return pokemon_dict


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
