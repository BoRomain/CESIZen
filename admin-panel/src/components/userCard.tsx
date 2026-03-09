import User from "../class/User";
import Button from "./button";
import { Trash, Pencil } from "lucide-react";

interface UserCardProps {
  user: User;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function UserCard({ user, onDelete, onEdit }: UserCardProps) {
  return (
    <div className="flex flex-row items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex flex-col">
        <p className="font-bold">
          {user.nom} {user.prenom}
        </p>
        <p>{user.email}</p>
        <p>{user.role}</p>
        <p>{user.status ? "Actif" : "Inactif"}</p>
      </div>
      <div className="flex flex-row gap-2">
        <Button text="Modifier" icon={Pencil} onClick={() => onEdit(user.id)} />
        <Button
          text="Supprimer"
          icon={Trash}
          onClick={() => onDelete(user.id)}
          variant="destructive"
        />
      </div>
    </div>
  );
}
