from flask import Flask, render_template, request, flash, redirect, session, jsonify
from flask_cors import CORS, cross_origin
from model import connect_to_db, db
from jinja2 import StrictUndefined
from random import sample
from dotenv import load_dotenv
import crud
import os

from cloudinary.uploader import upload
from cloudinary import config as cloudinary_config


app = Flask(__name__)
load_dotenv()
CORS(app)


app.secret_key = "ThisIsASecretKey"
app.jinja_env.undefined = StrictUndefined


def convert_pokemon_obj2dict(pokemon):
    pokemon_dict = {}
    pokemon_dict['pokemon_id'] = pokemon.pokemon_id
    pokemon_dict['name'] = pokemon.name
    pokemon_dict['level'] = pokemon.level
    pokemon_dict['icon'] = pokemon.sprites['front_default']
    print(pokemon.stats)
    print(pokemon.level)
    pokemon_dict['stats'] = {
        'hp': pokemon.stats[0]['base_stat']+2*pokemon.level,
        'attack': pokemon.stats[1]['base_stat']+0.5*pokemon.level,
        'defense': pokemon.stats[2]['base_stat']+0.5*pokemon.level,
    }
    pokemon_dict['image'] = pokemon.sprites['other'].get(
        'official-artwork').get('front_default')
    return pokemon_dict


def convert_pokemon_battle_obj2dict(pokemon):
    pokemon_dict = {}
    fetch_pokemon = crud.get_fetch_pokemon_by_id(pokemon.kind_id)
    pokemon_dict['pokemon_id'] = pokemon.pokemon_id
    pokemon_dict['nickname'] = pokemon.nickname
    pokemon_dict['level'] = pokemon.level
    pokemon_dict['stats'] = pokemon.stats
    pokemon_dict['img'] = fetch_pokemon.sprites['other'].get(
        'official-artwork').get('front_default')
    pokemon_dict['back_default'] = fetch_pokemon.sprites['back_default']
    pokemon_dict['front_default'] = fetch_pokemon.sprites['front_default']
    return pokemon_dict


def convert_comment_obj2dict(comment):
    # convert comment(obj) to comment(dict)
    comment_dict = {}
    comment_dict['comment_id'] = comment.comment_id
    comment_dict['content'] = comment.content
    comment_dict['created_date'] = comment.created_date
    comment_dict['player'] = comment.player.username
    return comment_dict


def conver_player_obj2dict(player):
    # convert player(obj) to player(dict)
    player_dict = {}
    player_dict['player_id'] = player.player_id
    player_dict['username'] = player.username
    player_dict['email'] = player.email
    player_dict['img'] = player.img
    player_dict['winning_rate'] = player.winning_rate
    player_dict['created_date'] = player.created_date
    return player_dict


@app.route('/')
def homepage():
    """Show homepage."""

    return render_template('homepage.html', title="HomePage")


@app.route('/get_started')
def get_started():
    """Show get_started."""
    pokemons = []
    for i in range(1, 8, 3):
        pokemon = crud.get_fetch_pokemon_by_id(i)
        pokemon_dict = convert_pokemon_obj2dict(pokemon)
        pokemons.append(pokemon_dict)
        print(pokemon_dict['name'])
    return jsonify({'pokemons': pokemons})


@app.route('/fetch_pokemons')
def fetch_pokemons():
    """Show all pokemons."""
    pokemons = crud.get_fetch_pokemon()
    return render_template('fetch_pokemons.html', pokemons=pokemons)


@app.route('/map_pokemons')
def get_map_pokemons():
    return render_template('map_pokemons.html', title="MapPokemons", map_API=os.environ['GOOGLE_MAP_API_KEY'])


@app.route('/fetch_pokemon_json')
def fetch_pokemon_json():
    """Show all pokemons."""
    pokemons = crud.get_fetch_pokemon()  # array
    random_pokemons = sample(pokemons, 7)  # array
    pokemons = []
    for pokemon in random_pokemons:
        pokemon_dict = convert_pokemon_obj2dict(pokemon)
        pokemons.append(pokemon_dict)
    return jsonify({'pokemons': pokemons})


