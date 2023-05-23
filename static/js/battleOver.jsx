function BattleOver(props) {
    const playerInfo = props.player;
    const opponentInfo = props.opponent;
    const setPlayerInfo = props.setPlayer;
    const setOpponentInfo = props.setOpponent;
    const playerPokemons = props.playerPokemons
    const opponentPokemons = props.opponentPokemons
    const [winner, setWinner] = React.useState("")
    React.useEffect(() => {
        if (opponentPokemons.length === 0) {
            setWinner(playerInfo);
        } else {
            setWinner(opponentInfo);
        }
    }, [playerInfo, opponentInfo]);


    function handleIncreaseWin() {
        fetch('/handle_win', {
            method: 'PUT',
            body: JSON.stringify({
                player_id: playerInfo.player_id,
                opponent_id: opponentInfo.player_id
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data.player)
                setPlayerInfo(data.player);
                setOpponentInfo(data.opponent);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }



    function PlayerPokemon(props) {
        function handleAddComment(evt) {
            console.log(props)
            evt.preventDefault();
            const content = prompt("Enter Some comment", `${props.nickname} is so awseome!`)
            if (content == "") {
                alert("Please enter comment")
                return
            }
            fetch(`/create_comment/${props.pokemon_id}`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                }, body: JSON.stringify({
                    content: content,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("comment added")
                });
        }

        return <div className={`pokemon col-4 card `} key={props.nickname}>
            <div>
                <a href={`detail_pokemon/${props.pokemon_id}`}>
                    <img src={props.front_default} />
                </a>
            </div>

            <div>{props.nickname.toUpperCase()}</div>
            <div>LV: {props.level}</div>
            <button onClick={handleAddComment}>Leave some comments</button>
        </div >
    }

    const playerPokemonList = []
    for (const pokemon of playerPokemons) {
        playerPokemonList.push(
            <PlayerPokemon
                key={pokemon.pokemon_id}
                pokemon_id={pokemon.pokemon_id}
                nickname={pokemon.nickname}
                level={pokemon.level}
                front_default={pokemon.front_default}
            />,
        )
    }



    return (
        <React.Fragment>
            <div className="row">
                <div className="col-3">
                    <img src={playerInfo.img} width="100px" />
                    <div>{playerInfo.username}</div>
                    <div>Win:{playerInfo.winning_rate.win}
                        {winner == playerInfo && <button onClick={handleIncreaseWin}>+1</button>}</div>
                    <div>Lose:{playerInfo.winning_rate.lose}
                        {winner != playerInfo && <button onClick={handleIncreaseWin}>+1</button>}</div>
                </div>
                <div className="col-9">
                    <div className="row">
                        {playerPokemonList}
                    </div>
                </div>
            </div >

            <div className="row">< div className="col-12" >
                {winner == playerInfo ? <h1 className="text-center">You Win!</h1> : <h1 className="text-center">You Lose!</h1>
                }
            </div >
            </div>
            <a href="/battle">Back to Battle</a>
        </React.Fragment>)

}