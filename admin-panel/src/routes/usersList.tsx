import { useEffect, useMemo, useState } from "react";
import Box from "../components/box";
import axios from "../utils/axios";
import UserFilter from "../class/Filters/UserFilter";
import { debounce } from "@mui/material";
import TextField from "../components/textField";
import Button from "../components/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import User from "../class/User";
import UserCard from "../components/userCard";
import Loading from "../components/loading";

export default function UsersList() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState(new UserFilter());

  const handleSearchUsers = useMemo(
    () =>
      debounce((filter: UserFilter) => {
        axios
          .get("/utilisateur", { params: filter })
          .then((res) => {
            setUsers(res.data);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => setLoading(false));
      }, 400),
    [],
  );

  useEffect(() => {
    setLoading(true);
    handleSearchUsers(filter);
  }, [filter]);

  function handleEdit(id: string) {
    navigate(`/main/users/edit/${id}`);
  }

  function handleDelete(id: string) {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      axios.delete(`/utilisateur/${id}`).then(() => {
        handleSearchUsers(filter);
      });
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Box>
        <div className="flex justify-between">
          <h1>Utilisateurs</h1>
          <Button
            text="Ajouter un utilisateur"
            icon={Plus}
            onClick={() => navigate("/main/users/add")}
            className="h-fit"
          />
        </div>
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
      </Box>
      <Box>
        <h3>Liste</h3>
        {loading ? (
          <Loading />
        ) : (
          <div className="grid xl:grid-cols-2 lg:grid-cols-1 gap-4 overflow-auto max-h-70">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </Box>
    </div>
  );
}
