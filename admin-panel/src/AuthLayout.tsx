import { useState } from "react";
import Box from "./components/box";
import Button from "./components/button";
import TextField from "./components/textField";
import { LogIn } from "lucide-react";
import logo1 from "./svg/CESIZen logo1.svg";
import logo2 from "./svg/CESIZen logo2.svg";
import { useUser } from "./contexts/UserProviter";
import axios from "./utils/axios";

export default function AuthLayout() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const { setUser } = useUser();

  function handleLogin() {
    setLoading(true);
    axios
      .post("/utilisateur/login", { email, password })
      .then((res) => {
        setUser(res.data);
      })
      .finally(() => setLoading(false));
  }
  return (
    <div className="h-screen p-5 flex flex-col items-center justify-center overflow-auto">
      <img src={logo1} style={{ width: "100px" }} />
      <img src={logo2} style={{ width: "300px" }} />
      <Box className="w-xl">
        <h1>Bienvenue</h1>
        <div className="flex flex-col my-5">
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
