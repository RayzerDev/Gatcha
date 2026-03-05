# sonar-analyze.ps1
# Usage:
#   .\sonar-analyze.ps1 -Start
#   .\sonar-analyze.ps1 -Stop
#   .\sonar-analyze.ps1 -Module auth
#   .\sonar-analyze.ps1 -Module front
#   .\sonar-analyze.ps1 -All
#   .\sonar-analyze.ps1 -All -Token squ_xxxx

param(
    [string]$Module = "",
    [switch]$All,
    [switch]$Start,
    [switch]$Stop,
    [string]$Token = $env:SONAR_TOKEN
)

$ROOT         = $PSScriptRoot
$SONAR_URL    = "http://localhost:9000"
$COMPOSE_FILE = "$ROOT\docker\sonar.docker-compose.yml"
$JAVA_MODULES = @("auth", "combat", "common", "common-auth", "invocation", "monster", "player")

# --- Fonctions ---

function Get-SonarToken {
    # 1. Token passé en paramètre ou variable d'environnement
    if ($script:Token) { return $script:Token }

    # 2. Lire depuis le container sonarqube via docker exec
    $t = docker exec sonarqube cat /opt/sonarqube/data/sonar-token 2>$null
    if ($t -and $t.Trim()) { return $t.Trim() }

    return $null
}

function Wait-SonarInit {
    Write-Host "Attente de la fin de l'initialisation (sonar-init)..." -ForegroundColor Yellow
    $attempts = 0
    while ($attempts -lt 30) {
        docker exec sonarqube test -f /opt/sonarqube/data/.sonar-initialized 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Initialisation terminee !" -ForegroundColor Green
            return
        }
        $attempts++
        Write-Host "  En attente... ($attempts/30)" -ForegroundColor DarkGray
        Start-Sleep -Seconds 10
    }
    Write-Host "WARN : sonar-init n'a pas termine a temps. Verifiez : docker logs sonarqube" -ForegroundColor Yellow
}

function Start-Sonar {
    Write-Host "Demarrage de SonarQube..." -ForegroundColor Cyan
    docker compose -f $COMPOSE_FILE up -d
    Wait-Sonar
    Wait-SonarInit
    # Charger le token genere par sonar-init
    $t = Get-SonarToken
    if ($t) {
        $script:Token = $t
        Write-Host "Token charge depuis le container sonarqube." -ForegroundColor DarkGray
    }
}

function Stop-Sonar {
    Write-Host "Arret de SonarQube..." -ForegroundColor Yellow
    docker compose -f $COMPOSE_FILE down
}

function Wait-Sonar {
    Write-Host "Attente que SonarQube soit pret..." -ForegroundColor Yellow
    $attempts = 0
    while ($attempts -lt 30) {
        try {
            $r = Invoke-WebRequest -Uri "$SONAR_URL/api/system/status" -UseBasicParsing -ErrorAction Stop
            $s = ($r.Content | ConvertFrom-Json).status
            if ($s -eq "UP") {
                Write-Host "SonarQube est pret !" -ForegroundColor Green
                return
            }
        } catch {}
        $attempts++
        Write-Host "  Tentative $attempts/30..." -ForegroundColor DarkGray
        Start-Sleep -Seconds 10
    }
    Write-Host "SonarQube n'a pas demarre a temps." -ForegroundColor Red
    exit 1
}

function Get-Gradlew {
    param([string]$ModulePath)
    # Gradlew dans le module lui-meme
    if (Test-Path "$ModulePath\gradlew") { return "$ModulePath\gradlew" }
    # Sinon, chercher dans les modules voisins (premier trouve)
    foreach ($m in $JAVA_MODULES) {
        $candidate = "$ROOT\$m\gradlew"
        if (Test-Path $candidate) { return $candidate }
    }
    return $null
}

function Analyze-Java {
    param([string]$Name)
    $path = "$ROOT\$Name"
    if (-not (Test-Path $path)) {
        Write-Host "Module '$Name' introuvable." -ForegroundColor Red
        return
    }
    $gradlew = Get-Gradlew -ModulePath $path
    if (-not $gradlew) {
        Write-Host "SKIP : $Name (aucun gradlew trouve)" -ForegroundColor DarkYellow
        return
    }
    Write-Host ""
    Write-Host "==> Analyse Java : $Name" -ForegroundColor Cyan
    Push-Location $path
    if ($Token) {
        & $gradlew test jacocoTestReport sonar "-Dsonar.token=$Token"
    } else {
        & $gradlew sonar
    }
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK : $Name" -ForegroundColor Green
    } else {
        Write-Host "ERREUR : $Name" -ForegroundColor Red
    }
    Pop-Location
}

function Analyze-Front {
    Write-Host ""
    Write-Host "==> Analyse Frontend..." -ForegroundColor Cyan
    if (-not (Get-Command sonar-scanner -ErrorAction SilentlyContinue)) {
        Write-Host "sonar-scanner introuvable. Installez-le : npm install -g sonarqube-scanner" -ForegroundColor Red
        return
    }
    Push-Location "$ROOT\front"
    if ($Token) {
        sonar-scanner "-Dsonar.token=$Token"
    } else {
        sonar-scanner
    }
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK : front" -ForegroundColor Green
    } else {
        Write-Host "ERREUR : front" -ForegroundColor Red
    }
    Pop-Location
}

function Ensure-Sonar-Running {
    try {
        $r = Invoke-WebRequest -Uri "$SONAR_URL/api/system/status" -UseBasicParsing -ErrorAction Stop
        $s = ($r.Content | ConvertFrom-Json).status
        if ($s -eq "UP") {
            # SonarQube tourne, mais sonar-init est peut-etre encore en cours
            Wait-SonarInit
            return
        }
    } catch {}
    Start-Sonar
}

# --- Main ---

if ($Stop) {
    Stop-Sonar
    exit 0
}

if ($Start) {
    Start-Sonar
    Write-Host ""
    Write-Host "SonarQube disponible sur : $SONAR_URL" -ForegroundColor Green
    exit 0
}

Ensure-Sonar-Running

# Charger le token automatiquement depuis le container
if (-not $Token) {
    $Token = Get-SonarToken
    if ($Token) {
        Write-Host "Token charge automatiquement depuis le container SonarQube." -ForegroundColor DarkGray
    } else {
        Write-Host "WARN : Aucun token disponible. Lancez d'abord : .\sonar-analyze.ps1 -Start" -ForegroundColor Yellow
    }
}

if ($All) {
    foreach ($m in $JAVA_MODULES) { Analyze-Java -Name $m }
    Analyze-Front
} elseif ($Module -eq "front") {
    Analyze-Front
} elseif ($Module -ne "") {
    if ($JAVA_MODULES -contains $Module) {
        Analyze-Java -Name $Module
    } else {
        Write-Host "Module inconnu : $Module" -ForegroundColor Red
        Write-Host "Modules disponibles : auth, combat, common, common-auth, invocation, monster, player, front"
        exit 1
    }
} else {
    Write-Host "Usage:"
    Write-Host "  .\sonar-analyze.ps1 -Start"
    Write-Host "  .\sonar-analyze.ps1 -Stop"
    Write-Host "  .\sonar-analyze.ps1 -Module auth"
    Write-Host "  .\sonar-analyze.ps1 -Module front"
    Write-Host "  .\sonar-analyze.ps1 -All"
    Write-Host "  .\sonar-analyze.ps1 -All -Token squ_xxxx"
}
