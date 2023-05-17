function Homepage() {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [startedPokemon, setStartedPokemon] = React.useState([]);
    const text = [
        "Hello there! Welcome to the world of Pokémon!",
        "My name is Oak! People call me the Pokémon Prof!",
        "This world is inhabited by creatures called Pokémon!",
        "For some people, Pokémon are pets. Others use them for fights.",
        "Myself... I study Pokémon as a profession.",
        "First, what is your name?",
        "Right! So your name is ",
        "Your very own Pokémon legend is about to unfold! A world of dreams and adventures with Pokémon awaits! Let's go!",
    ];

    const handleNextText = () => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
    };

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
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                handleNextText();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);



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
                        <div>Name: {props.name}</div>
                        <div>Level: {props.level}</div>
                        <div>HP: {props.stats.hp}</div>
                        <div>Attack: {props.stats.attack}</div>
                        <div>Defense: {props.stats.defense}</div>
                    </div>
                ) : (
                    <img src="static/img/pokeBall.png" width="50px" height="50px" />

                )}
            </div>
        );
    }
    const pokeBalls = []
    for (let pokemon of startedPokemon) {
        pokeBalls.push(
            <PokeBall key={pokemon.id}
                name={pokemon.name}
                image={pokemon.image}
                level={pokemon.level}
                stats={pokemon.stats} />)
    }
    return (
        <React.Fragment>
            <div className="row">
                <div className="textBox col-8">
                    {text[currentIndex]}
                    {currentIndex < text.length - 1 && (
                        <button onClick={handleNextText}>Press enter to continue</button>)}
                </div>
                <div className="col-4">
                    <img src="/static/img/oak.png" width="45px" />
                </div>
            </div>
            {currentIndex === text.length - 1 && (
                <div className="row">{pokeBalls}</div>
            )}
        </React.Fragment >
    );
}

ReactDOM.render(<Homepage />, document.getElementById('root'));
