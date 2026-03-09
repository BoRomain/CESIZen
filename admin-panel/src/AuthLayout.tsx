import { useState } from "react";
import Box from "./components/box";
import Button from "./components/button";
import TextField from "./components/textField";
import { LogIn } from "lucide-react";
import logo1 from "./svg/CESIZen logo1.svg";
import logo2 from "./svg/CESIZen logo2.svg";
import axios from "./utils/axios";
import { useNavigate } from "react-router-dom";

export default function AuthLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    setLoading(true);
    axios
      .post("/admin/login", { email, password })
      .then((res) => {
        localStorage.setItem("accessToken", res.data.accessToken);
        navigate("/main");
      })
      .finally(() => setLoading(false));
  }
  return (
    <div className="h-screen p-5 flex flex-col items-center justify-center overflow-auto">
      <Box className="w-xl flex flex-col items-center">
        <img src={logo1} style={{ width: "100px" }} />
        <img src={logo2} style={{ width: "300px" }} />
        <h1>Bienvenue</h1>
        <div className="flex flex-col gap-3 my-5 && w-80">
          <TextField
            text="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            text="mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          text="Se connecter"
          icon={LogIn}
          onClick={handleLogin}
          loading={loading}
        />
      </Box>
    </div>
  );
}