@app.route('/capture_pokemon', methods=['POST'])
def capture_pokemon():
    kind_id = request.json.get('kind_id')
    level = int(request.json.get('level'))
    nickname = request.json.get('nickname')
    fetch_pokemon = crud.get_fetch_pokemon_by_id(kind_id)
    stats = {
        'hp': int(fetch_pokemon.stats[0]['base_stat'])+2*level,
        'attack': int(fetch_pokemon.stats[1]['base_stat'])+0.5*level,
        'defense': int(fetch_pokemon.stats[2]['base_stat'])+0.5*level,
    }
    pokemon = crud.create_pokemon(
        nickname=nickname, level=level, stats=stats, kind_id=kind_id)
    # get player_id from session(login info)
    player_id = session['player_id']
    player = crud.get_player_by_id(player_id)
    player.pokemons.append(pokemon)
    db.session.commit()
    return {
        "success": True,
        "status": f"Your captured successfully!"}


@app.route('/view_pokemons')
def view_pokemons():
    return render_template('view_pokemons.html', title="View Pokemons")


@app.route('/view_pokemons_json')
def view_pokemons_json():
    """Show all pokemons."""
    # get player_id from session(login info)
    player_id = session['player_id']
    player = crud.get_player_by_id(player_id)
    # get pokemons with player_id
    player_pokemons = player.pokemons
    pokemons = []
    for pokemon in player_pokemons:
        pokemon_dict = {}
        pokemon_dict['pokemon_id'] = pokemon.pokemon_id
        pokemon_dict['nickname'] = pokemon.nickname
        pokemon_dict['level'] = pokemon.level
        pokemon_dict['stats'] = pokemon.stats
        # get pokemon info
        pokemon_info = crud.get_fetch_pokemon_by_id(pokemon.kind_id)
        pokemon_dict['kind_info'] = convert_pokemon_obj2dict(pokemon_info)
        pokemons.append(pokemon_dict)
    return jsonify({'pokemons': pokemons})

# Detail of a pokemon


@app.route('/detail_pokemon/<int:pokemon_id>')
def detail_pokemon(pokemon_id):
    """Show detail of a pokemon."""
    nickname = crud.get_nickname_by_pokemon_id(pokemon_id)
    title = nickname.capitalize()+"'s Info"
    return render_template('detail_pokemon.html', title=title, pokemon_id=pokemon_id)


@app.route('/detail_pokemon_json/<int:pokemon_id>')
def detail_pokemon_json(pokemon_id):
    pokemon = crud.get_pokemon_by_pokemon_id(pokemon_id)
    comments = crud.get_comment_by_pokemon_id(pokemon_id)
    pokemon_dict = {}
    pokemon_dict['pokemon_id'] = pokemon.pokemon_id
    pokemon_dict['nickname'] = pokemon.nickname
    pokemon_dict['captured_date'] = pokemon.captured_date
    pokemon_dict['level'] = pokemon.level
    pokemon_dict['stats'] = pokemon.stats

    # get pokemon info
    pokemon_info = crud.get_fetch_pokemon_by_id(pokemon.kind_id)
    pokemon_dict['kind_info'] = convert_pokemon_obj2dict(pokemon_info)

    # get comments
    comment_list = []
    for comment in comments:
        comment_list.append(convert_comment_obj2dict(comment))
    pokemon_dict['comments'] = comment_list
    return jsonify({'pokemon': pokemon_dict})


@app.route('/update_pokemon/<int:pokemon_id>', methods={'PUT'})
def update_pokemon(pokemon_id):
    """Update a pokemon."""
    new_nickname = request.json.get('nickname')
    print(new_nickname)
    if crud.update_pokemon_by_pokemon_id(pokemon_id, new_nickname):
        return {
            "success": True,
            "status": f"Your updated successfully!"}
    else:
        return {
            "success": False,
            "status": f"Your updated failed!"}


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
# Comment


