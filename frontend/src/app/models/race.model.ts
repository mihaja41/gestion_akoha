/**
 * Interface TypeScript pour Race.
 *
 * Correspond au modèle Race du backend Express (models/race.model.js) :
 *   { Id_race, nom, prix_sakafo, prix_vente, prix_vente_atody }
 *
 * Utilisé dans le select du formulaire de DescriptionRace
 * pour afficher le nom de la race au lieu d'un simple ID.
 */
export interface Race {
  Id_race: number | null;
  nom: string;
  prix_sakafo: number;
  prix_vente: number;
  prix_vente_atody: number;
}
