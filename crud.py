from model import db, Fetch_Pokemon, Player, PlayerPokemon, Pokemon

# fetch_pokemons


def create_fetch_pokemon(abilities, base_experience, forms, game_indices, height, held_items, is_default, location_area_encounters, moves, name, order, past_types, species, sprites, stats, types, weight):
    fetch_pokemon = Fetch_Pokemon(
        abilities=abilities, base_experience=base_experience, forms=forms, game_indices=game_indices, height=height, held_items=held_items, is_default=is_default,
        location_area_encounters=location_area_encounters, moves=moves, name=name, order=order, past_types=past_types, species=species, sprites=sprites, stats=stats, types=types, weight=weight)
    return fetch_pokemon


def get_fetch_pokemon_by_id(kind_id):
    return Fetch_Pokemon.query.get(kind_id)


def get_fetch_pokemon():
    return Fetch_Pokemon.query.all()

# players


def create_player(email, password, username):
    player = Player(email=email, password=password, username=username)
    return player


def get_players():
    return Player.query.all()


def get_player_by_id(player_id):
    return Player.query.get(player_id)

# Pokemons


def create_pokemon(nickname, kind_id):
    pokemon = Pokemon(nickname=nickname, kind_id=kind_id)
    return pokemon


def get_pokemons_by_user_id(player_id):
    # find the player
    player = Player.query.get(player_id)
    # return list of pokemons
    print(player.pokemons)
    return player.pokemons
