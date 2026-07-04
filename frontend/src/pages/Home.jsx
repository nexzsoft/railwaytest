import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }, []);

  return (
    <div className="container">
      <h1>Welcome to Test SaaS</h1>

      <p>React + Railway + Vercel Demo</p>

      <button onClick={() => navigate("/signup")}>
        Signup
      </button>

      <button onClick={() => navigate("/login")}>
        Login
      </button>
    </div>
  );
}

export default Home;