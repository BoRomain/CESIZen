import { RefreshTokenModel } from "./RefreshTokenModel.js";
export class UtilisateurModel {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  role: string;
  dateCreation: Date;
  status: boolean;
  refreshTokens?: RefreshTokenModel;

  constructor() {
    this.id = 0;
    this.nom = "";
    this.prenom = "";
    this.email = "";
    this.motDePasse = "";
    this.role = "";
    this.dateCreation = new Date();
    this.status = true;
  }
}
