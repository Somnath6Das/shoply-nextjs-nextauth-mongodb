export default function LoginPage({ searchParams }) {
  const error = searchParams.error; // "Invalid credentials"

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h1>Login Page</h1>
    </div>
  );
}
