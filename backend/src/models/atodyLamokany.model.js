/**
 * Modèle AtodyLamokany — Oeufs couvés gâtés (pourris).
 * 
 * ➜ Spring Boot : équivalent d'une classe @Entity
 *
 * Représente les œufs qui ne peuvent pas éclore (œufs pourris)
 * dans un lot d'œufs (lot_atody).
 */

class AtodyLamokany {
    constructor({ Id_atody_lamokany, date_lamokany, nombre, Id_lot_atody }) {
        this.Id_atody_lamokany = Id_atody_lamokany;
        this.date_lamokany = date_lamokany;
        this.nombre = nombre;
        this.Id_lot_atody = Id_lot_atody;
    }
}

module.exports = AtodyLamokany;
