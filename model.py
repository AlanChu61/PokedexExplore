from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

import os
db = SQLAlchemy()


class Fetch_Pokemon(db.Model):
    """A pokemon(from fetch API)."""

    __tablename__ = 'fetch_pokemons'

    pokemon_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    abilities = db.Column(db.JSON)
    base_experience = db.Column(db.Integer)
    forms = db.Column(db.JSON, nullable=False)
    game_indices = db.Column(db.JSON)
    height = db.Column(db.Integer)
    held_items = db.Column(db.JSON)
    is_default = db.Column(db.Boolean)
    location_area_encounters = db.Column(db.String(255))
    moves = db.Column(db.JSON)
    name = db.Column(db.String(255), nullable=False)
    order = db.Column(db.Integer)
    past_types = db.Column(db.JSON)
    species = db.Column(db.JSON)
    sprites = db.Column(db.JSON)
    stats = db.Column(db.JSON)
    types = db.Column(db.JSON)
    weight = db.Column(db.Integer)
    level = db.Column(db.Integer, nullable=False, default=5)

    def __repr__(self):
        """Show info about pokemon."""

        return f'<Pokemon pokemon_id={self.pokemon_id} name={self.name}>'


class Player (db.Model):
    """A player."""

    __tablename__ = 'players'

    player_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(25), nullable=False)
    username = db.Column(db.String(25), nullable=False, unique=True)
    img = db.Column(db.String(255), nullable=True)
    created_date = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow)
    winning_rate = db.Column(db.JSON, nullable=True,
                             default={"win": 0, "lose": 0})
    pokemons = db.relationship(
        "Pokemon", secondary="player_pokemons", back_populates="player")
    comments = db.relationship("Comment", back_populates="player")

    def __repr__(self):
        """Show info about user."""

        return f'<User user_id={self.player_id} username={self.username}>'


class PlayerPokemon(db.Model):
    """A player's pokemon."""
    __tablename__ = 'player_pokemons'
    player_pokemon_id = db.Column(
        db.Integer, autoincrement=True, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey(
        'players.player_id', ondelete='cascade'))
    pokemon_id = db.Column(db.Integer, db.ForeignKey(
        'pokemons.pokemon_id', ondelete='cascade'))


class Pokemon(db.Model):
    """A pokemon."""
    __tablename__ = 'pokemons'
    pokemon_id = db.Column(
        db.Integer, autoincrement=True, primary_key=True)
    nickname = db.Column(db.String(25))
    level = db.Column(db.Integer, nullable=False, default=5)
    stats = db.Column(db.JSON)
    captured_date = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow)
    kind_id = db.Column(db.Integer, db.ForeignKey(
        'fetch_pokemons.pokemon_id'))
    player = db.relationship(
        'Player', secondary='player_pokemons', back_populates='pokemons')
    comments = db.relationship("Comment", back_populates="pokemon")

    def __repr__(self):
        """Show info about Pokemon."""

        return f'<Pokemon pokemon_id={self.pokemon_id} nickname={self.nickname}>'


class Comment(db.Model):
    __tablename__ = 'comments'

    comment_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    content = db.Column(db.String(255), nullable=False)
    created_date = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow)
    player_id = db.Column(db.Integer, db.ForeignKey(
        'players.player_id', ondelete='cascade'))
    pokemon_id = db.Column(db.Integer, db.ForeignKey(
        'pokemons.pokemon_id', ondelete='cascade'))
    player = db.relationship('Player', back_populates='comments')
    pokemon = db.relationship('Pokemon', back_populates='comments')

    def __repr__(self):
        """Show info about Comment."""

        return f'<Comment {self.player} made {self.pokemon} about {self.content}>'


def connect_to_db(flask_app, db_uri="postgresql:///pokemons", echo=True):

    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")


if __name__ == '__main__':
    from server import app

    connect_to_db(app)
