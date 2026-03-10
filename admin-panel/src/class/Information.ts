import { v4 as uuidv4 } from "uuid";

export default class Information {
  id: string;
  titre: string;
  description: string;
  texte: string;
  image: string;
  categorie: string;
  status: boolean;
  dateCreation: Date;
  authorId: string;

  constructor() {
    this.id = uuidv4();
    this.titre = "";
    this.description = "";
    this.texte = "";
    this.image = "";
    this.categorie = "";
    this.status = true;
    this.dateCreation = new Date();
    this.authorId = "";
  }
}
