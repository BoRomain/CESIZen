import { useEffect, useMemo, useState } from "react";
import Box from "../components/box";
import axios from "../utils/axios";
import { debounce } from "@mui/material";
import TextField from "../components/textField";
import Button from "../components/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/loading";
import Information from "../class/Information";
import InformationFilter from "../class/Filters/InformationFilter";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Edit, Trash } from "lucide-react";
import ButtonIcon from "../components/buttonIcon";

export default function InfosList() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [informations, setInformations] = useState<Information[]>([]);
  const [filter, setFilter] = useState(new InformationFilter());

  const handleSearchInformations = useMemo(
    () =>
      debounce((filter: InformationFilter) => {
        axios
          .get("/information", { params: filter })
          .then((res) => {
            setInformations(res.data);
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
    handleSearchInformations(filter);
  }, [filter]);

  function handleEdit(id: string) {
    navigate(`/main/infos/edit/${id}`);
  }

  function handleDelete(id: string) {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette information ?")
    ) {
      axios.delete(`/information/delete/${id}`).then(() => {
        handleSearchInformations(filter);
      });
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Box>
        <div className="flex justify-between">
          <h1>Informations</h1>
          <Button
            text="Ajouter une information"
            icon={Plus}
            onClick={() => navigate("/main/infos/add")}
            className="h-fit"
          />
        </div>
        <h3>Filtres</h3>
        <div className="grid grid-cols-4 gap-4 mb-10">
          <TextField
            text="Titre"
            value={filter.titre || ""}
            onChange={(e) => setFilter({ ...filter, titre: e.target.value })}
          />
          <TextField
            text="Catégorie"
            value={filter.categorie || ""}
            onChange={(e) =>
              setFilter({ ...filter, categorie: e.target.value })
            }
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
                  <TableCell>Titre</TableCell>
                  <TableCell>Catégorie</TableCell>
                  <TableCell>Date de création</TableCell>
                  <TableCell>Auteur</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {informations.map((info) => (
                  <TableRow key={info.id}>
                    <TableCell>{info.titre}</TableCell>
                    <TableCell>{info.categorie}</TableCell>
                    <TableCell>
                      {new Date(info.dateCreation).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{info.authorId}</TableCell>
                    <TableCell>{info.status ? "Actif" : "Inactif"}</TableCell>
                    <TableCell>
                      <ButtonIcon
                        title="Modifier"
                        icon={Edit}
                        onClick={() => handleEdit(info.id)}
                        color="primary"
                      />
                      <ButtonIcon
                        title="Supprimer"
                        icon={Trash}
                        onClick={() => handleDelete(info.id)}
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
