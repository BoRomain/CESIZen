import { useEffect, useMemo, useState } from "react";
import Box from "../components/box";
import axios from "../utils/axios";
import UserFilter from "../class/Filters/UserFilter";
import { debounce } from "@mui/material";
import TextField from "../components/textField";
import Button from "../components/button";
import { Edit, Plus, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import User from "../class/User";
import Loading from "../components/loading";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ButtonIcon from "../components/buttonIcon";

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

  function handleEdit(id: number) {
    navigate(`/main/users/edit/${id}`);
  }

  function handleDelete(id: number) {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      axios.delete(`/utilisateur/delete/${id}`).then(() => {
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
            value={filter.nom || ""}
            onChange={(e) => setFilter({ ...filter, nom: e.target.value })}
          />
          <TextField
            text="Prénom"
            value={filter.prenom || ""}
            onChange={(e) => setFilter({ ...filter, prenom: e.target.value })}
          />
          <TextField
            text="Email"
            value={filter.email || ""}
            onChange={(e) => setFilter({ ...filter, email: e.target.value })}
          />
        </div>
      </Box>
      <Box>
        <h3>Liste</h3>
        {loading ? (
          <Loading />
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: "60vh" }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Prénom</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nom}</TableCell>
                    <TableCell>{user.prenom}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.status ? "Actif" : "Inactif"}</TableCell>
                    <TableCell sx={{ display: "flex" }}>
                      <ButtonIcon
                        title="Modifier"
                        icon={Edit}
                        onClick={() => handleEdit(user.id)}
                        color="primary"
                      />
                      <ButtonIcon
                        title="Supprimer"
                        icon={Trash}
                        onClick={() => handleDelete(user.id)}
                        color="secondary"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </div>
  );
}
