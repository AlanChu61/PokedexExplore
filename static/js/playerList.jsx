function PlayerList() {
    //check if login
    const login = document.getElementById("username");
    const [isOkABattle, setIsOkABattle] = React.useState(false);
    const [players, setPlayers] = React.useState([]);
    const [battleMode, setBattleMode] = React.useState("")

    React.useEffect(() => {
        fetch('/battle_players_json')
            .then(response => response.json())
            .then(data => {
                setPlayers(data.players);
            });
    }, []);

    function PlayerInfo(props) {
        const pokemonList = []
        for (let pokemon of props.player.pokemons) {
            pokemonList.push(<div className="col-4" key={pokemon.pokemon_id}>
                <img src={pokemon.img} style={{ maxWidth: "50%", height: "auto", maxHeight: "100px" }} />
                <div>{pokemon.nickname}</div>
                <div>LV:{pokemon.level}</div>
            </div>)
        }
        return <div className="row border rounded">
            <div className="col-3 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <img className="img-fluid" src={props.player.img} style={{ maxHeight: "100px", width: "auto" }} />
                    <div>Username: {props.player.username}</div>
                    <div>Winning Rate: {props.player.winning_rate.win}/{props.player.winning_rate.lose}</div>
                    <form action="/battle" method="GET">
                        <input type="hidden" name="player_id" value={props.player.player_id} />
                        <input type="hidden" name="battle_mode" value={battleMode} />
                        {login && isOkABattle && <button className="btn btn-primary btn-sm" type="submit" >Let's battle</button>}
                    </form>
                </div>

            </div>
            <div className="col-9 text-center">
                Pokemons
                <div className="row">
                    {pokemonList}
                </div>
            </div>
        </div >
            ;
    }
    const handleBattleMode = (battleMode) => {
        const otherPlayers = players.filter(player => player.player_id !== login.value);
        const hasEnoughPokemon = otherPlayers.every(player => player.pokemons.length >= battleMode);

        if (hasEnoughPokemon) {
            setIsOkABattle(true);
            setBattleMode(battleMode);
        } else {
            alert("Some players don't have enough Pokémon for this battle mode.");
        }
    };

    const playeList = []
    for (let player of players) {
        playeList.push(<PlayerInfo player={player} key={player.player_id} />)
    }

    return (
        <React.Fragment>
            <h1>Battle instruction:</h1>
            <div>First, make sure you have at least One Pokémon.</div>
            <div>Next, select the number of battles you want to engage in.</div>
            <div>Finally, choose the player you want to battle against.</div>
            <button onClick={() => handleBattleMode(1)}>1v1</button>
            <button onClick={() => handleBattleMode(2)}>2v2</button>
            <button onClick={() => handleBattleMode(3)}>3v3</button>
            <div>{playeList}</div>
        </React.Fragment>
    );
}

ReactDOM.render(<PlayerList />, document.getElementById('playerList'));
