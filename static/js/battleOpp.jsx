function Opponent(props) {
    // inital opponentPokemons setup
    const opponentInfo = props.opponent;
    const opponentPokemons = props.opponentPokemons;
    const battleMode = opponentPokemons.length


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
    const isAttacking = props.isAttacking;
    const setIsAttacking = props.setIsAttacking

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
        addLog(`\u2003 ${opponentInfo.username.toUpperCase()}'s ${attacker.nickname.toUpperCase()} attacks ${defender.nickname.toUpperCase()}!`)
        const [new_defender, damage] = attack(attacker, defender)
        setIsAttacking(true)
        setTimeout(() => {
            addLog(`\u2003 ${attacker.nickname.toUpperCase()} made ${damage} damage to ${defender.nickname}!`)
        }, 2000);
        if (new_defender.stats.hp <= 0) {
            addLog(`\u2003 ${defender.nickname.toUpperCase()} fainted!!`)
            setTimeout(() => {
                setPlayerPokemons(prevPokemons =>
                    prevPokemons.filter(pokemon => pokemon !== defender)
                );
            }, 1000);
        }
        // switch turn
        setTimeout(() => {
            setDefender(null);
            setOpponentActive(false);
            setIsAttacking(false);
            setPlayerActive(true);
            setSelectedAttacker(null);
            setSelectedDefender(null);
        }, 2000);

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
        return <div className={`pokemon col-${Math.floor(9 / battleMode)} text-center card
        ${isSelectedDefender ? 'border-danger border-4' : ''}
        ${isSelectedAttacker ? 'border-success border-4' : ''}
        `} key={props.nickname}>
            <div className=
                {`
                ${isSelectedAttacker && isAttacking ? 'shake-atk-animation' : ''}
                ${isSelectedDefender && isAttacking ? 'shake-def-animation' : ''}
            `}><img
                    src={props.front_default} /></div>
            <div>{props.nickname.toUpperCase()}</div>
            <div>LV: {props.level}</div>
            <div>HP: {props.stats.hp}</div>
            <div>ATK/DEF: {props.stats.attack}/{props.stats.defense}</div>
            {!opponentActive && (<button className="btn btn-warning btn-sm" onClick={(evt) => assignDefender(evt)}>Defender</button>)}
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
        if (opponentActive && !attacker) {
            // battle setup
            setTimeout(() => {
                addLog(`-- ${opponentInfo.username}'s turn --`);
            }, 1000);
            // set attacker
            setTimeout(() => {
                assignAttacker();
            }, 1000);
            // set defender
            // set on BattlePlayer side
        }
    }, [opponentActive]);

    React.useEffect(() => {
        if (opponentActive && attacker && defender) {
            setTimeout(() => {
                oppAttack(attacker, defender);
            }, 1000);
        }
    }, [attacker, defender])

    return (
        <div className="row">
            {opponentPokemonList}
            <div className="col-3 text-center m-auto">
                <img className="battle-player-img" src={opponentInfo.img} />
                <div>{opponentInfo.username}</div>
                <div>Win:{opponentInfo.winning_rate.win} Lose:{opponentInfo.winning_rate.lose}</div>
            </div>
        </div>
    )
}
