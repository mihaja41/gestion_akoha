/**
 * Interface TypeScript pour DescriptionRace.
 *
 * ➜ Vue.js : pas d'équivalent natif (tu pouvais utiliser des types TS avec Vue 3 + <script setup lang="ts">)
 * ➜ Spring Boot : équivalent de la classe @Entity DescriptionRace
 * ➜ Express (notre backend) : correspond au modèle dans models/descriptionRace.model.js
 *
 * Une interface TypeScript définit la FORME (shape) d'un objet.
 * Elle n'existe qu'au moment de la compilation (pas au runtime).
 * C'est une bonne pratique Angular pour typer les données qui viennent de l'API.
 *
 * Les noms des propriétés doivent correspondre EXACTEMENT à ce que l'API renvoie.
 */
export interface DescriptionRace {
  Id_description_race: number | null;  // null quand on crée un nouvel enregistrement
  age: number;
  variation_poids: number;
  lanja_sakafo: number;
  Id_race: number;
}
