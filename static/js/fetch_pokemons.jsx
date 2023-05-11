function FetchPokemon() {
    const [pokemons, setPokemons] = React.useState([]);
    // fetch Pokemon Data
    React.useEffect(() => {
        fetch('/fetch_pokemon_json')
            .then((response) => response.json())
            .then((data) => {
                setPokemons(data.pokemons);
            });
    }, []);
    // Capture Pokemon (POST request)
    function handleClick(evt) {
        evt.preventDefault();
        const kind_id = evt.target.parentElement.children[2].innerText.split(" ")[1]
        const name = evt.target.parentElement.children[3].innerText.split(" ")[1]
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ kind_id: kind_id })
        };
        fetch('/capture_pokemon', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                alert(data.status)
            });
    }
    function Pokemon(props) {
        return <div className="fetchPokemon">
            <div>Show Pokemon's info</div>
            <img src={props.image} alt="pokemon image" />
            <div>id: {props.id}</div>
            <div>name: {props.name}</div>
            {/* <div>height: {props.height}</div>
            <div>weight: {props.weight}</div> */}
            <button onClick={handleClick}>Capture</button>
        </div>
    }

    const pokemonList = []
    for (const pokemon of pokemons) {
        // console.log(pokemon)
        pokemonList.push(
            <Pokemon
                key={pokemon.pokemon_id}
                id={pokemon.pokemon_id}
                name={pokemon.name}
                // height={pokemon.height}
                // weight={pokemon.weight}
                image={pokemon.image}
            />,
        )
    };
    return (
        <React.Fragment>
            <h1>Fetch Pokemons</h1>
            <div className="pokemonContainer">
                {pokemonList}
            </div>
        </React.Fragment>
    );
}

ReactDOM.render(<FetchPokemon />, document.getElementById('pokemon_container'));
