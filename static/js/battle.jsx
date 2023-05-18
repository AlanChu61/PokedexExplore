
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
    const [playerUsername, setPlayerUsername] = React.useState("");
    const [opponentUsername, setOpponentUsername] = React.useState("");
    const [playerActive, setPlayerActive] = React.useState(true)
    const [opponentActive, setOpponentActive] = React.useState(false)
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
                setPlayerUsername(data.player_username)
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
                setOpponentUsername(data.opponent_username)
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

    const addLog = React.useCallback(
        new_log => {
            setLogs(prevLogs => [...prevLogs, new_log]);
        },
        [setLogs]
    );


    if (playerPokemons === null || opponentPokemons === null) {
        return (<div>"Loading"</div>);
    }
    else if (playerPokemons.length == 0) {
        alert("You lose!")
        return (<div>"You lose!"</div>);
    }
    else if (opponentPokemons.length == 0) {
        alert("You win!")
        return (<div>"You win!"</div>);
    }
    else {
        return (
            <div className="row">
                {playerUsername && <span>{playerUsername}</span>} vs. {opponentUsername && <span>{opponentUsername}</span>}

                <div className="col-12">
                    <Opponent opponentPokemons={opponentPokemons}
                        setAttacker={setAttacker} setDefender={setDefender}
                        attack={attack}
                        attacker={attacker} defender={defender}
                        setPlayerPokemons={setPlayerPokemons}
                        logs={logs} setLogs={setLogs}
                        opponentActive={opponentActive}
                        setOpponentActive={setOpponentActive}
                        setPlayerActive={setPlayerActive} />
                </div>
                <div className="col-12">
                    <Player playerPokemons={playerPokemons}
                        setAttacker={setAttacker} setDefender={setDefender}
                        attack={attack}
                        attacker={attacker} defender={defender} setOpponentPokemons={setOpponentPokemons}
                        logs={logs} setLogs={setLogs}
                        playerActive={playerActive}
                        setPlayerActive={setPlayerActive}
                        setOpponentActive={setOpponentActive} />

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
