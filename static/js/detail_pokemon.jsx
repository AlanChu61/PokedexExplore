function DetailPokemon(props) {
    const pokemon_id = props.pokemon_id
    const [pokemon, setPokemon] = React.useState({});
    const [nickname, setNickname] = React.useState("");
    const [comments, setComments] = React.useState([]);
    const [capturedDate, setCapturedDate] = React.useState("");
    const [isUpdateing, setIsUpdateing] = React.useState(false);
    // fecth data from API
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
        if (content == "") {
            alert("Please enter comment")
            return
        }
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
    function editComment(evt) {
        evt.preventDefault();
        const comment_id = parseInt(evt.target.parentNode.childNodes[0].innerHTML);
        const content = evt.target.parentNode.childNodes[1].innerHTML;
        const new_content = prompt("Please enter new comment", content);
        if (new_content == "") {
            alert("Please enter comment")
            return
        }
        else {
            fetch(`/update_comment/${comment_id}`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                }, body: JSON.stringify({
                    content: new_content,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    setComments((prevComments) => prevComments.map((comment) => {
                        if (comment.comment_id === comment_id) {
                            return { ...comment, content: new_content };
                        } else {
                            return comment;
                        }
                    }));
                });
        }
    }

    function deleteComment(evt) {
        evt.preventDefault();
        const comment_id = parseInt(evt.target.parentNode.childNodes[0].innerHTML);

        fetch(`/delete_comment/${comment_id}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setComments((prevComments) => prevComments.filter((comment) => comment.comment_id !== comment_id));
            });
    }

    function Comment(props) {
        return <div className="comment">
            <div hidden> {props.comment_id}</div>
            <li> {props.content}</li>
            <li> {props.createdDate}</li>
            <button onClick={editComment}>Edit</button>
            <button onClick={deleteComment}>Delete</button>
        </div >
    }
    const commentList = []
    for (let comment of comments) {
        commentList.push(
            <Comment
                key={comment.comment_id}
                comment_id={comment.comment_id}
                content={comment.content}
                createdDate={comment.created_date}
            />
        );
    }


    function Pokemon(props) {
        return (
            <div className="detailPokemon row">
                <div className="col-6">
                    <h2>{props.nickname}'s info</h2>
                    <img src={props.pokemon.image} alt="pokemon image" />
                    <div>Nickname: {props.nickname}
                        <button onClick={handleEdit}>Edit</button></div>
                    <div>Id: {props.pokemon.pokemon_id}</div>
                    <div>Name: {props.pokemon.name}</div>
                    <div>Captured Date:{props.captureDate}</div>
                    More details...
                </div>
                <div className="col-6">
                    <h2>Comments</h2>
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
