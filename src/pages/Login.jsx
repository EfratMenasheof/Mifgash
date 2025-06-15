function Login() {
  return (
    <div className="container text-center mt-5">
      <h2>Welcome to Mifgash!</h2>
      <a href={`${import.meta.env.VITE_BACKEND_URL}/auth/google`}>
        <button className="btn btn-primary mt-3">Login with Google</button>
      </a>
    </div>
  );
}

export default Login;