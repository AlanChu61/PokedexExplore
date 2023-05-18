function Player(props) {
    // inital playerPokemons setup
    const playerInfo = props.player;
    const playerPokemons = props.playerPokemons;
    // for assign a attacker (by user)
    const setAttacker = props.setAttacker;
    // for assign a defender (by random)
    const setDefender = props.setDefender;

    // for re-rendering a defender after attacked
    const setOpponentPokemons = props.setOpponentPokemons;

    // Player's turn
    const playerActive = props.playerActive; // default is true
    const setPlayerActive = props.setPlayerActive;

    // attacker and defender for battle
    const attacker = props.attacker;
    const defender = props.defender;

    // attack method 
    const attack = props.attack;

    // Opponent's turn
    const setOpponentActive = props.setOpponentActive;

    // recod battle log
    const logs = props.logs;
    const setLogs = props.setLogs;

    const addLog = React.useCallback(
        new_log => {
            setLogs(prevLogs => [...prevLogs, new_log]);
        },
        [setLogs]
    );

    function playerAttack(attacker, defender) {
        addLog(`----Player's turn----`)
        addLog(`Player's ${attacker.nickname} attacks ${defender.nickname}!`)
        const [new_defender, damage] = attack(attacker, defender)
        addLog(`${attacker.nickname} made ${damage} damage to ${defender.nickname}!`)
        if (new_defender.stats.hp <= 0) {
            addLog(`${defender.nickname} fainted!`)
            setOpponentPokemons(prevPokemons =>
                prevPokemons.filter(pokemon => pokemon !== defender)
            );

        }
        // switch turn
        setPlayerActive(false)
        setOpponentActive(true)
        assignDefender();
    }

    function assignAttacker(evt) {
        const nickname = evt.target.parentElement.childNodes[0].innerHTML.split(":")[1].trim()
        for (let pokemon of playerPokemons) {
            if (pokemon.nickname == nickname) {
                evt.target.parentElement.style.backgroundColor = "green"
                setAttacker(pokemon)
            }
        }
    }

    function assignDefender() {
        // randomly assign a defender
        const randomIndex = Math.floor(Math.random() * playerPokemons.length)
        setDefender(playerPokemons[randomIndex])
        console.log(`${playerPokemons[randomIndex].nickname} is assigned as defender!`)
    }


    function PlayerPokemon(props) {
        return <div className="pokemon col-3">
            <div>Nickname: {props.nickname}</div>
            <div>Level: {props.level}</div>
            <div>Front Sprite: <img src={props.back_default} /></div>
            <div>HP: {props.stats.hp}</div>
            <div>Attack: {props.stats.attack}</div>
            <div>Defense: {props.stats.defense}</div>
            <button onClick={(evt) => assignAttacker(evt)}>Attacker</button>
        </div>
    }

    const playerPokemonList = []
    for (const pokemon of playerPokemons) {
        playerPokemonList.push(
            <PlayerPokemon
                key={pokemon.pokemon_id}
                nickname={pokemon.nickname}
                level={pokemon.level}
                back_default={pokemon.back_default}
                stats={pokemon.stats}
            />,
        )
    }
    return (
        <div className="row">
            <div className="col-3">
                <img src={playerInfo.img} width="100px" />
            </div>
            {playerPokemonList}
            {playerActive && <button onClick={() => playerAttack(attacker, defender)}>Attack</button>}
        </div>
    )
}
