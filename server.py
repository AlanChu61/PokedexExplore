from flask import Flask, render_template, request, flash, redirect, session, jsonify
from model import connect_to_db, db, Fetch_Pokemon, Player
import crud
from jinja2 import StrictUndefined

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


# @app.route('/fetch_pokemon')
# def fetch_pokemons_json():
#     """Show all pokemons."""
#     query = request.args.get('query')
#     pokemons = crud.get_fetch_pokemon()[0]
#     return jsonify(pokemons)


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
