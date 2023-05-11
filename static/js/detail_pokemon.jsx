
function DetailPokemon(props) {
    // console.log("pokemon_id:", props.pokemon_id)
    // fecth data from API
    const [pokemon, setPokemon] = React.useState({});
    const [nickname, setNickname] = React.useState("");
    const [pokemon_id, setPokemonId] = React.useState(props.pokemon_id);
    React.useEffect(() => {
        fetch(`/detail_pokemon_json/${props.pokemon_id}`)
            .then((response) => response.json())
            .then((data) => {
                setPokemon(data.pokemon.kind_info);
                setNickname(data.pokemon.nickname);
            });

    }, []);
    function handleUpdate(evt) {
        evt.preventDefault();
        console.log("click to editing!")
    }
    function Pokemon(props) {
        return (
            <div className="detailPokemon">
                <img src={props.pokemon.image} alt="pokemon image" />
                <div>nickname: {props.nickname}</div>
                <div>id: {props.pokemon.pokemon_id}</div>
                <div>name: {props.pokemon.name}</div>
                More details...
                <button onClick={handleUpdate}>Update</button>

            </div>

        );
    }

    if (pokemon == null) {
        return <div>Loading...</div>
    } else {
        return (
            <div>
                <h1>Detail Pokemon</h1>
                <div><Pokemon pokemon={pokemon} nickname={nickname} /></div>
                <button>
                    <a href="/view_pokemons">See others</a>
                </button>
            </div>
        );
    }




}
const pokemon_id = document.getElementById('pokemon_id').innerText.split(':')[1];
ReactDOM.render(<DetailPokemon pokemon_id={pokemon_id} />, document.getElementById('pokemon_detail'));
