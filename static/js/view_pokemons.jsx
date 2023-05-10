'use strict';
function ViewPokemons() {
    const [pokemons, setPokemons] = React.useState([]);

    React.useEffect(() => {
        fetch('/view_pokemons_json')
            .then((response) => response.json())
            .then((data) => setPokemons(data.pokemons));
    }, []);

    function Pokemon(props) {
        return <React.Fragment>
            <img src={props.image} alt="pokemon image" />
            <div>id: {props.id}</div>
            <div>name: {props.name}</div>
            <div>nickname: {props.nickname}</div>
        </React.Fragment>
    }
    const pokemonList = []
    for (const pokemon of pokemons) {
        pokemonList.push(
            <Pokemon
                key={pokemon.pokemon_id}
                id={pokemon.kind_info.pokemon_id}
                name={pokemon.kind_info.name}
                nickname={pokemon.nickname}
                // height={pokemon.height}
                // weight={pokemon.weight}
                image={pokemon.kind_info.image}
            />,
        )
    };
    return (
        <div>
            <h1>Pokemons</h1>
            {pokemonList}
        </div>
    );
}
ReactDOM.render(<ViewPokemons />, document.getElementById('pokemon_container'));

