import { UtilisateurModel } from "./UtilisateurModel";

export class RefreshTokenModel {
  id: number;
  utilisateurId: number;
  token: string;
  dateCreation: Date;

  constructor() {
    this.id = 0;
    this.utilisateurId = 0;
    this.token = "";
    this.dateCreation = new Date();
  }
}
