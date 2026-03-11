import { v4 as uuidv4 } from "uuid";

export default class Activity {
  id: string;
  nom: string;
  description: string;
  dateDebut: Date;
  dateFin: Date;
  lieu: string;
  type: string;
  status: boolean;
  nombreParticipant: number;
  auteurId: string;

  constructor() {
    this.id = uuidv4();
    this.nom = "";
    this.description = "";
    this.dateDebut = new Date();
    this.dateFin = new Date();
    this.lieu = "";
    this.type = "";
    this.status = true;
    this.nombreParticipant = 0;
    this.auteurId = "";
  }
}