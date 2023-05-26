function DetailPokemon(props) {
    const pokemon_id = props.pokemon_id
    const [pokemon, setPokemon] = React.useState({});
    const [nickname, setNickname] = React.useState("");
    const [level, setLevel] = React.useState(0);
    const [stats, setStats] = React.useState({});
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
                setLevel(data.pokemon.level)
                setStats(data.pokemon.stats);
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
            <code>{props.content}</code>
            <em>
                @{new Date(props.createdDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </em>
            <button type="button" class="btn btn-secondary btn-sm" onClick={editComment}>EDIT</button>
            <button type="button" class="btn btn-secondary btn-sm" onClick={deleteComment}>DELETE</button>
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
            <div className="row">
                <div className="col-6">
                    <h2>{props.nickname}'s INFORMATION</h2>
                    <img src={props.pokemon.image} alt="pokemon image" />
                    <div>Nickname: {props.nickname.toUpperCase()}
                        <div>#{props.pokemon.pokemon_id} {props.pokemon.name}
                            <button onClick={handleEdit}>Edit</button></div>
                    </div>
                    <div>LV: {props.level}</div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th colspan="2">Stats</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(props.stats).map(([stat, value]) => (
                                <tr key={stat}>
                                    <td>{stat}</td>
                                    <td>{value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div>Captured Date: {new Date(props.captureDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>

                </div>
                <div className="col-6">
                    <h2>Comments</h2>
                    {commentList}
                    <form onSubmit={addComment}>
                        <div class="form-group">
                            <label htmlFor="commentForm">Please add new comment:</label>
                            <input type="text" className="form-control" id="commentForm" name="content" />
                            <button type="submit" className="btn btn-primary">Add</button>
                        </div>
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
                    <Pokemon pokemon={pokemon} nickname={nickname}
                        level={level}
                        stats={stats}
                        captureDate={capturedDate} />
                    {isUpdateing && <UpdateForm />}
                </div>


                <a href="/view_pokemons">See fellow</a>

            </div>
        );
    }

}

const pokemon_id = document.getElementById('pokemon_id').innerText.split(':')[1];
ReactDOM.render(<DetailPokemon pokemon_id={pokemon_id} />, document.getElementById('pokemon_detail'));
