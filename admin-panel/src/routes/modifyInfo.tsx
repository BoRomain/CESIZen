import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import Box from "../components/box";
import TextField from "../components/textField";
import Button from "../components/button";
import axios from "../utils/axios";
import Checkbox from "../components/checkbox";
import { useSnackbar } from "../hooks/useSnackbar";
import Information from "../class/Information";
import TextArea from "../components/textArea";
import Loading from "../components/loading";
import { useUser } from "../contexts/UserProviter";

export default function ModifyInfo() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { id } = useParams();
  const { showMessage } = useSnackbar();
  const [information, setInformation] = useState<Information>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/information/${id}`)
      .then((res) => {
        setInformation(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = () => {
    setLoading(true);
    axios
      .put(`/information/update/${id}`, { ...information, authorId: user?.id })
      .then(() => {
        navigate("/main/infos");
      })
      .catch((err) => {
        showMessage("Une erreur est survenue", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading || !information) {
    return (
      <Box>
        <Loading />
      </Box>
    );
  }

  return (
    <Box>
      <div className="flex items-center mb-5">
        <button
          onClick={() => navigate("/main/infos")}
          className="p-2 mr-4 rounded-lg hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1>Modifier une information</h1>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <TextField
            text="Titre"
            value={information.titre}
            onChange={(e) =>
              setInformation({ ...information, titre: e.target.value })
            }
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
            onChange={(e) =>
              setInformation({ ...information, image: e.target.value })
            }
          />
          <TextArea
            text="Texte"
            value={information.texte}
            onChange={(e) =>
              setInformation({ ...information, texte: e.target.value })
            }
            className="col-span-2"
          />
          <Checkbox
            text="Actif"
            checked={information.status}
            onChange={(e) =>
              setInformation({ ...information, status: e.target.checked })
            }
            className="w-fit"
          />
        </div>
        <div className="flex justify-end">
          <Button
            text="Modifier"
            onClick={handleSubmit}
            loading={loading}
            icon={Check}
          />
        </div>
      </div>
    </Box>
  );
}
