import { useEffect, useMemo, useState } from "react";
import Box from "../components/box";
import axios from "../utils/axios";
import { debounce } from "@mui/material";
import TextField from "../components/textField";
import Button from "../components/button";
import { Plus, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/loading";
import Activity from "../class/Activity";
import ActivityFilter from "../class/Filters/ActivityFilter";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ButtonIcon from "../components/buttonIcon";

export default function ActivitiesList() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState(new ActivityFilter());

  const handleSearchActivities = useMemo(
    () =>
      debounce((filter: ActivityFilter) => {
        axios
          .get("/activite", { params: filter })
          .then((res) => {
            setActivities(res.data);
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
    handleSearchActivities(filter);
  }, [filter]);

  function handleEdit(id: string) {
    navigate(`/main/activities/edit/${id}`);
  }

  function handleDelete(id: string) {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      axios.delete(`/activite/delete/${id}`).then(() => {
        handleSearchActivities(filter);
      });
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Box>
        <div className="flex justify-between">
          <h1>Activités</h1>
          <Button
            text="Ajouter une activité"
            icon={Plus}
            onClick={() => navigate("/main/activities/add")}
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
            text="Type"
            value={filter.type || ""}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          />
          <TextField
            text="Lieu"
            value={filter.lieu || ""}
            onChange={(e) => setFilter({ ...filter, lieu: e.target.value })}
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
                  <TableCell>Description</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Lieu</TableCell>
                  <TableCell>Date de début</TableCell>
                  <TableCell>Date de fin</TableCell>
                  <TableCell>Participants</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.nom}</TableCell>
                    <TableCell>
                      {activity.description.substring(0, 50)}
                      {activity.description.length > 50 ? "..." : ""}
                    </TableCell>
                    <TableCell>{activity.type}</TableCell>
                    <TableCell>{activity.lieu}</TableCell>
                    <TableCell>
                      {new Date(activity.dateDebut).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(activity.dateFin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{activity.nombreParticipant}</TableCell>
                    <TableCell>{activity.status ? "Actif" : "Inactif"}</TableCell>
                    <TableCell>
                      <ButtonIcon
                        title="Modifier"
                        icon={Edit}
                        onClick={() => handleEdit(activity.id)}
                        color="primary"
                      />
                      <ButtonIcon
                        title="Supprimer"
                        icon={Trash}
                        onClick={() => handleDelete(activity.id)}
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
