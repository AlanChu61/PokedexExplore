function DetailPokemon(props) {

    // fecth data from API
    const [pokemon, setPokemon] = React.useState({});
    const [nickname, setNickname] = React.useState("");
    const [pokemon_id, setPokemonId] = React.useState(props.pokemon_id);
    const [isUpdateing, setIsUpdateing] = React.useState(false);
    React.useEffect(() => {
        fetch(`/detail_pokemon_json/${props.pokemon_id}`)
            .then((response) => response.json())
            .then((data) => {
                setPokemon(data.pokemon.kind_info);
                setNickname(data.pokemon.nickname);
            });

    }, []);
    function handleEdit(evt) {
        evt.preventDefault();
        setIsUpdateing(true);
    }
    function handleUpdate(evt) {
        const new_nickname = evt.target.firstChild.value;
        evt.preventDefault();
        fetch(`/update_pokemon/${pokemon_id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            }, body: JSON.stringify({
                nickname: new_nickname,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setIsUpdateing(false);
                setNickname(new_nickname);
            });
    }

    function Pokemon(props) {
        return (
            <div className="detailPokemon">
                <img src={props.pokemon.image} alt="pokemon image" />
                <div>nickname: {props.nickname}</div>
                <div>id: {props.pokemon.pokemon_id}</div>
                <div>name: {props.pokemon.name}</div>
                More details...
                <button onClick={handleEdit}>Edit</button>
            </div>

        );
    } function UpdateForm() {
        return (
            <form onSubmit={handleUpdate}>
                <input type="text" id="updateForm" />
                <button type="submit">Save</button>
            </form>
        );
    }

    if (pokemon == null) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <h1>Detail Pokemon</h1>
                <div>
                    <Pokemon pokemon={pokemon} nickname={nickname} />
                    {isUpdateing && <UpdateForm />}
                </div>

                <button>
                    <a href="/view_pokemons">See others</a>
                </button>
            </div>
        );
    }
}




const pokemon_id = document.getElementById('pokemon_id').innerText.split(':')[1];
ReactDOM.render(<DetailPokemon pokemon_id={pokemon_id} />, document.getElementById('pokemon_detail'));
