
function attack(attacker, defender) {
    // who(obj) attack, whom is attacked, 
    let damage = Math.floor((2 * attacker.level / 25 + 10) * (attacker.stats.attack / defender.stats.defense) + 2);
    if (defender.stats.hp > damage) {
        defender.stats.hp -= damage;
    } else {
        defender.stats.hp = 0;
    }
    return [defender, damage];
}


function Battle() {
    // fetch battle info for player pokemon and opponent pokemon
    const [playerPokemons, setPlayerPokemons] = React.useState(null)
    const [opponentPokemons, setOpponentPokemons] = React.useState(null)
    const [attacker, setAttacker] = React.useState({})
    const [defender, setDefender] = React.useState({})
    const [logs, setLogs] = React.useState(["Battle Start!"])


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

    function Log(prop) {
        return (
            <div>
                {prop.log}
            </div>
        )
    }
    const logs_list = []
    for (let log of logs) {
        logs_list.push(<Log log={log} />)
    }
    if (playerPokemons === null || opponentPokemons === null) {
        return (<div>"Loading"</div>);
    }
    else if (playerPokemons.length == 0) {
        return (<div>"You lose!"</div>);
    }
    else if (opponentPokemons.length == 0) {
        return (<div>"You win!"</div>);
    }
    else {
        return (
            <div className="row">
                <button>Battle</button>
                <div className="col-12">
                    <Opponent opponentPokemons={opponentPokemons} setAttacker={setAttacker} setDefender={setDefender} />
                </div>
                <div className="col-12">
                    <Player playerPokemons={playerPokemons} setAttacker={setAttacker} attack={attack} attacker={attacker} defender={defender} setOpponentPokemons={setOpponentPokemons} logs={logs} setLogs={setLogs} />

                </div>
                <div className="col-12">
                    Battle History:
                    {logs_list}
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Battle />, document.getElementById('root'))
