import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import Box from "../components/box";
import TextField from "../components/textField";
import Button from "../components/button";
import axios from "../utils/axios";
import User from "../class/User";
import Select from "../components/select";
import Checkbox from "../components/checkbox";
import { useSnackbar } from "../hooks/useSnackbar";

export default function CreateUser() {
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const [user, setUser] = useState(new User());
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    axios
      .post("/utilisateur/create", user)
      .then(() => {
        showMessage("Utilisateur ajouté", "success");
        navigate("/main/users");
      })
      .catch((err) => {
        showMessage("Une erreur est survenue", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box>
      <div className="flex items-center mb-5">
        <button
          onClick={() => navigate("/main/users")}
          className="p-2 mr-4 rounded-lg hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1>Ajouter un utilisateur</h1>
      </div>
      <div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <TextField
            text="Nom"
            value={user.nom}
            onChange={(e) => setUser({ ...user, nom: e.target.value })}
          />
          <TextField
            text="Prénom"
            value={user.prenom}
            onChange={(e) => setUser({ ...user, prenom: e.target.value })}
          />
          <TextField
            text="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <TextField
            text="Mot de passe"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <Select
            text="Role"
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e as "admin" | "user" })}
            options={[
              { value: "user", label: "Utilisateur" },
              { value: "admin", label: "Administrateur" },
            ]}
          />
          <Checkbox
            text="Actif"
            checked={user.status}
            onChange={(e) => setUser({ ...user, status: e.target.checked })}
            className="w-fit"
          />
        </div>
        <div className="flex justify-end">
          <Button
            text="Créer"
            onClick={handleSubmit}
            loading={loading}
            icon={Check}
          />
        </div>
      </div>
    </Box>
  );
}
