export default class User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: "admin" | "user";
  status: boolean;

  constructor() {
    this.id = 0;
    this.nom = "";
    this.prenom = "";
    this.email = "";
    this.password = "";
    this.role = "user";
    this.status = true;
  }
}
