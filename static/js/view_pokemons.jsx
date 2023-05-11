'use strict';
function ViewPokemons() {
    const [pokemons, setPokemons] = React.useState([]);

    React.useEffect(() => {
        fetch('/view_pokemons_json')
            .then((response) => response.json())
            .then((data) => setPokemons(data.pokemons));
    }, []);

    function handleDelete(evt) {
        evt.preventDefault();
        const pokemon_id = evt.target.parentElement.firstChild.innerHTML.split(":")[1]
        console.log(pokemon_id)
        fetch(`/delete_pokemon/${pokemon_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setPokemons(pokemons.filter(pokemon => pokemon.pokemon_id != pokemon_id));
                console.log('Success');
            })
            .catch((error) => {
                console.error('Error:');
            });
    }


    function Pokemon(props) {
        return <div className="pokemon">
            <div hidden>pokemon_id:{props.pokemon_id}</div>
            <a href={`/detail_pokemon/${props.pokemon_id}`}>
                <img src={props.image} alt="pokemon image" />
            </a>
            <div>id: {props.id}</div>
            <div>name: {props.name}</div>
            <div>nickname: {props.nickname}</div>
            <button onClick={handleDelete}>Release</button>

        </div >
    }
    const pokemonList = []
    for (const pokemon of pokemons) {
        pokemonList.push(
            <Pokemon
                key={pokemon.pokemon_id}
                id={pokemon.kind_info.pokemon_id}
                name={pokemon.kind_info.name}
                pokemon_id={pokemon.pokemon_id}
                nickname={pokemon.nickname}
                // height={pokemon.height}
                // weight={pokemon.weight}
                image={pokemon.kind_info.image}
            />,
        )
    };


    return (
        <div>
            <div className="pokemonContainer">
                {pokemonList}
            </div>
        </div>
    );
}

ReactDOM.render(<ViewPokemons />, document.getElementById('pokemon_container'));

