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
        fetch(`/update_pokemon/${pokemon_id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                nickname: newNickname,
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
            <div className="card">
                <div className="card-header">
                    {player} @{" "}
                    <span className="card-subtitle mb-2 text-muted">
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
                        <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                    const newContent = prompt("Please enter new comment", content);
                                    if (newContent !== null && newContent.trim() !== "") {
                                        editComment(commentId, newContent);
                                    } else {
                                        alert("Please enter comment");
                                    }
                                }}>
                                EDIT
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
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
            <div className="row">
                <div className="col-12 text-center">
                    <h1>{nickname.toUpperCase()}'s INFORMATION</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <img src={pokemon.image} alt="pokemon image" style={{ maxWidth: "100%" }} />
                    <div>
                        #{pokemon.pokemon_id} {pokemon.name}
                    </div>
                    <div>
                        Nickname: {nickname.toUpperCase()}{" "}
                        {!isUpdating ? (
                            <button className="btn btn-light btn-sm" onClick={handleEdit}>
                                Edit
                            </button>
                        ) : (
                            <form id="updateForm" onSubmit={handleUpdate}>
                                <input type="text" id="updateInput" placeholder={nickname.toUpperCase()} />
                                <button type="submit">Save</button>
                            </form>
                        )}
                    </div>

                    <div>LV: {level}</div>
                    <table className="table">
                        <thead>
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
                    <div>
                        Captured Date:{" "}
                        {new Date(capturedDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>
                <div className="col-6">
                    <h2>Comments</h2>
                    {commentList}
                    <form onSubmit={addComment}>
                        <div className="form-group">
                            <label htmlFor="commentForm">Add more comment:</label>
                            <input type="text" className="form-control" id="commentForm" name="content" />
                            <button type="submit" className="btn btn-primary btn-sm">
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>


            <div className="d-flex justify-content-center">
                <a href="/view_pokemons">See other fellows</a>
            </div>

        </React.Fragment>
    );
}

const pokemon_id = document.getElementById("pokemon_id").innerText.split(":")[1];
ReactDOM.render(
    <DetailPokemon pokemon_id={pokemon_id} />,
    document.getElementById("pokemon_detail")
);
