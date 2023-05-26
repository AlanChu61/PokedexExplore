function Profile() {
    const userInfo = document.getElementById('userInfo');
    const email = userInfo.children[3].innerHTML.split(":")[1].trim();
    const [username, setUsername] = React.useState(userInfo.children[2].innerHTML.split(":")[1].trim());
    const [uploadUrl, setUploadUrl] = React.useState(userInfo.children[0].getAttribute("src"));
    console.log("src", userInfo.children[0].getAttribute("src"))
    console.log(uploadUrl)
    const [fileSelected, setFileSelected] = React.useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFileSelected(true);

        if (selectedFile) {
            const formData = new FormData();
            formData.append('image', selectedFile);

            fetch('/upload', {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    setUploadUrl(data.url);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const handleUpdateForm = async (e) => {
        e.preventDefault();

        const response = await fetch('/update_profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                uploadUrl: uploadUrl,
            })
        });

        if (response.ok) {
            const data = await response.json();
            setUsername(data.username);
            setUploadUrl(data.uploadUrl);
        } else {
            console.log(response);
        }
    };

    return (
        <div className="centered-element">
            <h1>{username}'s Profile</h1>
            <img src={uploadUrl} alt="profile image" width="200px" />
            <form onSubmit={handleUpdateForm}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="email"
                        name="email"
                        value={email}
                        placeholder={email}
                        disabled
                    />
                </div>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(evt) => setUsername(evt.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Choose Image</label>
                    <input
                        type="file"
                        className="form-control-file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {fileSelected && <span>&#10004;</span>}
                </div>
                {uploadUrl && (
                    <div className="form-group">
                        <label htmlFor="image">Image Preview</label>
                        <input type="hidden" name="imageUrl" value={uploadUrl} />
                        <img src={uploadUrl} alt="image preview" width="100px" />
                    </div>
                )}
                <button type="submit" className="btn btn-primary">
                    Update
                </button>
            </form>
        </div>
    );
}

ReactDOM.render(<Profile />, document.getElementById('profileForm'));
