function PlayerList() {
    const [players, setPlayers] = React.useState([]);

    React.useEffect(() => {
        fetch('/player_list_json')
            .then(response => response.json())
            .then(data => {
                setPlayers(data.players);
            });
    }, []);

    function PlayerInfo(props) {
        const pokemon_list = []
        for (let pokemon of props.player.pokemons) {
            pokemon_list.push(<div className="col-4" key={pokemon.pokemon_id}>
                <img src={pokemon.img} width="100px" height="100px" />
                <p>{pokemon.nickname}</p>
                <p>LV:{pokemon.level}</p>
            </div>)
        }
        return <div className="row">
            <div className="col-3">
                <img src={props.player.img} width="50px" height="100px" />
                <p>{props.player.username}
                </p>
                <p>Win:{props.player.winning_rate.Win} Lose:{props.player.winning_rate.Lose}</p>
                <form action="/battle" method="GET">
                    <input type="hidden" name="player_id" value={props.player.player_id} />
                    <button type="submit">Let's battle</button>
                </form>

            </div>
            <div className="col-9">
                PokemonList:
                <div className="row">
                    {pokemon_list}
                </div>
            </div>
        </div>
            ;
    }


    const player_list = []
    for (let player of players) {
        player_list.push(<PlayerInfo player={player} key={player.player_id} />)
    }

    return (
        <div>
            <h1>Player List</h1>
            <div>{player_list}</div>
        </div>
    );
}

ReactDOM.render(<PlayerList />, document.getElementById('playerList'));
