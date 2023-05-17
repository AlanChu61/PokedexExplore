function Player() {
    const [playerPokemons, setPlayerPokemons] = React.useState([]);
    React.useEffect(() => {
        fetch('/get_player_pokemon')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data.player_pokemons)
                setPlayerPokemons(data.player_pokemons)
            })
    }, []);
    function PlayerPokemon(props) {
        return <div className="pokemon col-3">
            <div>Nickname: {props.nickname}</div>
            <div>Level: {props.level}</div>
            <div>Front Sprite: <img src={props.back_default} /></div>
            <div>HP: {props.stats.hp}</div>
            <div>Attack: {props.stats.attack}</div>
            <div>Defense: {props.stats.defense}</div>
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

ReactDOM.render(
    <Player />,
    document.getElementById('player')
)