package fr.imt.nord.fisa.ti.gatcha.invocation.model;

public enum InvocationStatus {
    PENDING,           // Invocation créée, en attente de traitement
    MONSTER_CREATED,   // Monstre créé dans l'API Monster
    PLAYER_UPDATED,    // Monstre ajouté au joueur
    COMPLETED,         // Invocation terminée avec succès
    FAILED             // Échec de l'invocation
}
