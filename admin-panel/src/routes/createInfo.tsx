import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import Box from "../components/box";
import TextField from "../components/textField";
import Button from "../components/button";
import axios from "../utils/axios";
import Checkbox from "../components/checkbox";
import { useSnackbar } from "../hooks/useSnackbar";
import Information from "../class/Information";
import TextArea from "../components/textArea";
import { useUser } from "../contexts/UserProviter";

export default function CreateInfo() {
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const { user } = useUser();
  const [information, setInformation] = useState(new Information());
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    axios
      .post("/information/create", { ...information, authorId: user?.id })
      .then(() => {
        navigate("/main/infos");
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
          onClick={() => navigate("/main/infos")}
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
            value={information.titre}
            onChange={(e) => setInformation({ ...information, titre: e.target.value })}
          />
          <TextField
            text="Catégorie"
            value={information.categorie}
            onChange={(e) =>
              setInformation({ ...information, categorie: e.target.value })
            }
          />
          <TextField
            text="Description"
            value={information.description}
            onChange={(e) =>
              setInformation({ ...information, description: e.target.value })
            }
          />
          <TextField
            text="Image (URL)"
            value={information.image}
            onChange={(e) => setInformation({ ...information, image: e.target.value })}
          />
          <TextArea
            text="Texte"
            value={information.texte}
            onChange={(e) => setInformation({ ...information, texte: e.target.value })}
          />
          <Checkbox
            text="Actif"
            checked={information.status}
            onChange={(e) => setInformation({ ...information, status: e.target.checked })}
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
