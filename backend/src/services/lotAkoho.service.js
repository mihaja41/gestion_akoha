const lotAkohoRepository = require('../repositories/lotAkoho.repository');
const descriptionRaceService = require('./descriptionRace.service');
const akohoMatyService = require('./akohoMaty.service');
const raceService = require('./race.service');
const lotAtodyService = require('./lotAtody.service');

async function getAll() {
    return await lotAkohoRepository.findAll();
}

async function getById(id) {
    const item = await lotAkohoRepository.findById(id);
    if (!item) {
        const error = new Error(`LotAkoho avec l'id ${id} introuvable`);
        error.status = 404;
        throw error;
    }
    return item;
}

async function create(data) {
    if (data.numero == null || data.date_entree == null || data.nombre == null ||
        data.age == null || data.prix_achat == null || data.Id_race == null) {
        const error = new Error('Champs obligatoires : numero, date_entree, nombre, age, prix_achat, Id_race');
        error.status = 400;
        throw error;
    }
    return await lotAkohoRepository.create(data);
}

async function update(id, data) {
    await getById(id);
    const updated = await lotAkohoRepository.update(id, data);
    if (!updated) {
        const error = new Error(`Échec de la mise à jour de LotAkoho id ${id}`);
        error.status = 500;
        throw error;
    }
    return updated;
}

async function deleteById(id) {
    await getById(id);
    const deleted = await lotAkohoRepository.deleteById(id);
    if (!deleted) {
        const error = new Error(`Échec de la suppression de LotAkoho id ${id}`);
        error.status = 500;
        throw error;
    }
    return true;
}

async function getSituationByIdAndDate(id, date) {
    // 1. Récupérer les données de base
    const lotAkoho = await getById(id);
    const race = await raceService.getById(lotAkoho.Id_race);
    const descriptions = await descriptionRaceService.getAllByRaceId(lotAkoho.Id_race);

    // 2. Calcul de l'âge du lot
    const dateObj = new Date(date);
    const dateEntreeObj = new Date(lotAkoho.date_entree);
    const jourDepuisEntree = Math.floor((dateObj - dateEntreeObj) / (24 * 60 * 60 * 1000));

    if (jourDepuisEntree < 0) {
        const error = new Error("La date doit être postérieure à la date d'entrée du lot");
        error.status = 400;
        throw error;
    }

    const ageEntreeSemaine = lotAkoho.age; // âge initial en semaines à l'entrée
    const ageActuelSemaineExact = ageEntreeSemaine + (jourDepuisEntree / 7);
    const ageActuelSemaineEntier = Math.floor(ageActuelSemaineExact);
    const fractionSemaineCourante = ageActuelSemaineExact - ageActuelSemaineEntier;

    // 3. Map des descriptions par semaine (age => {variation_poids, lanja_sakafo})
    const descMap = {};
    for (const desc of descriptions) {
        descMap[desc.age] = desc;
    }

    // 4. Poids moyen par poulet
    //    On cumule les variations de poids depuis la semaine 0 (naissance)
    //    même si le lot est entré à une semaine > 0, le poulet a accumulé du poids avant
    let poidsMoyen = 0;
    for (let w = 0; w < ageActuelSemaineEntier; w++) {
        if (descMap[w]) {
            poidsMoyen += descMap[w].variation_poids;
        }
    }
    // Ajouter la fraction de la semaine en cours
    if (fractionSemaineCourante > 0 && descMap[ageActuelSemaineEntier]) {
        poidsMoyen += descMap[ageActuelSemaineEntier].variation_poids * fractionSemaineCourante;
    }

    // 5. Valeur de la nourriture consommée depuis l'entrée (pour les poulets initiaux sans mort)
    //    On ne compte que depuis la semaine d'entrée (on ne payait pas avant)
    let totalNourritureGrammes = 0;
    for (let w = ageEntreeSemaine; w < ageActuelSemaineEntier; w++) {
        if (descMap[w]) {
            totalNourritureGrammes += descMap[w].lanja_sakafo;
        }
    }
    // Fraction de la semaine en cours
    if (fractionSemaineCourante > 0 && descMap[ageActuelSemaineEntier]) {
        totalNourritureGrammes += descMap[ageActuelSemaineEntier].lanja_sakafo * fractionSemaineCourante;
    }
    // Valeur = grammes par poulet × nombre initial × prix par gramme
    const valeurNourritureConsommee = totalNourritureGrammes * lotAkoho.nombre * race.prix_sakafo;

    // 6. Poulets morts
    const nombreMorts = await akohoMatyService.getAkohoMatyByIdLotAkohoAndDate(id, date);
    const nombreApresMort = lotAkoho.nombre - nombreMorts;

    // 7. Prix de vente (poids × prix de vente par gramme)
    const poidsTotalSansMort = poidsMoyen * lotAkoho.nombre;
    const prixVenteSansMort = poidsTotalSansMort * race.prix_vente;

    const poidsTotalAvecMort = poidsMoyen * nombreApresMort;
    const prixVenteAvecMort = poidsTotalAvecMort * race.prix_vente;

    // 8. Oeufs (total oeufs − oeufs déjà nés/éclos)
    const nombreOeufs = await lotAtodyService.getNombreOeufsByLotAkohoIdAndDate(id, date);
    const valeurOeufs = nombreOeufs * race.prix_vente_atody;

    // 9. Prix d'achat total
    const prixAchatTotal = lotAkoho.prix_achat * lotAkoho.nombre;

    // 10. Bénéfices
    const beneficeSansMort = prixVenteSansMort + valeurOeufs - prixAchatTotal - valeurNourritureConsommee;
    const beneficeAvecMort = prixVenteAvecMort + valeurOeufs - prixAchatTotal - valeurNourritureConsommee;

    return {
        numero: lotAkoho.numero,
        nombreInitial: lotAkoho.nombre,
        prixAchatTotal,
        valeurNourritureConsommee,
        poidsMoyenParPoulet: poidsMoyen,
        prixVenteSansMort,
        nombreMorts,
        nombreApresMort,
        ageEnJour: jourDepuisEntree,
        ageEnSemaine: parseFloat((jourDepuisEntree / 7).toFixed(2)),
        prixVenteAvecMort,
        nombreOeufs,
        valeurOeufs,
        beneficeSansMort,
        beneficeAvecMort
    };
}

module.exports = { getAll, getById, create, update, deleteById , getSituationByIdAndDate };