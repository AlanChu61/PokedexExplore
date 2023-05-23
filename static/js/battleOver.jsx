function BattleOver(props) {
    const playerInfo = props.player;
    const opponentInfo = props.opponent;
    const setPlayerInfo = props.setPlayer;
    const setOpponentInfo = props.setOpponent;
    const playerPokemon = props.playerPokemons
    const opponentPokemon = props.opponentPokemons
    const [winner, setWinner] = React.useState("")
    React.useEffect(() => {
        if (opponentPokemon.length === 0) {
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
                    Pokemon List
                    add comment
                    level up
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