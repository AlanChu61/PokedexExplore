function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    return <form action="/login" method="POST">
        <div>
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" name="email" value={email} onChange={evt => setEmail(evt.target.value)} />
        </div>
        <div>
            <label htmlFor="password">Password:</label>
            <input type="text" id="password" name="password" value={password} onChange={evt => setPassword(evt.target.value)} />
        </div>
        <button type="submit">Login</button>
    </form>;
}
ReactDOM.render(<Login />, document.getElementById('login_form'));
