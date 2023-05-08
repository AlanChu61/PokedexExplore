from flask import Flask, render_template, request, flash, redirect, session, jsonify
from model import connect_to_db, db, Fetch_Pokemon, User
from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "ThisIsASecretKey"
app.jinja_env.undefined = StrictUndefined


@app.route('/')
def homepage():
    """Show homepage."""

    return render_template('homepage.html')


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
