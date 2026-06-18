import { useState } from "react";
import Box from "./components/box";
import Button from "./components/button";
import TextField from "./components/textField";
import { LogIn } from "lucide-react";
import logo1 from "./svg/CESIZen logo1.svg";
import logo2 from "./svg/CESIZen logo2.svg";
import axios from "./utils/axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "./contexts/useSnackbar";

export default function AuthLayout() {
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
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
      .catch(() => {
        showMessage("Identifiants incorrects", "error");
      })
      .finally(() => setLoading(false));
  }
  return (
    <div className="h-screen p-5 flex flex-col items-center justify-center overflow-auto">
      <Box className="w-xl flex flex-col items-center">
        <img src={logo1} style={{ width: "100px" }} />
        <img src={logo2} style={{ width: "300px" }} />
        <h1>Bienvenuuuuue</h1>
        <form
          className="flex flex-col gap-3 my-5 && w-80"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
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
          <Button text="Se connecter" icon={LogIn} type="submit" loading={loading} />
        </form>
      </Box>
    </div>
  );
}
