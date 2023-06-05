function DetailPokemon(props) {
    const pokemon_id = props.pokemon_id;
    const [pokemon, setPokemon] = React.useState(null);
    const [nickname, setNickname] = React.useState("");
    const [level, setLevel] = React.useState(0);
    const [stats, setStats] = React.useState({});
    const [comments, setComments] = React.useState([]);
    const [capturedDate, setCapturedDate] = React.useState("");
    const [isUpdating, setIsUpdating] = React.useState(false);
    // Fetch data from API
    React.useEffect(() => {
        fetch(`/detail_pokemon_json/${pokemon_id}`)
            .then((response) => response.json())
            .then((data) => {
                const { kind_info, nickname, level, stats, captured_date, comments } = data.pokemon;
                setPokemon(kind_info);
                setNickname(nickname);
                setLevel(level);
                setStats(stats);
                setCapturedDate(captured_date);
                setComments(comments);
            });
    }, [pokemon_id]);

    function handleEdit(evt) {
        evt.preventDefault();
        setIsUpdating(true);
    }

    function handleUpdate(evt) {
        evt.preventDefault();
        const newNickname = evt.target.elements.updateInput.value;
        if (newNickname === "") {
            alert("Please enter nickname");
            return;
        }
        fetch(`/update_pokemon/${pokemon_id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                nickname: newNickname.toLowerCase(),
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setIsUpdating(false);
                setNickname(newNickname);
            });
    }

    function addComment(evt) {
        evt.preventDefault();
        const content = evt.target.elements.content.value;
        if (content === "") {
            alert("Please enter comment");
            return;
        }
        fetch(`/create_comment/${pokemon_id}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                content: content,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setComments((prevComments) => [...prevComments, data.comment]);
                document.getElementById("commentForm").value = "";
                alert("Comment added");
            });
    }

    function editComment(commentId, newContent) {
        fetch(`/update_comment/${commentId}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                content: newContent,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setComments((prevComments) =>
                    prevComments.map((comment) => {
                        if (comment.comment_id === commentId) {
                            return { ...comment, content: newContent };
                        } else {
                            return comment;
                        }
                    })
                );
            });
    }

    function deleteComment(commentId) {
        fetch(`/delete_comment/${commentId}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setComments((prevComments) =>
                    prevComments.filter((comment) => comment.comment_id !== commentId)
                );
            });
    }

    function Comment({ commentId, content, createdDate, player }) {
        return (
            <div className="card my-2">
                <div className="card-header pokedex-blue text-white">
                    {player} @{" "}
                    <span className="card-subtitle mb-2 text-light">
                        {new Date(createdDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                </div>
                <div className="card-body">
                    <div className="card-text">
                        {content}
                        <div className="card-text d-flex justify-content-end mt-2 offset-6 col-6">

                            <button
                                type="button"
                                className="btn btn-sm mr-2 text-white pokedex-green w-100"
                                onClick={() => {
                                    const newContent = prompt("Please enter new comment", content);
                                    if (newContent !== null && newContent.trim() !== "") {
                                        editComment(commentId, newContent);
                                    } else {
                                        alert("Please enter comment");
                                    }
                                }}
                            >
                                EDIT
                            </button>
                            <button
                                type="button"
                                className="btn  btn-sm text-white pokedex-bg w-100"
                                onClick={() => deleteComment(commentId)}
                            >
                                DELETE
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        );
    }



    const commentList = comments.map(({ comment_id, content, created_date, player }) => (
        <Comment
            key={comment_id}
            commentId={comment_id}
            content={content}
            createdDate={created_date}
            player={player}
        />
    ));

    if (pokemon === null) {
        return <div>Loading...</div>;
    }
    return (
        <React.Fragment>
            <div className="row ">
                <div className="col-12 text-center">
                    <h1>{nickname.toUpperCase()}'s INFORMATION</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <img src={pokemon.image} alt="pokemon image" style={{ maxWidth: "100%" }} />
                </div>
                <div className="col-6">
                    <div className="row ">
                        <div className="border border-danger rounded  p-0">
                            <div className="pokedex-bg text-white px-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-pokeball" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <circle cx="9" cy="9" r="9" transform="translate(3 3)" /> <circle cx="12" cy="12" r="3" /> <path d="M3 12h6m6 0h6" /></svg>
                                {""}{pokemon.pokemon_id} {pokemon.name}
                            </div>
                            <div className="px-2">
                                Nickname: {nickname.toUpperCase()}{" "}  {!isUpdating ? (
                                    <button className="btn btn-light btn-sm" onClick={handleEdit}>
                                        Edit
                                    </button>
                                ) : (
                                    <form id="updateForm" onSubmit={handleUpdate}>
                                        <input type="text" id="updateInput" defaultValue={nickname.toUpperCase()} />
                                        <button className="btn btn-sm btn-info" type="submit">Save</button>
                                        <button className="btn btn-sm btn-info" type="button" onClick={() => setIsUpdating(false)}>Cancel</button>
                                    </form>

                                )}
                            </div>

                        </div>

                    </div>
                    <div className="row">
                        <div className="border border-success rounded my-3 offset-2 col-10 p-0">
                            <div className="row">
                                <div className="col-6 ">
                                    <div className="pokedex-green font-weight-bold text-white px-2">LV:</div>
                                </div>
                                <div className="col-6">{level}</div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <div className="pokedex-green font-weight-bold text-white px-2">Captured Date:</div>
                                </div>
                                <div className="col-6">
                                    {new Date(capturedDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 p-0">
                            <div className="border border-primary rounded">
                                <table className="table pokeStat-table w-100">
                                    <thead className="pokedex-blue text-white">
                                        <tr>
                                            <th colSpan="2">Stats</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(stats).map(([stat, value]) => (
                                            <tr key={stat}>
                                                <td>{stat}</td>
                                                <td>{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>



                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <h2>Comments</h2>
                    {comments.length === 0 && <div className="alert alert-info">No comments yet</div>}
                    {commentList}
                    <form onSubmit={addComment}>
                        <div className="form-row">
                            <div className="card-header pokedex-gray text-dark">
                                <label htmlFor="commentForm">Add more comment:</label>
                            </div>
                            <div className="col">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="commentForm"
                                        name="content"
                                        placeholder={`${nickname.toUpperCase()} is my lovely Pokemon!`}
                                    />
                                    <div className="input-group-append">
                                        <button type="submit" className="btn btn-primary">Add</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </div>



            <div className="d-flex justify-content-center">
                <a href="/view_pokemons">See other fellows</a>
            </div>

        </React.Fragment >
    );
}

const pokemon_id = document.getElementById("pokemon_id").innerText.split(":")[1];
ReactDOM.render(
    <DetailPokemon pokemon_id={pokemon_id} />,
    document.getElementById("pokemon_detail")
);
