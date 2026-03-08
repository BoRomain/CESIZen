export default class UserFilter {
  nom: string;
  prenom: string;
  email: string;
  role: string;
  page: number;
  limit: number;

  constructor() {
    this.nom = "";
    this.prenom = "";
    this.email = "";
    this.role = "";
    this.page = 1;
    this.limit = 10;
  }
}
