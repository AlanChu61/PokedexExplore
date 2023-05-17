function Opponent() {
    const [opponentPokemons, setOpponentPokemons] = React.useState([]);
    React.useEffect(() => {
        fetch('/get_opponent_pokemon')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data.opponent_pokemons)
                setOpponentPokemons(data.opponent_pokemons)
            })
    }, []);
    function OpponentPokemon(props) {
        return <div className="pokemon col-3">
            <div>Nickname: {props.nickname}</div>
            <div>Level: {props.level}</div>
            <div>Front Sprite: <img src={props.front_default} /></div>
            <div>HP: {props.stats.hp}</div>
            <div>Attack: {props.stats.attack}</div>
            <div>Defense: {props.stats.defense}</div>
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
    return (
        <div className="row">
            {opponentPokemonList}
        </div>
    )
}

ReactDOM.render(
    <Opponent />,
    document.getElementById('opponent')
)