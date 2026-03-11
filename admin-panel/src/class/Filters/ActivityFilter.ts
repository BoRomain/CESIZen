export default class ActivityFilter {
  nom?: string;
  type?: string;
  lieu?: string;
  status?: boolean;

  constructor() {
    this.nom = undefined;
    this.type = undefined;
    this.lieu = undefined;
    this.status = undefined;
  }
}