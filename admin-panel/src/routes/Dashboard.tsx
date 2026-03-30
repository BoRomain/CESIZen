import { useEffect, useState } from "react";
import Box from "../components/box";
import axios from "../utils/axios";

export default function Dashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [activitiesCount, setActivitiesCount] = useState(0);
  const [infosCount, setInfosCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, activities, infos] = await Promise.all([
          axios.get("/utilisateur/count"),
          axios.get("/activiteDetente/count"),
          axios.get("/information/count"),
        ]);
        setUsersCount(users.data.count);
        setActivitiesCount(activities.data.count);
        setInfosCount(infos.data.count);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box>
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Utilisateurs</h2>
            <p className="text-3xl font-bold">{usersCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Activités</h2>
            <p className="text-3xl font-bold">{activitiesCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Informations</h2>
            <p className="text-3xl font-bold">{infosCount}</p>
          </div>
        </div>
      )}
    </Box>
  );
}
