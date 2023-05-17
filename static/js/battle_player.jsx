function Player(props) {
    const [playerPokemons, setPlayerPokemons] = React.useState(props.playerPokemons);
    const setAttacker = props.setAttacker;

    function assignAttacker(evt) {
        const nickname = evt.target.parentElement.childNodes[0].innerHTML.split(":")[1].trim()
        for (let pokemon of playerPokemons) {
            if (pokemon.nickname == nickname) {
                console.log(evt.target.parentElement)
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
        </div>
    )
}
