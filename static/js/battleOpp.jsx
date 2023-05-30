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
        addLog(`${opponentInfo.username}'s ${attacker.nickname} attacks ${defender.nickname}!`)
        const [new_defender, damage] = attack(attacker, defender)
        addLog(`${attacker.nickname} made ${damage} damage to ${defender.nickname}!`)
        if (new_defender.stats.hp <= 0) {
            addLog(`${defender.nickname} fainted!`)
            setPlayerPokemons(prevPokemons =>
                prevPokemons.filter(pokemon => pokemon !== defender)
            );
        }
        // switch turn
        setSelectedAttacker(null);
        setSelectedDefender(null);
        setOpponentActive(false)
        setPlayerActive(true)

    }

    function assignAttacker() {
        // randomly assign attacker
        const randomIndex = Math.floor(Math.random() * opponentPokemons.length)
        setAttacker(opponentPokemons[randomIndex])
        setSelectedAttacker(opponentPokemons[randomIndex].nickname)
    }



    function OpponentPokemon(props) {
        const isSelectedDefender = selectedDefender == props.nickname;
        const isSelectedAttacker = selectedAttacker == props.nickname;
        return <div className={`pokemon col-4 card 
        ${isSelectedDefender ? 'border-danger border-4' : ''}
        ${isSelectedAttacker ? 'border-success border-4' : ''}
        `} key={props.nickname}>
            <div><img src={props.front_default} /></div>
            <div>{props.nickname.toUpperCase()}</div>
            <div>LV: {props.level}</div>
            <div>HP: {props.stats.hp}</div>
            <div>ATK/DEF: {props.stats.attack}/{props.stats.defense}</div>
            {!opponentActive && (<button onClick={(evt) => assignDefender(evt)}>Defender</button>)}
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
        if (opponentActive) {
            // battle setup
            setTimeout(() => {
                addLog(`---- ${opponentInfo.username}'s turn ----`);
                // set attacker
                setTimeout(() => {
                    assignAttacker();
                    // set defender
                    setTimeout(() => {
                        // attack
                        setTimeout(() => {
                            oppAttack(attacker, defender);
                        }, 1000);
                    }, 2000);
                }, 1000);
            }, 1000);
        }
    }, [opponentActive]);
    return (
        <div className="row">
            {opponentPokemonList}
            <div className="col-4">
                <img src={opponentInfo.img} width="80px" />
                <div>{opponentInfo.username}</div>
                <div>Win:{opponentInfo.winning_rate.win} Lose:{opponentInfo.winning_rate.lose}</div>
            </div>
        </div>
    )
}
