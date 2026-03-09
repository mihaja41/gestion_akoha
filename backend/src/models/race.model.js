class Race {
    constructor({ Id_race = null, nom, prix_sakafo, prix_vente, prix_vente_atody }) {
        this.Id_race = Id_race;
        this.nom = nom;
        this.prix_sakafo = prix_sakafo;
        this.prix_vente = prix_vente;
        this.prix_vente_atody = prix_vente_atody;
    }
}

module.exports = Race;
