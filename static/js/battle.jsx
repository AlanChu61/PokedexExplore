
function attack(attacker, defender) {
    // attack is a put request to /attack
    // who(obj) attack, whom is attacked, 
    console.log(attacker)
    let damage = Math.floor((2 * attacker.level / 25 + 10) * (attacker.stats.attack / defender.stats.defense) + 2);
    if (defender.stats.hp > damage) {
        defender.stats.hp -= damage;
    } else {
        defender.stats.hp = 0;
        console.log(`${defender.nickname} fainted!`)
    }
    // Update the state of the defender and return the values
    return [attacker, defender, damage];
}

function Battle() {
    // fetch battle info for player pokemon and opponent pokemon
    const [playerPokemons, setPlayerPokemons] = React.useState(null)
    const [opponentPokemons, setOpponentPokemons] = React.useState(null)
    const [attacker, setAttacker] = React.useState({})
    const [defender, setDefender] = React.useState({})
    React.useEffect(() => {
        fetch('/get_player_pokemon')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setPlayerPokemons(data.player_pokemons)
            })
        fetch('/get_opponent_pokemon')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setOpponentPokemons(data.opponent_pokemons)
            })
    }, []);

    if (playerPokemons === null || opponentPokemons === null) {
        return (<div>"Loading"</div>)
    }
    else {
        console.log(attacker.nickname)
        console.log(defender.nickname)

        return (
            <div className="row">
                <button>Battle</button>
                <div className="col-12">
                    <Opponent opponentPokemons={opponentPokemons} setAttacker={setAttacker} setDefender={setDefender} />
                </div>
                <div className="col-12">
                    <Player playerPokemons={playerPokemons} setAttacker={setAttacker} setDefender={setDefender} />
                </div>
                <div className="col-12">
                    Battle History:
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Battle />, document.getElementById('root'))
