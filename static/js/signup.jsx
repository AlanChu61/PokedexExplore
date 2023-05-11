function Signup() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [username, setUsername] = React.useState("");

    const handleSumbit = (evt) => {
        evt.preventDefault();

        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                username: username
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.status)
            });
        if (data.redirect) {
            window.location.href = data.redirect;
        }
    }

    return <form onSubmit={handleSumbit}>
        <div>
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
            <label htmlFor="password">Password:</label>
            <input type="text" id="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <button type="submit">Sign up</button>
    </form>

}
ReactDOM.render(<Signup />, document.getElementById('signup_form'));
