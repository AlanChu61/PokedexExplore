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


@app.route('/map_pokemons')
def get_map_pokemons():
    return render_template('map_pokemons.html')


@app.route('/fetch_pokemon_json')
def fetch_pokemon_json():
    """Show all pokemons."""
    pokemons = crud.get_fetch_pokemon()  # array
    random_pokemons = sample(pokemons, 5)  # array
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
    return render_template('view_pokemons.html')


@app.route('/view_pokemons_json')
def view_pokemons_json():
    """Show all pokemons."""
    # get player_id from session(login info)
    player_id = session['player_id']
    player = crud.get_player_by_id(player_id)
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

# Detail of a pokemon


@app.route('/detail_pokemon/<int:pokemon_id>')
def detail_pokemon(pokemon_id):
    """Show detail of a pokemon."""
    nickname = crud.get_nickname_by_pokemon_id(pokemon_id)
    title = nickname+"'s Detail"
    return render_template('detail_pokemon.html', title=title, pokemon_id=pokemon_id)


@app.route('/detail_pokemon_json/<int:pokemon_id>')
def detail_pokemon_json(pokemon_id):
    pokemon = crud.get_pokemon_by_pokemon_id(pokemon_id)
    comments = crud.get_comment_by_pokemon_id(pokemon_id)
    pokemon_dict = {}
    pokemon_dict['pokemon_id'] = pokemon.pokemon_id
    pokemon_dict['nickname'] = pokemon.nickname
    pokemon_dict['captured_date'] = pokemon.captured_date
    comment_dict = []
    for comment in comments:
        comment_dict.append(convert_comment_obj2dict(comment))
    pokemon_dict['comments'] = comment_dict
    kind_id = pokemon.kind_id
    # get pokemon info
    pokemon_info = crud.get_fetch_pokemon_by_id(kind_id)
    pokemon_dict['kind_info'] = convert_pokemon_obj2dict(pokemon_info)
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

# sign up


@app.route('/signup', methods=['POST', 'GET'])
def signup():
    """Show signup form."""
    if request.method == 'GET':
        return render_template('signup.html')

    """Create a new user."""
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        username = request.form.get('username')

        if crud.get_player_by_email(email):
            """account exists"""
            flash('Email already exists. Please try again.')
            return redirect('/signup')
        else:
            """new account"""
            new_player = crud.create_player(email, password, username)
            db.session.add(new_player)
            db.session.commit()
            flash('Sign up successfully!')
            session['player_id'] = new_player.player_id
            session['email'] = email
            session['username'] = username
            return redirect('/view_pokemons')


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Show login form."""
    if request.method == 'GET':
        return render_template('login.html')
    else:
        """Log in a user."""
        email = request.form.get('email')
        password = request.form.get('password')
        logined_player = crud.player_login(email, password)
        if logined_player:
            session['player_id'] = logined_player.player_id
            session['email'] = email
            session['username'] = logined_player.username
            flash('Login successfully!')
            return redirect('/view_pokemons')
        else:
            flash('Email or password is incorrect. Please try again.')
            return redirect('/login')


@app.route('/logout', methods=['GET'])
def logout():
    """Show login form."""
    session.clear()
    return redirect('/')


def convert_pokemon_obj2dict(pokemon):
    pokemon_dict = {}
    pokemon_dict['pokemon_id'] = pokemon.pokemon_id
    pokemon_dict['name'] = pokemon.name
    # pokemon_dict['height'] = pokemon.height
    # pokemon_dict['weight'] = pokemon.weight
    pokemon_dict['icon'] = pokemon.sprites['front_default']
    pokemon_dict['image'] = pokemon.sprites['other'].get(
        'official-artwork').get('front_default')
    return pokemon_dict


def convert_comment_obj2dict(comments):
    comment_dict = {}
    comment_dict['comment_id'] = comments.comment_id
    comment_dict['content'] = comments.content
    comment_dict['created_date'] = comments.created_date
    return comment_dict


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
