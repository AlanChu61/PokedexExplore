function Signup() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [username, setUsername] = React.useState("");

    return <form action="/signup" method="POST">
        <div class="form-group">
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" name="email" value={email} onChange={evt => setEmail(evt.target.value)} />
        </div>
        <div class="form-group">
            <label htmlFor="password">Password:</label>
            <input type="text" id="password" name="password" value={password} onChange={evt => setPassword(evt.target.value)} />
        </div>
        <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" value={username} onChange={evt => setUsername(evt.target.value)} />
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>;
}
ReactDOM.render(<Signup />, document.getElementById('signup_form'));
