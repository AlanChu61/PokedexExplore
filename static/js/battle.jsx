// hepler function to handle attack
function attack(attacker, defender) {
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
    const [player, setPlayer] = React.useState(null);
    const [opponent, setOpponent] = React.useState(null);
    const [playerActive, setPlayerActive] = React.useState(true)
    const [opponentActive, setOpponentActive] = React.useState(false)
    const [attacker, setAttacker] = React.useState({})
    const [defender, setDefender] = React.useState({})
    const [isAttacking, setIsAttacking] = React.useState(false)
    const [selectedAttacker, setSelectedAttacker] = React.useState(null)
    const [selectedDefender, setSelectedDefender] = React.useState(null)
    const [logs, setLogs] = React.useState([])

    const opponentId = document.getElementById('opponent_id').innerHTML
    const battleMode = document.getElementById('battle_mode').innerHTML

    // fecth data for plaer(user) and pokemons  
    React.useEffect(() => {
        fetch(`/get_player_pokemon?battleMode=${battleMode}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setPlayer(data.player)
                setPlayerPokemons(data.player_pokemons)
            })

        // fecth data for opponent and pokemons
        fetch(`/get_opponent_pokemon?opponent_id=${opponentId}&battleMode=${battleMode}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setOpponent(data.opponent)
                setOpponentPokemons(data.opponent_pokemons)
            })
    }, []);

    function Log(props) {
        return (
            <div className="log">
                {props.log}
            </div>
        );
    }


    const logs_list = logs.map((log, index) => <Log key={index} log={log} />);

    const battleLog = document.getElementById('battle-log');
    function scrollToBottom() {
        battleLog.scrollTop = battleLog.scrollHeight;
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
    else if (playerPokemons.length == 0 || opponentPokemons.length == 0) {
        return (<BattleOver
            player={player} opponent={opponent}
            setPlayer={setPlayer} setOpponent={setOpponent}
            playerPokemons={playerPokemons} opponentPokemons={opponentPokemons} />)
    }
    else {
        if (battleLog) {
            scrollToBottom();
        }
        return (
            < div className="row" >
                <div className="col-12 col-md-9">
                    <div className="col-12">
                        <Opponent opponentPokemons={opponentPokemons}
                            setAttacker={setAttacker} setDefender={setDefender}
                            attack={attack}
                            attacker={attacker} defender={defender}
                            setPlayerPokemons={setPlayerPokemons}
                            logs={logs} setLogs={setLogs}
                            opponentActive={opponentActive}
                            setOpponentActive={setOpponentActive}
                            setPlayerActive={setPlayerActive}
                            selectedAttacker={selectedAttacker}
                            selectedDefender={selectedDefender}
                            setSelectedAttacker={setSelectedAttacker}
                            setSelectedDefender={setSelectedDefender}
                            isAttacking={isAttacking}
                            setIsAttacking={setIsAttacking}
                            opponent={opponent} />
                    </div>
                    <div className="col-12">
                        <Player playerPokemons={playerPokemons}
                            setAttacker={setAttacker} setDefender={setDefender}
                            attack={attack}
                            attacker={attacker} defender={defender} setOpponentPokemons={setOpponentPokemons}
                            logs={logs} setLogs={setLogs}
                            playerActive={playerActive}
                            setPlayerActive={setPlayerActive}
                            setOpponentActive={setOpponentActive}
                            selectedAttacker={selectedAttacker}
                            selectedDefender={selectedDefender}
                            setSelectedAttacker={setSelectedAttacker}
                            setSelectedDefender={setSelectedDefender}
                            isAttacking={isAttacking}
                            setIsAttacking={setIsAttacking}
                            player={player} />
                    </div>
                </div>
                <div className="col-12 col-md-3" >
                    <div className="bg-dark text-white" id="battle-log">
                        <div className="text-center">
                            Battle History
                        </div>
                        {logs_list}
                    </div>
                </div>
            </div >
        )
    }
}

ReactDOM.render(<Battle />, document.getElementById('battle'))
