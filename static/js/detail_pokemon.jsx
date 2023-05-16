function DetailPokemon(props) {

    // fecth data from API
    const [pokemon, setPokemon] = React.useState({});
    const [pokemon_id, setPokemonId] = React.useState(props.pokemon_id);
    const [nickname, setNickname] = React.useState("");
    const [comments, setComments] = React.useState([]);
    const [capturedDate, setCapturedDate] = React.useState("");
    const [isUpdateing, setIsUpdateing] = React.useState(false);
    React.useEffect(() => {
        fetch(`/detail_pokemon_json/${props.pokemon_id}`)
            .then((response) => response.json())
            .then((data) => {
                setPokemon(data.pokemon.kind_info);
                setNickname(data.pokemon.nickname);
                setCapturedDate(data.pokemon.captured_date);
                setComments(data.pokemon.comments);
            });

    }, []);
    function handleEdit(evt) {
        evt.preventDefault();
        setIsUpdateing(true);
    }
    function handleUpdate(evt) {
        const new_nickname = evt.target.firstChild.value;
        evt.preventDefault();
        fetch(`/update_pokemon/${pokemon_id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            }, body: JSON.stringify({
                nickname: new_nickname,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setIsUpdateing(false);
                setNickname(new_nickname);
            });
    }
    function addComment(evt) {
        evt.preventDefault();
        const content = evt.target.childNodes[1].value
        fetch(`/create_comment/${pokemon_id}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            }, body: JSON.stringify({
                content: content,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setComments((prevComments) => [...prevComments, data.comment]);
            });
    }


    function Comment(props) {
        return <div className="comment">
            <div>Comment: {props.content} on {props.createdDate}</div>
        </div >
    }
    const commentList = []
    for (let comment of comments) {
        commentList.push(
            <Comment
                key={comment.comment_id}
                content={comment.content}
                createdDate={comment.created_date}
            />
        );
    }


    function Pokemon(props) {
        return (
            <div className="detailPokemon row">
                <div className="col-6">
                    <img src={props.pokemon.image} alt="pokemon image" />
                    <div>nickname: {props.nickname}</div>
                    <div>id: {props.pokemon.pokemon_id}</div>
                    <div>name: {props.pokemon.name}</div>
                    <div>Captured Date:{props.captureDate}</div>
                    More details...
                    <button onClick={handleEdit}>Edit</button>
                </div> <div className="col-6">
                    <h1>here is comment</h1>
                    I want to add comment or edit comment here
                    {commentList}
                    <form onSubmit={addComment}>
                        <label htmlFor="commentForm">Please add comment:</label>
                        <input type="text" id="commentForm" name="content" />
                        <button type="submit">Add</button>
                    </form>
                </div></div>
        );
    }
    function UpdateForm() {
        return (
            <form onSubmit={handleUpdate}>
                <input type="text" id="updateForm" />
                <button type="submit">Save</button>
            </form>
        );
    }

    if (pokemon == null) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <h1>Detail Pokemon</h1>
                <div>
                    <Pokemon pokemon={pokemon} nickname={nickname} captureDate={capturedDate} />
                    {isUpdateing && <UpdateForm />}
                </div>

                <button>
                    <a href="/view_pokemons">See others</a>
                </button>
            </div>
        );
    }

}

const pokemon_id = document.getElementById('pokemon_id').innerText.split(':')[1];
ReactDOM.render(<DetailPokemon pokemon_id={pokemon_id} />, document.getElementById('pokemon_detail'));
