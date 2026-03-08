import { v4 as uuidv4 } from "uuid";

export default class User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: string;
  status: boolean;

  constructor() {
    this.id = uuidv4();
    this.nom = "";
    this.prenom = "";
    this.email = "";
    this.password = "";
    this.role = "";
    this.status = true;
  }
}
