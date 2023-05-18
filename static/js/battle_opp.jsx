function Opponent(props) {
    const opponentPokemons = props.opponentPokemons;
    const setDefender = props.setDefender;

    function assignDefender(evt) {
        const nickname = evt.target.parentElement.childNodes[0].innerHTML.split(":")[1].trim()
        for (let pokemon of opponentPokemons) {
            if (pokemon.nickname == nickname) {
                evt.target.parentElement.style.backgroundColor = "red"
                setDefender(pokemon)
            }
        }
    }
    function OpponentPokemon(props) {
        return <div className="pokemon col-3">
            <div>Nickname: {props.nickname}</div>
            <div>Level: {props.level}</div>
            <div>Front Sprite: <img src={props.front_default} /></div>
            <div>HP: {props.stats.hp}</div>
            <div>Attack: {props.stats.attack}</div>
            <div>Defense: {props.stats.defense}</div>
            <button onClick={(evt) => assignDefender(evt)}>Defender</button>
        </div>
    }

    const opponentPokemonList = []
    console.log(opponentPokemonList)
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
    console.log(opponentPokemonList)
    return (
        <div className="row">
            {opponentPokemonList}
        </div>
    )
}
