import Box from "../components/box";

export default function Dashboard() {
  return (
    <div>
      <h1>Tableau de bord</h1>
      <div className="grid grid-cols-3 gap-4">
        <Box></Box>
        <Box></Box>
        <Box></Box>
        <Box></Box>
      </div>
    </div>
  );
}
