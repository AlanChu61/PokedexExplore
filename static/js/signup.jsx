function Signup() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [username, setUsername] = React.useState("");

    return <div className="centered-element">
        <h1>Signup</h1>
        <form action="/signup" method="POST">
            <div className="form-group">
                <label htmlFor="email" >Email:</label>
                <input type="text" className="form-control" id="email" name="email" value={email} onChange={evt => setEmail(evt.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="text" className="form-control" id="password" name="password" value={password} onChange={evt => setPassword(evt.target.value)} />
            </div>
            <div>
                <label htmlFor="username" >Username:</label>
                <input type="text" className="form-control" id="username" name="username" value={username} onChange={evt => setUsername(evt.target.value)} />
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>;
}
ReactDOM.render(<Signup />, document.getElementById('signup_form'));
