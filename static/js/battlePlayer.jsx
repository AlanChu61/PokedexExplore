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
    const isAttacking = props.isAttacking;
    const setIsAttacking = props.setIsAttacking

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
            if (pokemon.nickname.toLowerCase() == nickname.toLowerCase()) {
                setAttacker(pokemon)
                setSelectedAttacker(nickname)
                break
            }
        }
    }

    function playerAttack(attacker, defender) {
        setIsAttacking(true)
        addLog(`-- ${playerInfo.username}'s turn --`)
        addLog(`\u2003 ${playerInfo.username}'s ${attacker.nickname.toUpperCase()} attacks ${defender.nickname.toUpperCase()}!`)

        const [new_defender, damage] = attack(attacker, defender)

        addLog(`\u2003 ${attacker.nickname.toUpperCase()} made ${damage} damage to ${defender.nickname.toUpperCase()}!`)
        if (new_defender.stats.hp <= 0) {
            addLog(`\u2003 ${defender.nickname.toUpperCase()} fainted!!!`)
            setOpponentPokemons(prevPokemons =>
                prevPokemons.filter(pokemon => pokemon != defender)
            );

        }
        // switch turn
        setTimeout(() => {
            setAttacker(null);
            setDefender(null);
            setPlayerActive(false);
            setIsAttacking(false)
            setSelectedAttacker(null);
            setSelectedDefender(null);
        }, 2000)

    }
    React.useEffect(() => {
        if (!playerActive && !attacker && !defender) {
            setOpponentActive(true);
            assignDefender();
        }
    }, [attacker, defender, playerActive])



    function assignDefender() {
        // randomly assign a defender
        const randomIndex = Math.floor(Math.random() * playerPokemons.length)
        setDefender(playerPokemons[randomIndex])
        setTimeout(() => {
            setSelectedDefender(playerPokemons[randomIndex].nickname)
        }, 1000)

    }


    function PlayerPokemon(props) {
        const isSelectedAttacker = selectedAttacker === props.nickname;
        const isSelectedDefender = selectedDefender === props.nickname;

        return <div className={`col-${Math.floor(9 / battleMode)} text-center card
        ${isSelectedAttacker ? 'border-success border-4' : ''}
        ${isSelectedDefender ? 'border-danger border-4' : ''}
        `} key={props.nickname}>
            <div className={`
            ${isSelectedAttacker && isAttacking ? 'shake-atk-animation' : ''}
            ${isSelectedDefender && isAttacking ? 'shake-def-animation' : ''}
            `}><img src={props.front_default} /></div>
            <div>{props.nickname.toUpperCase()}</div>
            <div>LV: {props.level}</div>
            <div>HP: {props.stats.hp}</div>
            <div>ATK/DEF: {props.stats.attack}/{props.stats.defense}</div>
            {playerActive && (<button className="btn btn-warning btn-sm" onClick={(evt) => assignAttacker(evt)}>Attacker</button>)}
        </div >
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
                <img className="battle-player-img" src={playerInfo.img} />
                <div>{playerInfo.username}</div>
                <div>Win:{playerInfo.winning_rate.win} Lose:{playerInfo.winning_rate.lose}</div>
                {playerActive && selectedAttacker && selectedDefender && (
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-sm button-attack" onClick={() => playerAttack(attacker, defender)}>Attack</button>
                    </div>
                )}
            </div>
            {playerPokemonList}
        </div >
    )
}
