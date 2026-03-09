/**
 * Modèle DescriptionRace
 * 
 * ➜ Spring Boot : équivalent d'une classe @Entity
 * 
 *   @Entity
 *   @Table(name = "description_race")
 *   public class DescriptionRace {
 *       @Id @GeneratedValue
 *       private Integer idDescriptionRace;
 *       private Integer age;
 *       private Double variationPoids;
 *       private Double lanjaSakafo;
 *       private Integer idRace;
 *   }
 * 
 * En Express/Node.js, il n'y a pas d'ORM par défaut comme JPA/Hibernate.
 * On définit le modèle comme une simple classe JS qui représente la structure.
 */

class DescriptionRace {
    constructor({ Id_description_race = null, age, variation_poids, lanja_sakafo, Id_race }) {
        this.Id_description_race = Id_description_race;
        this.age = age;
        this.variation_poids = variation_poids;
        this.lanja_sakafo = lanja_sakafo;
        this.Id_race = Id_race;
    }
}

module.exports = DescriptionRace;
