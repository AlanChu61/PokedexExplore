function Player(props) {
    const [playerPokemons, setPlayerPokemons] = React.useState(props.playerPokemons);
    // for assign a attacker
    const setAttacker = props.setAttacker;
    // for re-rendering a defender after attacked
    const setOpponentPokemons = props.setOpponentPokemons;
    const attacker = props.attacker;
    const defender = props.defender;
    // attack method
    const attack = props.attack;

    const logs = props.logs;
    const setLogs = props.setLogs;

    const addLog = React.useCallback(
        new_log => {
            setLogs(prevLogs => [...prevLogs, new_log]);
        },
        [setLogs]
    );

    function playAttack(attacker, defender) {
        addLog(`---Player's turn---`)
        console.log(attacker, defender)
        addLog(`Player's ${attacker.nickname} attacks ${defender.nickname}!`)
        const [new_defender, damage] = attack(attacker, defender)
        addLog(`${attacker.nickname} made ${damage} damage to ${defender.nickname}!`)
        if (new_defender.stats.hp <= 0) {
            addLog(`${defender.nickname} fainted!`)
            // const currentOpponentPokemons = [...playerPokemons]
            setOpponentPokemons(prevPokemons =>
                prevPokemons.filter(pokemon => pokemon !== defender)
            );
            console.log("reset defender")

        }
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
            {playerPokemonList}
            <button onClick={() => playAttack(attacker, defender)}>Attack</button>
        </div>
    )
}
