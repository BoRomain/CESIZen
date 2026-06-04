import { useEffect, useState } from "react";
import Box from "../components/box";
import DonutChart from "../components/donutChart";
import axios from "../utils/axios";

export default function Dashboard() {
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [inactiveUsersCount, setInactiveUsersCount] = useState(0);
  const [activeInfosCount, setActiveInfosCount] = useState(0);
  const [inactiveInfosCount, setInactiveInfosCount] = useState(0);
  const [activeActivitiesCount, setActiveActivitiesCount] = useState(0);
  const [inactiveActivitiesCount, setInactiveActivitiesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userStatus, infoStatus, activityStatus] = await Promise.all([
          axios.get("/utilisateur/count"),
          axios.get("/activiteDetente/count"),
          axios.get("/information/count"),
          axios.get("/utilisateur/status-count"),
          axios.get("/information/status-count"),
          axios.get("/activiteDetente/status-count"),
        ]);
        setActiveUsersCount(userStatus.data.active);
        setInactiveUsersCount(userStatus.data.inactive);
        setActiveInfosCount(infoStatus.data.active);
        setInactiveInfosCount(infoStatus.data.inactive);
        setActiveActivitiesCount(activityStatus.data.active);
        setInactiveActivitiesCount(activityStatus.data.inactive);
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
        <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-4">
          <DonutChart
            title="Utilisateurs actifs vs inactifs"
            segments={[
              { label: "Actifs", value: activeUsersCount, color: "#22c55e" },
              {
                label: "Inactifs",
                value: inactiveUsersCount,
                color: "#ef4444",
              },
            ]}
          />
          <DonutChart
            title="Informations actifs v inactifs"
            segments={[
              { label: "Actifs", value: activeInfosCount, color: "#22c55e" },
              {
                label: "Inactifs",
                value: inactiveInfosCount,
                color: "#ef4444",
              },
            ]}
          />
          <DonutChart
            title="Activités actifs vs inactifs"
            segments={[
              {
                label: "Actifs",
                value: activeActivitiesCount,
                color: "#22c55e",
              },
              {
                label: "Inactifs",
                value: inactiveActivitiesCount,
                color: "#ef4444",
              },
            ]}
          />
        </div>
      )}
    </Box>
  );
}
