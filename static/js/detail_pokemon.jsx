const pokemon_id = document.getElementById('pokemon_id').innerText.split(':')[1];

function DetailPokemon(props) {
    // fecth data from API
    const [pokemon, setPokemon] = React.useState({});
    React.useEffect(() => {
        fetch(`/detail_pokemon_json/${props.pokemon_id}`)
            .then((response) => response.json())
            .then((data) => {
                setPokemon(data);
            });

    }, []);
    console.log(pokemon)
    console.log(pokemon.pokemon['nickname'])
    if (pokemon.nickname == null) {
        return <div>Loading...</div>
    }

    function Pokemon(props) {
        console.log(props)
        return (
            <div className="detailPokemon">
                {props.nickname}
            </div>
        );
    }

    return (
        <div>
            <h1>Detail Pokemon</h1>
            <div><Pokemon nickname={pokemon.nickname} /></div>
        </div>
    );
}

ReactDOM.render(<DetailPokemon pokemon_id={pokemon_id} />, document.getElementById('pokemon_detail'));
