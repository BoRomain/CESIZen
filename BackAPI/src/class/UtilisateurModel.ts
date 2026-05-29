import { RefreshTokenModel } from "./RefreshTokenModel.js";
import { v4 as uuidv4 } from "uuid";
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