@app.route('/create_comment/<int:pokemon_id>', methods=['POST'])
def create_comment(pokemon_id):
    """Create a comment."""
    content = request.json.get('content')
    player = crud.get_player_by_id(session['player_id'])
    pokemon = crud.get_pokemon_by_pokemon_id(pokemon_id)
    comment = crud.create_comment(player, pokemon, content)
    db.session.add(comment)
    db.session.commit()
    return {
        "success": True,
        "status": f"Your comment successfully!",
        "comment": convert_comment_obj2dict(comment)}


@app.route('/update_comment/<int:comment_id>', methods={'PUT'})
def update_comment(comment_id):
    """Update a comment."""
    new_content = request.json.get('content')
    if crud.update_comment_by_comment_id(comment_id, new_content):
        return {
            "success": True,
            "status": f"Your updated successfully!"}
    else:
        return {
            "success": False,
            "status": f"Your updated failed!"}


@app.route('/delete_comment/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    """Delete a comment."""
    if crud.delete_comment_by_comment_id(comment_id):
        return {
            "success": True,
            "status": f"Your deleted successfully!"}
    else:
        return {
            "success": False,
            "status": f"Your deleted failed!"}
# sign up


@app.route('/signup', methods=['POST', 'GET'])
def signup():
    """Show signup form."""
    if request.method == 'GET':
        return render_template('signup.html', title='Sign Up')

    """Create a new user."""
    if request.method == 'POST':
        email = request.form.get('email').strip()
        password = request.form.get('password').strip()
        username = request.form.get('username').strip()
        if request.form.get('imageUrl'):
            img = request.form.get('imageUrl')
        else:
            img = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/150.svg"
        if crud.get_player_by_email(email):
            """account exists"""
            flash("Email already exists. Please try again!", "error")
            return redirect('/signup')
        else:
            """new account"""
            new_player = crud.create_player(
                email, password, username, img, winning_rate={"win": 0, "lose": 0})
            db.session.add(new_player)
            db.session.commit()
            flash("Sign up successfully!", "success")
            # save user info in session
            session['player_id'] = new_player.player_id
            session['username'] = username
            session['email'] = email
            session['img'] = img
            session['pokemon_num'] = len(new_player.pokemons)
            return redirect('/')


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Show login form."""
    if request.method == 'GET':
        return render_template('login.html', title='Login')
    else:
        """Log in a user."""
        email = request.form.get('email').strip()
        password = request.form.get('password').strip()
        logined_player = crud.player_login(email, password)
        if logined_player:
            session['player_id'] = logined_player.player_id
            session['email'] = email
            session['username'] = logined_player.username
            session['img'] = logined_player.img
            session['pokemon_num'] = len(logined_player.pokemons)
            # session['winning_rate'] = logined_player.winning_rate
            flash("Login successfully!", "success")
            return redirect('/view_pokemons')
        else:
            flash("Email or password is incorrect. Please try again. ", "error")
            return redirect('/login')


@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect('/')


@app.route("/upload", methods=['POST'])
def upload_image():
    app.logger.info('in upload route')
    cloudinary_config(cloud_name=os.getenv('CLOUD_NAME'), api_key=os.getenv('API_KEY'),
                      api_secret=os.getenv('API_SECRET'))
    upload_result = None
    if request.method == 'POST':
        image_to_upload = request.files['image']
        app.logger.info('%s file_to_upload', image_to_upload)
        if image_to_upload:
            upload_result = upload(image_to_upload)
            app.logger.info(upload_result)
            return jsonify(upload_result)


@app.route('/profile', methods=['GET'])
def profile():
    """Show login form."""
    return render_template('profile.html', title='Profile')


@app.route('/update_profile', methods=['PUT'])
def update_profile():
    player_id = session['player_id']
    username = request.json.get('username')
    uploadUrl = request.json.get('uploadUrl')
    crud.update_player_by_player_id(player_id, username, uploadUrl)
    # Updated profile
    new_username = crud.get_player_by_id(player_id).username
    new_img = crud.get_player_by_id(player_id).img
    session['username'] = new_username
    session['img'] = new_img
    flash("Update successfully!", "success")
    return jsonify({"username": new_username, "uploadUrl": new_img})


@app.route('/update_pokemon_num', methods=['GET'])
def update_pokemon_num():
    session['pokemon_num'] = len(
        crud.get_pokemons_by_user_id(session['player_id']))
    return jsonify({"pokemon_num": session['pokemon_num']})

# battle


@app.route('/battle_players', methods=['GET'])
def player_list():
    """Show player list page."""
    return render_template('player_list.html', title='Battle')


@app.route('/battle_players_json', methods=['GET'])
def player_list_json():
    if 'player_id' not in session:
        players = crud.get_all_players()
    else:
        players = crud.get_other_players(session['player_id'])
    player_list = []
    for player in players:
        player_dict = conver_player_obj2dict(player)
        player_dict['pokemons'] = []
        for player_pokemon in player.pokemons:
            player_dict['pokemons'].append(
                convert_pokemon_battle_obj2dict(player_pokemon))
        player_list.append(player_dict)
    return jsonify({"players": player_list})


@app.route('/battle', methods=['GET'])
def battle():
    """Show battle page."""
    opponent_id = request.args.get('player_id')
    battle_mode = int(request.args.get('battle_mode'))
    opponent_username = crud.get_player_by_id(opponent_id).username
    player_username = session['username']
    flash(f"{player_username} vs. {opponent_username}", "info")
    return render_template('battle.html', title='Battle', opponent_id=opponent_id, battle_mode=battle_mode)


@app.route('/get_opponent_pokemon', methods=['GET'])
def get_opponent_pokemon():
    # get Battle Mode from FE
    battle_mode = int(request.args.get('battleMode'))
    # Get opponent id from url
    opponent_id = request.args.get('opponent_id')
    opponent = crud.get_player_by_id(opponent_id)
    opponent_pokemons = sample(opponent.pokemons, battle_mode)
    opponent_dict = conver_player_obj2dict(opponent)
    opponent_pokemons_list = []
    for pokemon in opponent_pokemons:
        opponent_pokemons_list.append(convert_pokemon_battle_obj2dict(pokemon))
    return jsonify({"opponent": opponent_dict, "opponent_pokemons": opponent_pokemons_list})


@app.route('/get_player_pokemon', methods=['GET'])
def get_player_pokemon():
    # get Battle Mode from FE
    battle_mode = int(request.args.get('battleMode'))

    # Get player's pokemon
    player = crud.get_player_by_id(session['player_id'])
    player_pokemons = sample(player.pokemons, battle_mode)
    player_dict = conver_player_obj2dict(player)
    player_pokemons_list = []
    for pokemon in player_pokemons:
        player_pokemons_list.append(convert_pokemon_battle_obj2dict(pokemon))
    return jsonify({"player": player_dict, "player_pokemons": player_pokemons_list})


@app.route('/handle_win', methods=['PUT'])
def handle_win():
    player_id = request.json.get('player_id')
    opponent_id = request.json.get('opponent_id')
    crud.increase_win_lose(player_id, opponent_id)
    player = crud.get_player_by_id(player_id)
    opponent = crud.get_player_by_id(opponent_id)
    return jsonify({"message": "success", "player": conver_player_obj2dict(player), "opponent": conver_player_obj2dict(opponent)})


@app.route('/handle_lose', methods=['PUT'])
def handle_lose():
    player_id = request.json.get('player_id')
    opponent_id = request.json.get('opponent_id')
    crud.increase_win_lose(opponent_id, player_id)
    player = crud.get_player_by_id(player_id)
    opponent = crud.get_player_by_id(opponent_id)
    return jsonify({"message": "success", "player": conver_player_obj2dict(player), "opponent": conver_player_obj2dict(opponent)})


@app.route('/handle_lose', methods=['PUT'])
def increase_lost_win():
    player_id = request.json.get('player_id')
    opponent_id = request.json.get('opponent_id')
    crud.increase_win_lose(opponent_id, player_id,)
    return jsonify({"message": "success"})


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
