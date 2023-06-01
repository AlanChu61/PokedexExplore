function capturePokemon(evt) {
    evt.preventDefault();
    const name = evt.target.parentElement.childNodes[0].childNodes[1].innerHTML.split(" ")[1].trim()
    const nickname = prompt("Please enter a nickname for your pokemon?", name);
    const level = evt.target.parentElement.childNodes[1].childNodes[0].innerHTML.split(":")[1].trim()
    const [lat, lng] = [35, 6762, 139.6503]
    const kind_id = evt.target.parentElement.childNodes[0].childNodes[1].innerHTML.split(" ")[0].replace("#", "").trim()
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
    const introText = [
        "Hello there! Welcome to the world of Pokémon!",
        "Hi, this is Pokedex Explore APP!",
        "Here you can capture Pokemons on Google Maps",
        "And you can also battle with other trainers",
        "And you can also leave some comments on your lovely Pokemons",
        "And you can also give them a nickname",
        "And you can also see your Pokemons' stats",
        "Please login for better expericne!",
    ]

    const handleNextText = () => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
    }

    if (!document.getElementById("username")) {
        return <React.Fragment>
            <div className="col-12">
                <img className="img-fluid mx-auto d-block" src="/static/img/oak.png" />
            </div>
            <div className="row border bg-dark page-center">
                <div className="text-white text-left col-10">
                    {introText[currentIndex]}
                </div>
                <div className="col-2 d-flex justify-content-end">
                    {currentIndex < introText.length - 1 && (
                        <button className="btn btn-transparent" onClick={handleNextText} disabled={currentIndex === introText.length - 1}><i className="fa fa-toggle-down bg-dark text-white blinking"></i></button>
                    )}
                </div>
            </div>
            <div className="text-center">Please <a href="/login">Login</a> for better experience!</div>
        </React.Fragment>

    }
    const username = document.getElementById("username").innerHTML.trim();
    const text = [
        "Hello there! Welcome to the world of Pokémon!",
        "My name is Oak! People call me the Pokémon Prof!",
        "This world is inhabited by creatures called Pokémon!",
        "For some people, Pokémon are pets. Others use them for fights.",
        "Myself... I study Pokémon as a profession.",
        "Now, there are 3 Pokémon here. Haha! They are inside the Poké Balls.",
        "When I was young, I was a serious Pokémon trainer!",
        "In my old age, I have only 3 left, but you can have one! Choose!",
        `Be patient! ${username}, you can have one too!`,
        `Now ${username} which Pokémon do you want?`,
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



    function selectPokemon(evt) {
        setIsSelected(true);
        setCurrentIndex(0);
        //Capture selected pokemon
        capturePokemon(evt)
    }


    function PokeBall(props) {
        const [isHovered, setIsHovered] = React.useState(false);
        return (
            <div
                className="col-4"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isHovered ? (
                    <div className="row showHover d-flex justify-content-between flex-wrap">
                        <div className="col-12 col-md-5">
                            <img src={props.image} height="100rem" width="auto" />
                            <div>#{props.pokemon_id} {props.name}</div>
                        </div>
                        <div className="col-12 col-md-7">
                            <div>LV: {props.level}</div>
                            <div>HP: {props.stats.hp}</div>
                            <div>Attack: {props.stats.attack}</div>
                            <div>Defense: {props.stats.defense}</div>
                        </div>
                        <button className="btn btn-success btn-sm" onClick={selectPokemon}>I want you!</button>
                    </div>
                ) : (
                    <img className="img-fluid mx-auto d-block" src="static/img/pokeBall.png" width="50rem" height="auto" />
                )
                }
            </div >
        );
    }
    const pokeBalls = []
    for (let pokemon of startedPokemon) {
        pokeBalls.push(
            <PokeBall key={pokemon.pokemon_id}
                pokemon_id={pokemon.pokemon_id}
                name={pokemon.name}
                image={pokemon.image}
                level={pokemon.level}
                stats={pokemon.stats} />)
    }

    return (
        <React.Fragment >
            <div className="col-12 lab">
                <img className="mx-auto d-block oak-img" src="/static/img/oak.png" />
            </div>
            {(isSelected && (currentIndex === post_text.length - 1)) ? (
                <a href="/map_pokemons">
                    <div className="text-center blinking">Start your Journey</div>
                </a>
            ) : (
                <div className="text-center blinking">Click to continue</div>
            )}

            <div className="row d-flex flex-row flex-wrap">
                {!isSelected ? (
                    <div className="row border bg-dark page-center align-items-center">
                        <div className="text-white col-10">
                            {text[currentIndex]}
                        </div>
                        <div className="col-2 d-flex justify-content-end align-items-center">
                            {currentIndex < text.length - 1 && (
                                <button className="btn btn-transparent" onClick={handleNextText} disabled={currentIndex === text.length - 1}>
                                    <i className="fa fa-toggle-down bg-dark text-white blinking"></i>
                                </button>

                            )}
                        </div>

                    </div>
                ) : <div className="row border bg-dark page-center">
                    <div className="text-white col-10">
                        {post_text[currentIndex]}
                    </div>
                    <div className="col-2 d-flex justify-content-end align-items-center">
                        {currentIndex < post_text.length - 1 && (
                            <button className="btn btn-transparent" onClick={handleNextText}>
                                <i className="fa fa-toggle-down bg-dark text-white blinking"></i>
                            </button>

                        )}
                    </div>
                </div>}
            </div>
            {currentIndex === text.length - 1 && !isSelected && (
                <div className="row page-center my-2">{pokeBalls}</div>
            )}


        </React.Fragment >
    );
}

ReactDOM.render(<Homepage />, document.getElementById('homepage'));
