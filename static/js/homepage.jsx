function capturePokemon(evt) {
    const name = evt.target.parentElement.children[1].innerHTML.split(" ")[1].trim()
    const nickname = prompt("Please enter a nickname for your pokemon?", name);
    const level = evt.target.parentElement.children[2].innerHTML.split(":")[1].trim()
    const [lat, lng] = [35, 6762, 139.6503]
    const kind_id = evt.target.parentElement.children[1].innerHTML.split(" ")[0].replace("#", "").trim()
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            nickname: nickname,
            level: level,
            kind_id: kind_id,
            lat: lat, lng: lng
        })
    };
    fetch('/capture_pokemon', requestOptions)
        .then((response) => response.json())
        .then((data) => {
            alert(data.status);
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}


function Homepage() {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [startedPokemon, setStartedPokemon] = React.useState([]);
    const [isSelected, setIsSelected] = React.useState(false);
    const text = [
        "Hello there! Welcome to the world of Pokémon!",
        "My name is Oak! People call me the Pokémon Prof!",
        "This world is inhabited by creatures called Pokémon!",
        "For some people, Pokémon are pets. Others use them for fights.",
        "Myself... I study Pokémon as a profession.",
        "Now, there are 3 Pokémon here. Haha! They are inside the Poké Balls.",
        "When I was young, I was a serious Pokémon trainer!",
        "In my old age, I have only 3 left, but you can have one! Choose!",
        "Be patient! PlayerName, you can have one too!",
        "Now, {player_name}, which Pokémon do you want?",
    ];
    const post_text = [
        "You Just got your first Pokémon!",
        "You can now start your journey to become a Pokémon Master!",
        "In this game, you cap capture more Pokemons on Google Maps!",
        "You can also leave some comments on your lovely Pokemons!",
        "You can also give them a nickname!",
        "You can also battle with other trainers!",
        "Your very own Pokémon legend is about to unfold! A world of dreams and adventures with Pokémon awaits! Let's go!"
    ]



    React.useEffect(() => {
        fetch('/get_started')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                response.json().then((data) => {
                    setStartedPokemon(data.pokemons);
                });
            })
    }, []);

    const handleNextText = () => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
    }


    function selectedPokemon(evt) {
        setIsSelected(true);
        setCurrentIndex(0);
        //Capture selected pokemon
        capturePokemon(evt)
    }


    function PokeBall(props) {
        const [isHovered, setIsHovered] = React.useState(false);
        return (
            <div
                className="pokeball col-4"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isHovered ? (
                    <div>
                        <img src={props.image} width="100px" height="100px" />
                        <div>#{props.pokemon_id} {props.name}</div>
                        <div>Level: {props.level}</div>
                        <div>HP: {props.stats.hp}</div>
                        <div>Attack: {props.stats.attack}</div>
                        <div>Defense: {props.stats.defense}</div>
                        <button onClick={selectedPokemon}>I want you!</button>
                    </div>
                ) : (
                    <img className="img-fluid mx-auto d-block" src="static/img/pokeBall.png" width="50px" height="50px" />
                )}
            </div>
        );
    }
    const pokeBalls = []
    for (let pokemon of startedPokemon) {
        console.log(pokemon)
        pokeBalls.push(
            <PokeBall key={pokemon.pokemon_id}
                pokemon_id={pokemon.pokemon_id}
                name={pokemon.name}
                image={pokemon.image}
                level={pokemon.level}
                stats={pokemon.stats} />)
    }
    console.log(currentIndex)
    return (
        <React.Fragment >
            <div className="col-12">
                <img className="img-fluid mx-auto d-block" src="/static/img/oak.png" />
            </div>
            <div className="row">
                {!isSelected ? (
                    <div className="border bg-dark">
                        <div className="text-white col-10">
                            {text[currentIndex]}
                        </div>
                        <div className="col-2 d-flex justify-content-end">
                            {currentIndex < text.length - 1 && (
                                <button onClick={handleNextText} disabled={currentIndex === text.length - 1}>&#8681;</button>
                            )}
                        </div>
                    </div>
                ) : <div className="border bg-dark">
                    <div className="text-white col-10">
                        {post_text[currentIndex]}
                    </div>
                    <div className="col-2 d-flex justify-content-end">
                        {currentIndex < post_text.length - 1 && (
                            <button onClick={handleNextText}>&#8681;</button>
                        )}
                    </div>
                </div>}
            </div>
            {(isSelected && (currentIndex === post_text.length - 1)) ? (

                <div>Start your Journey</div>
            ) : (
                <div>Click to continue</div>

            )}
            {currentIndex === text.length - 1 && !isSelected && (
                <div className="row">{pokeBalls}</div>
            )}
        </React.Fragment >
    );
}

ReactDOM.render(<Homepage />, document.getElementById('homepage'));
