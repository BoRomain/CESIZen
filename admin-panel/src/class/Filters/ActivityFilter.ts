export default class ActivityFilter {
  titre?: string;
  page: number = 1;
  limit: number = 10;

  constructor() {
    this.titre = undefined;
  }
}
