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
        const pokemon_id = evt.target.parentElement.firstChild.innerHTML.split(":")[1];
        fetch(`/delete_pokemon/${pokemon_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setPokemons(pokemons.filter(pokemon => pokemon.pokemon_id != pokemon_id));
                updatePokemonNum();
            })
            .catch((error) => {
                console.error('Error:');
            });
    }


    function Pokemon(props) {
        return <div className="col-6 col-md-4 card my-1">
            <div hidden>pokemon_id:{props.pokemon_id}</div>
            <a href={`/detail_pokemon/${props.pokemon_id}`}>
                <img className="img-fluid" src={props.image} alt="pokemon image" style={{ maxWidth: "100%" }} />
            </a>
            <div>ID: {props.id}</div>
            <div>{props.nickname.toUpperCase()}</div>
            <div>LV: {props.level}</div>
            <button className="btn btn-info btn-sm text-white" onClick={handleDelete}>Release</button>
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
                level={pokemon.level}
                height={pokemon.kind_info.height}
                weight={pokemon.kind_info.weight}
                image={pokemon.kind_info.image}
            />,
        )
    };


    return (
        <React.Fragment>
            {pokemonList.length === 0 ? (
                <React.Fragment>
                    <h3 className="text-center">You don't have any pokemon</h3>
                    <h3 className="text-center">Please meet <a href="/">Professor Oak</a> to get one.</h3>
                    <h3 className="text-center">Please go to the <a href="/map_pokemons">map</a> to capture some.</h3>
                </React.Fragment>
            ) : <div className="row">
                {pokemonList}
            </div>}
        </React.Fragment>
    );
}

ReactDOM.render(<ViewPokemons />, document.getElementById('pokemon_container'));
