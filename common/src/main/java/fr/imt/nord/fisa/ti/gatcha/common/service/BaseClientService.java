package fr.imt.nord.fisa.ti.gatcha.common.service;

import fr.imt.nord.fisa.ti.gatcha.common.client.HttpClient;

/**
 * Service de base pour les clients API communiquant avec d'autres microservices.
 */
public abstract class BaseClientService {

    protected final HttpClient httpClient;
    protected final String serviceUrl;

    protected BaseClientService(HttpClient httpClient, String serviceUrl) {
        this.httpClient = httpClient;
        this.serviceUrl = serviceUrl;
    }
}

