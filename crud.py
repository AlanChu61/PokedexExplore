from model import db, Fetch_Pokemon, Player, PlayerPokemon, Pokemon, Comment
from random import sample
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


def create_player(email, password, username,img,winning_rate):
    player = Player(email=email, password=password, username=username,img=img,winning_rate=winning_rate)
    return player


def get_all_players():
    return Player.query.all()


def get_player_by_email(email):
    return Player.query.filter(Player.email == email).first()


def get_player_by_id(player_id):
    return Player.query.get(player_id)

def get_other_players(player_id):
    return Player.query.filter(Player.player_id != player_id).all()

def update_player_by_player_id(player_id,username,img):
    player = Player.query.get(player_id)
    player.username = username
    player.img = img
    db.session.add(player)
    db.session.commit()
    return True


# Pokemons

# C


def create_pokemon(nickname, level, stats, kind_id):
    pokemon = Pokemon(nickname=nickname, level=level,
                      stats=stats, kind_id=kind_id)
    return pokemon

# R


def get_pokemons_by_user_id(player_id):
    # find the player
    player = Player.query.get(player_id)
    # return list of pokemons
    # print(player.pokemons)
    return player.pokemons


def get_pokemon_by_pokemon_id(pokemon_id):
    pokemon = Pokemon.query.get(pokemon_id)
    return pokemon


def get_nickname_by_pokemon_id(pokemon_id):
    pokemon = Pokemon.query.get(pokemon_id)
    return pokemon.nickname

# U


def update_pokemon_by_pokemon_id(pokemon_id, new_nickname):
    pokemon = get_pokemon_by_pokemon_id(pokemon_id)
    pokemon.nickname = new_nickname
    db.session.commit()
    return True
# Delete a pokemon


def delete_pokemon_by_pokemon_id(pokemon_id):
    pokemon = Pokemon.query.get(pokemon_id)
    db.session.delete(pokemon)
    db.session.commit()
    return True

# Comment


def create_comment(player, pokemon, content):
    comment = Comment(player=player, pokemon=pokemon, content=content)
    return comment


def get_comment_by_pokemon_id(pokemon_id):
    return Comment.query.filter(Comment.pokemon_id == pokemon_id).all()


def update_comment_by_comment_id(comment_id, new_content):
    comment = Comment.query.get(comment_id)
    comment.content = new_content
    db.session.commit()
    return True


def delete_comment_by_comment_id(comment_id):
    comment = Comment.query.get(comment_id)
    db.session.delete(comment)
    db.session.commit()
    return True

# Login


def player_login(email, password):
    return Player.query.filter(Player.email == email, Player.password == password).first()


# battle
def get_random_opponent(player_id):
    opponents = Player.query.filter(Player.player_id != player_id).all()
    return sample(opponents, 1)[0]

# def increase_win_lose(player_id, opponent_id):
#     player = Player.query.get(player_id)
#     player.winning_rate['win'] += 1
#     opponent = Player.query.get(opponent_id)
#     opponent.winning_rate['lose'] += 1
#     db.session.add_all([player, opponent])
#     db.session.commit()
#     return True

def increase_win_lose(player_id, opponent_id):
    player = Player.query.get(player_id)
    current_winning_rate = player.winning_rate.copy() 
    current_winning_rate['win'] += 1
    player.winning_rate = current_winning_rate  
    opponent = Player.query.get(opponent_id)
    current_winning_rate = opponent.winning_rate.copy() 
    current_winning_rate['lose'] += 1
    opponent.winning_rate = current_winning_rate 
    db.session.commit()
    return True

