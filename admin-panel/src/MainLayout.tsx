import Box from "./components/box";
import { useUser } from "./contexts/UserProviter";

export default function MainLayout() {
  const { user } = useUser();
  return (
    <div className="p-5">
      <h1>Bonjour {user?.prenom}</h1>
      <h2>Tableau de bord</h2>
      <Box></Box>
    </div>
  );
}
