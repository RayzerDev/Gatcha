#!/bin/sh
# sonar-init.sh
# Exécuté en arrière-plan dans le container SonarQube lui-même.
# Crée les projets et génère un token d'analyse global.
# Le token est écrit dans /opt/sonarqube/data/sonar-token
# (volume sonarqube_data, persisté).

SONAR_URL="http://localhost:9000"
NEW_PASSWORD="${SONAR_ADMIN_PASSWORD:-Admin1234!5678}"
TOKEN_FILE="/opt/sonarqube/data/sonar-token"
MARKER_FILE="/opt/sonarqube/data/.sonar-initialized"

# -------------------------------------------------------
# Si déjà initialisé, on sort immédiatement
# -------------------------------------------------------
if [ -f "$MARKER_FILE" ]; then
  echo "[sonar-init] Déjà initialisé. Rien à faire."
  exit 0
fi

# -------------------------------------------------------
# Attente que SonarQube soit UP
# -------------------------------------------------------
echo "[sonar-init] Attente que SonarQube soit prêt..."
attempts=0
while [ $attempts -lt 60 ]; do
  status=$(curl -s "$SONAR_URL/api/system/status" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
  if [ "$status" = "UP" ]; then
    echo "[sonar-init] SonarQube est prêt !"
    break
  fi
  attempts=$((attempts + 1))
  echo "[sonar-init]   Tentative $attempts/60 (status=$status)..."
  sleep 10
done

if [ "$status" != "UP" ]; then
  echo "[sonar-init] ERREUR : SonarQube n'a pas démarré à temps."
  exit 1
fi

# -------------------------------------------------------
# Changement du mot de passe admin
# -------------------------------------------------------
echo "[sonar-init] Changement du mot de passe admin..."

ADMIN_AUTH="admin:${NEW_PASSWORD}"

# Tester si le mot de passe par défaut fonctionne encore
http_code=$(curl -s -o /dev/null -w "%{http_code}" \
  -u "admin:admin" \
  "$SONAR_URL/api/system/status")

if [ "$http_code" = "200" ]; then
  # Changer le mot de passe (retourne 204 No Content en succès)
  change_resp=$(curl -s -w "\nHTTP:%{http_code}" \
    -u "admin:admin" -X POST \
    "$SONAR_URL/api/users/change_password" \
    -d "login=admin&password=${NEW_PASSWORD}&previousPassword=admin")
  change_body=$(echo "$change_resp" | sed '$d')
  change_code=$(echo "$change_resp" | tail -1 | cut -d: -f2)
  if [ "$change_code" = "204" ] || [ "$change_code" = "200" ]; then
    echo "[sonar-init] Mot de passe admin changé."
    ADMIN_AUTH="admin:${NEW_PASSWORD}"
  else
    echo "[sonar-init] WARN: change_password HTTP $change_code : $change_body — le mot de passe reste 'admin'."
    ADMIN_AUTH="admin:admin"
  fi
fi

# Vérifier que l'auth fonctionne
check=$(curl -s -o /dev/null -w "%{http_code}" \
  -u "$ADMIN_AUTH" \
  "$SONAR_URL/api/system/status")
if [ "$check" != "200" ]; then
  echo "[sonar-init] ERREUR : Impossible de s'authentifier (HTTP $check)."
  exit 1
fi
echo "[sonar-init] Authentification OK."

# -------------------------------------------------------
# Création des projets
# -------------------------------------------------------
echo "[sonar-init] Création des projets..."

create_project() {
  key="$1"
  name="$2"
  result=$(curl -s -w "\nHTTP:%{http_code}" -u "$ADMIN_AUTH" -X POST \
    "$SONAR_URL/api/projects/create" \
    -d "project=${key}&name=${name}&visibility=public")
  body=$(echo "$result" | sed '$d')
  code=$(echo "$result" | tail -1 | cut -d: -f2)
  if echo "$body" | grep -q '"key"'; then
    echo "[sonar-init]   [OK]   $key"
  elif echo "$body" | grep -q "already exists"; then
    echo "[sonar-init]   [SKIP] $key"
  else
    echo "[sonar-init]   [WARN] $key (HTTP $code) : $body"
  fi
}

create_project "gatcha-auth"        "Gatcha - Auth"
create_project "gatcha-combat"      "Gatcha - Combat"
create_project "gatcha-common"      "Gatcha - Common"
create_project "gatcha-common-auth" "Gatcha - Common Auth"
create_project "gatcha-invocation"  "Gatcha - Invocation"
create_project "gatcha-monster"     "Gatcha - Monster"
create_project "gatcha-player"      "Gatcha - Player"
create_project "gatcha-front"       "Gatcha - Front"

# -------------------------------------------------------
# Génération du token
# -------------------------------------------------------
echo "[sonar-init] Génération du token d'analyse..."

curl -s -u "$ADMIN_AUTH" -X POST \
  "$SONAR_URL/api/user_tokens/revoke" \
  -d "name=gatcha-global-token" > /dev/null

token_response=$(curl -s -w "\nHTTP:%{http_code}" -u "$ADMIN_AUTH" -X POST \
  "$SONAR_URL/api/user_tokens/generate" \
  -d "name=gatcha-global-token&type=GLOBAL_ANALYSIS_TOKEN")
token_body=$(echo "$token_response" | sed '$d')
token_code=$(echo "$token_response" | tail -1 | cut -d: -f2)
token=$(echo "$token_body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$token" ]; then
  token_response2=$(curl -s -w "\nHTTP:%{http_code}" -u "$ADMIN_AUTH" -X POST \
    "$SONAR_URL/api/user_tokens/generate" \
    -d "name=gatcha-global-token")
  token_body=$(echo "$token_response2" | sed '$d')
  token_code=$(echo "$token_response2" | tail -1 | cut -d: -f2)
  token=$(echo "$token_body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
fi

if [ -z "$token" ]; then
  echo "[sonar-init] ERREUR : impossible de générer le token (HTTP $token_code) : $token_body"
  exit 1
fi

# -------------------------------------------------------
# Persistance
# -------------------------------------------------------
printf '%s' "$token" > "$TOKEN_FILE"
touch "$MARKER_FILE"

echo ""
echo "======================================="
echo "  SonarQube initialisé avec succès !   "
echo "======================================="
echo "  Token : $token"
echo "  (stocké dans $TOKEN_FILE)"
echo "======================================="







