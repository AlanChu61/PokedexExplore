function Signup() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [uploadUrl, setUploadUrl] = React.useState("");
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


    return <div className="centered-element">
        <h1>Signup</h1>
        <form action="/signup" method="POST">
            <div className="form-group">
                <label htmlFor="email" >Email:</label>
                <input type="email" className="form-control" id="email" name="email" value={email} onChange={evt => setEmail(evt.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" className="form-control" id="password" name="password" value={password} onChange={evt => setPassword(evt.target.value)} />
            </div>
            <div>
                <label htmlFor="username" >Username:</label>
                <input type="text" className="form-control" id="username" name="username" value={username} onChange={evt => setUsername(evt.target.value)} />
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
            {uploadUrl && <div className="form-group">
                <label htmlFor="image">Image Preview</label>
                <input type="hidden" name="imageUrl" value={uploadUrl} />
                <img src={uploadUrl} alt="image preview" width="100px" />
            </div>
            }
            <div className="d-flex justify-content-end my-2">
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </form>
    </div>;
}
ReactDOM.render(<Signup />, document.getElementById('signup_form'));
