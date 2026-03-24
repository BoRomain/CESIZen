import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import Box from "../components/box";
import TextField from "../components/textField";
import Button from "../components/button";
import axios from "../utils/axios";
import Checkbox from "../components/checkbox";
import { useSnackbar } from "../hooks/useSnackbar";
import { useUser } from "../contexts/UserProviter";
import Activity from "../class/Activity";

export default function CreateActivity() {
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const { user } = useUser();
  const [activity, setActivity] = useState(new Activity());
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    axios
      .post("/activiteDetente/create", { ...activity, authorId: user?.id })
      .then(() => {
        navigate("/main/activities");
        showMessage("Opération réussie", "success");
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
          onClick={() => navigate("/main/activities")}
          className="p-2 mr-4 rounded-lg hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1>Ajouter une information</h1>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <TextField
            text="Titre"
            value={activity.titre}
            onChange={(e) => setActivity({ ...activity, titre: e.target.value })}
          />
          <TextField
            text="Description"
            value={activity.description}
            onChange={(e) => setActivity({ ...activity, description: e.target.value })}
          />
          <TextField
            text="Lieu"
            value={activity.lieu}
            onChange={(e) => setActivity({ ...activity, lieu: e.target.value })}
          />
          <TextField
            text="Type"
            value={activity.type}
            onChange={(e) => setActivity({ ...activity, type: e.target.value })}
          />
          <TextField
            text="Durée (min)"
            type="number"
            value={activity.duree.toString()}
            onChange={(e) =>
              setActivity({ ...activity, duree: parseInt(e.target.value) })
            }
          />
          <TextField
            text="Difficulté"
            type="number"
            value={activity.difficulte.toString()}
            onChange={(e) =>
              setActivity({ ...activity, difficulte: parseInt(e.target.value) })
            }
          />
          <Checkbox
            text="Actif"
            checked={activity.status}
            onChange={(e) => setActivity({ ...activity, status: e.target.checked })}
            className="w-fit"
          />
        </div>
        <div className="flex justify-end">
          <Button text="Créer" onClick={handleSubmit} loading={loading} icon={Check} />
        </div>
      </div>
    </Box>
  );
}
