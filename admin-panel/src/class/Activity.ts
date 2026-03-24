import { v4 as uuidv4 } from "uuid";

export default class Activity {
  id: string;
  titre: string;
  description: string;
  dateCreation: Date;
  dateModification: Date;
  lieu: string;
  type: string;
  duree: number;
  difficulte: number;
  status: boolean;
  nombreParticipant: number;
  auteurId: string;

  constructor() {
    this.id = uuidv4();
    this.titre = "";
    this.description = "";
    this.dateCreation = new Date();
    this.dateModification = new Date();
    this.lieu = "";
    this.type = "";
    this.duree = 0;
    this.difficulte = 0;
    this.status = true;
    this.nombreParticipant = 0;
    this.auteurId = "";
  }
}
