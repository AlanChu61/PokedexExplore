function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    return <div className="centered-element">
        <h1>Login</h1>
        <form action="/login" method="POST">
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="text" className="form-control" id="email" name="email" value={email} placeholder="Enter email" onChange={evt => setEmail(evt.target.value)} />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="text" className="form-control" id="password" name="password" value={password} placeholder="Password" onChange={evt => setPassword(evt.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
        </form></div >
}
ReactDOM.render(<Login />, document.getElementById('login_form'));
