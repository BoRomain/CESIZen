import { use, useEffect, useMemo, useState } from "react";
import Box from "../components/box";
import axios from "../utils/axios";
import UserFilter from "../class/Filters/UserFilter";
import { Checkbox, debounce } from "@mui/material";
import TextField from "../components/textField";
import Button from "../components/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UsersList() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState(new UserFilter());

  const handleSearchUsers = useMemo(
    () =>
      debounce((filter: UserFilter) => {
        axios.get("/utilisateur", { params: filter }).then((res) => {});
      }, 500),
    [],
  );

  useEffect(() => {
    handleSearchUsers(filter);
  }, [filter]);

  return (
    <div>
      <h1>Utilisateurs</h1>
      <Box>
        <Button
          text="Ajouter un utilisateur"
          icon={Plus}
          onClick={() => navigate("/main/users/add")}
        />
        <h3>Filtres</h3>
        <div className="grid grid-cols-4 gap-4 mb-10">
          <TextField
            text="Nom"
            value={filter.nom}
            onChange={(e) => setFilter({ ...filter, nom: e.target.value })}
          />
          <TextField
            text="Prénom"
            value={filter.prenom}
            onChange={(e) => setFilter({ ...filter, prenom: e.target.value })}
          />
          <TextField
            text="Email"
            value={filter.email}
            onChange={(e) => setFilter({ ...filter, email: e.target.value })}
          />
        </div>
        <h3>Liste</h3>
      </Box>
    </div>
  );
}
