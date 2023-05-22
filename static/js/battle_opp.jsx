function Opponent(props) {
    // inital opponentPokemons setup
    const opponentInfo = props.opponent;
    const opponentPokemons = props.opponentPokemons;

    // for assign a defender (by user)
    const setDefender = props.setDefender;
    // for assign a attacker (by random)
    const setAttacker = props.setAttacker;

    // for re-rendering a playerPokemons after attacked
    const setPlayerPokemons = props.setPlayerPokemons;

    // Opponent's turn
    const opponentActive = props.opponentActive; // it is true after player attack
    const setOpponentActive = props.setOpponentActive;

    // attacker and defender for battle
    let attacker = props.attacker;
    let defender = props.defender;

    const selectedAttacker = props.selectedAttacker;
    const setSelectedAttacker = props.setSelectedAttacker;
    const selectedDefender = props.selectedDefender;
    const setSelectedDefender = props.setSelectedDefender;

    // attack method 
    const attack = props.attack;

    // player's turn
    const setPlayerActive = props.setPlayerActive;

    // recod battle log
    const logs = props.logs;
    const setLogs = props.setLogs;




    const addLog = React.useCallback(
        new_log => {
            setLogs(prevLogs => [...prevLogs, new_log]);
        },
        [setLogs]
    );

    // assgin a defender by clicking the button for player
    function assignDefender(evt) {
        const nickname = (evt.target.parentElement.childNodes[1].innerHTML.toLowerCase())
        for (let pokemon of opponentPokemons) {
            if (pokemon.nickname == nickname) {
                setDefender(pokemon)
                setSelectedDefender(nickname)
            }
        }
    }

    function oppAttack(attacker, defender) {
        addLog(`Opp's ${attacker.nickname} attacks ${defender.nickname}!`)
        const [new_defender, damage] = attack(attacker, defender)
        addLog(`${attacker.nickname} made ${damage} damage to ${defender.nickname}!`)
        if (new_defender.stats.hp <= 0) {
            addLog(`${defender.nickname} fainted!`)
            setPlayerPokemons(prevPokemons =>
                prevPokemons.filter(pokemon => pokemon !== defender)
            );

        }
        // switch turn
        setOpponentActive(false)
        setPlayerActive(true)
    }

    function assignAttacker() {
        // randomly assign attacker
        const randomIndex = Math.floor(Math.random() * opponentPokemons.length)
        setAttacker(opponentPokemons[randomIndex])
    }


    function OpponentPokemon(props) {
        const isSelectedDefender = selectedDefender == props.nickname;
        return <div className={`pokemon col-4 card ${isSelectedDefender ? 'border-danger border-4' : ''}`} key={props.nickname}>
            <div><img src={props.front_default} /></div>
            <div>{props.nickname.toUpperCase()}</div>
            <div>LV: {props.level}</div>
            <div>HP: {props.stats.hp}</div>
            <div>ATK: {props.stats.attack}</div>
            <div>DEF: {props.stats.defense}</div>
            <button onClick={(evt) => assignDefender(evt)}>Defender</button>
        </div>
    }

    const opponentPokemonList = []
    for (const pokemon of opponentPokemons) {
        opponentPokemonList.push(
            <OpponentPokemon
                key={pokemon.pokemon_id}
                nickname={pokemon.nickname}
                level={pokemon.level}
                front_default={pokemon.front_default}
                stats={pokemon.stats}
            />,
        )
    }
    React.useEffect(() => {
        setSelectedDefender(null)
        if (opponentActive) {
            assignAttacker();
        }
    }, [opponentActive]);

    React.useEffect(() => {
        if (opponentActive) {
            // battle setup
            addLog(`----Opponent's turn----`)
            // set attacker
            assignAttacker()
            console.log(`attacker is set! ${attacker.nickname}`)
            // set defender
            console.log(`defender is set! ${defender.nickname}`)
            // attack
            oppAttack(attacker, defender)
            console.log('battle done!')
        }
    }, [attacker]);
    return (
        <div className="row">
            {opponentPokemonList}
            <div className="col-3">
                <div>Opponent:{opponentInfo.username}</div>
                <img src={opponentInfo.img} width="100px" />
            </div>
        </div>
    )
}
