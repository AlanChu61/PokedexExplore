function Player(props) {

    // inital playerPokemons setup
    const playerInfo = props.player;
    const playerPokemons = props.playerPokemons;
    const battleMode = playerPokemons.length
    // for assign a attacker (by user)
    const setAttacker = props.setAttacker;
    // for assign a defender (by random)
    const setDefender = props.setDefender;

    // for re-rendering a defender after attacked
    const setOpponentPokemons = props.setOpponentPokemons;

    // Player's turn
    const playerActive = props.playerActive; // default is true
    const setPlayerActive = props.setPlayerActive;

    // handle selected attacker and defender for css style
    const selectedAttacker = props.selectedAttacker;
    const setSelectedAttacker = props.setSelectedAttacker;
    const selectedDefender = props.selectedDefender;
    const setSelectedDefender = props.setSelectedDefender;

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

    // assgin an attacker by clicking the button
    function assignAttacker(evt) {
        const nickname = (evt.target.parentElement.childNodes[1].innerHTML.toLowerCase())
        for (let pokemon of playerPokemons) {
            if (pokemon.nickname == nickname) {
                setAttacker(pokemon)
                setSelectedAttacker(nickname)
                break
            }
        }
    }

    function playerAttack(attacker, defender) {
        addLog(`---- ${playerInfo.username}'s turn ----`)
        addLog(`${playerInfo.username}'s ${attacker.nickname.toUpperCase()} attacks ${defender.nickname.toUpperCase()}!`)

        const [new_defender, damage] = attack(attacker, defender)

        addLog(`${attacker.nickname.toUpperCase()} made ${damage} damage to ${defender.nickname.toUpperCase()}!`)
        if (new_defender.stats.hp <= 0) {
            addLog(`${defender.nickname.toUpperCase()} fainted!!!`)
            setOpponentPokemons(prevPokemons =>
                prevPokemons.filter(pokemon => pokemon != defender)
            );

        }
        // switch turn
        setPlayerActive(false);
        setSelectedAttacker(null);
        setSelectedDefender(null);
        setOpponentActive(true);
        assignDefender();
    }


    function assignDefender() {
        // randomly assign a defender
        const randomIndex = Math.floor(Math.random() * playerPokemons.length)
        setDefender(playerPokemons[randomIndex])
        setTimeout(() => {
            setSelectedDefender(playerPokemons[randomIndex].nickname)
        }, 3000)
    }


    function PlayerPokemon(props) {
        const isSelectedAttacker = selectedAttacker === props.nickname;
        const isSelectedDefender = selectedDefender === props.nickname;
        return <div className={`col-${Math.floor(9 / battleMode)} text-center card
        ${isSelectedAttacker ? 'border-success border-4' : ''}
        ${isSelectedDefender ? 'border-danger border-4' : ''}
        `} key={props.nickname}>
            <div><img src={props.front_default} /></div>
            <div>{props.nickname.toUpperCase()}</div>
            <div>LV: {props.level}</div>
            <div>HP: {props.stats.hp}</div>
            <div>ATK/DEF: {props.stats.attack}/{props.stats.defense}</div>
            {playerActive && (<button className="btn btn-warning btn-sm" onClick={(evt) => assignAttacker(evt)}>Attacker</button>)}
        </div>
    }

    const playerPokemonList = []
    for (const pokemon of playerPokemons) {
        playerPokemonList.push(
            <PlayerPokemon
                key={pokemon.pokemon_id}
                nickname={pokemon.nickname}
                level={pokemon.level}
                front_default={pokemon.front_default}
                stats={pokemon.stats}
            />,
        )
    }

    return (
        <div className="row">
            <div className="col-3 text-center m-auto">
                <img src={playerInfo.img} width="100px" />
                <div>{playerInfo.username}</div>
                <div>Win:{playerInfo.winning_rate.win} Lose:{playerInfo.winning_rate.lose}</div>
                {playerActive && selectedAttacker && selectedDefender && (
                    <button className="btn btn-danger btn-sm" onClick={() => playerAttack(attacker, defender)}>Attack</button>
                )}
            </div>
            {playerPokemonList}
        </div >
    )
}
