function PlayerList() {
    //check if login
    const login = document.getElementById("username");

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
                <img src={pokemon.img} style={{ maxWidth: "50%", height: "auto", maxHeight: "100px" }} />
                <div>{pokemon.nickname}</div>
                <div>LV:{pokemon.level}</div>
            </div>)
        }
        return <div className="row border rounded">
            <div className="col-3 d-flex align-items-center justify-content-center">
                <div class="text-center">
                    <img className="img-fluid" src={props.player.img} style={{ maxHeight: "100px", width: "auto" }} />
                    <div>Username: {props.player.username}</div>
                    <div>Winning Rate: {props.player.winning_rate.win}/{props.player.winning_rate.lose}</div>
                    <form action="/battle" method="GET">
                        <input type="hidden" name="player_id" value={props.player.player_id} />
                        {login && <button className="btn btn-primary btn-sm" type="submit">Let's battle</button>}
                    </form>
                </div>

            </div>
            <div className="col-9 text-center">
                Pokemons
                <div className="row">
                    {pokemon_list}
                </div>
            </div>
        </div >
            ;
    }


    const player_list = []
    for (let player of players) {
        player_list.push(<PlayerInfo player={player} key={player.player_id} />)
    }

    return (
        <div>
            <div>{player_list}</div>
        </div>
    );
}

ReactDOM.render(<PlayerList />, document.getElementById('playerList'));
