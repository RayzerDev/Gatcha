#!/bin/bash
# sonar-entrypoint.sh
# Lance SonarQube normalement, puis exécute sonar-init.sh en arrière-plan
# dès que SonarQube est UP.

# Lancer l'init en arrière-plan (attend que SonarQube soit prêt)
/usr/local/bin/sonar-init.sh &

# Démarrer SonarQube (remplace le PID 1)
exec /opt/sonarqube/docker/entrypoint.sh

