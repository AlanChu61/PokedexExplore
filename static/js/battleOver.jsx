function BattleOver(props) {
    const playerInfo = props.player;
    const opponentInfo = props.opponent;
    const setPlayerInfo = props.setPlayer;
    const setOpponentInfo = props.setOpponent;
    const playerPokemons = props.playerPokemons
    const opponentPokemons = props.opponentPokemons
    const [winner, setWinner] = React.useState("")
    const [isWinBtnClicked, setIsWinBtnClicked] = React.useState(false)
    const [isLoseBtnClicked, setIsLoseBtnClicked] = React.useState(false)

    React.useEffect(() => {
        if (opponentPokemons.length == 0) {
            setWinner(playerInfo);

        } else {
            setWinner(opponentInfo);
        }
    }, [playerInfo, opponentInfo, winner]);


    function handleIncreaseWin(evt) {
        evt.preventDefault();
        setIsWinBtnClicked(true)
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
                setPlayerInfo(data.player);
                setOpponentInfo(data.opponent);

            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function handleIncreaseLose(evt) {
        evt.preventDefault();
        setIsLoseBtnClicked(true)
        fetch('/handle_lose', {
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
                setPlayerInfo(data.player);
                setOpponentInfo(data.opponent);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function PlayerPokemon(props) {

        function handleAddComment(evt) {
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

        return <div className={`pokemon col-6 card`} key={props.nickname}>
            <div>
                <a href={`detail_pokemon/${props.pokemon_id}`}>
                    <img src={props.front_default} />
                </a>
            </div>
            <div>{props.nickname.toUpperCase()}</div>
            <div>LV: {props.level}</div>
            <button className="btn btn-info" onClick={handleAddComment}>Leave some comments</button>
        </div >
    }

    function OpponentPokemon(props) {
        return <div className={`pokemon col-6 card`} key={props.nickname}>
            <div>
                <img src={props.front_default} />
            </div>
            <div>{props.nickname.toUpperCase()}</div>
            <div>LV: {props.level}</div>
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
    const opponentPokemonList = []
    for (const pokemon of opponentPokemons) {
        opponentPokemonList.push(
            <OpponentPokemon
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
                <div className="col-9">
                    <div className="row">
                        {opponentPokemonList}
                    </div>
                </div>
                <div className="col-3">
                    <img src={opponentInfo.img} width="100px" />
                    <div>{opponentInfo.username}</div>
                    <div>Win:{opponentInfo.winning_rate.win}
                    </div>
                    <div>Lose:{opponentInfo.winning_rate.lose}
                    </div>
                </div>

            </div >


            <div className="row">< div className="col-12" >
                {winner == playerInfo ? <h1 className="text-center">You Win!</h1> : <h1 className="text-center">You Lose!</h1>
                }
            </div >
            </div>
            <div className="row">
                <div className="col-3">
                    <img src={playerInfo.img} width="100px" />
                    <div>{playerInfo.username}</div>
                    <div>Win:{playerInfo.winning_rate.win}
                        {winner == playerInfo &&
                            <button className="btn btn-success" hidden={isWinBtnClicked} onClick={handleIncreaseWin}> +1 </button>}</div>
                    <div>Lose:{playerInfo.winning_rate.lose}
                        {winner == opponentInfo && (
                            <button className="btn btn-danger" hidden={isLoseBtnClicked} onClick={handleIncreaseLose}> +1 </button>)
                        }</div>

                </div>
                <div className="col-9">
                    <div className="row">
                        {playerPokemonList}
                    </div>
                </div>
            </div >
            <a className="text-center" href="/player_list">
                <div className="text-center">
                    Battle with others
                </div>
            </a>
        </React.Fragment >)

}