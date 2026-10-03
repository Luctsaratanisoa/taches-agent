document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const appScreen = document.getElementById('app-screen');
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const logoutBtn = document.getElementById('logout-btn');
    const agentNameSpan = document.getElementById('agent-name');

    // Variable globale pour stocker les données du JSON
    let donneesGlobales = [];

    // 1. Préchargement et décompression de data.json.gz
    async function préchargerDonnees() {
        try {
            const response = await fetch('data.json.gz');
            if (!response.ok) {
                throw new Error("Fichier data.json.gz introuvable");
            }

            const buffer = await response.arrayBuffer();
            // Décompression avec la bibliothèque Pako
            const decompressed = pako.inflate(new Uint8Array(buffer), { to: 'string' });
            donneesGlobales = JSON.parse(decompressed);

            console.log("Données chargées :", donneesGlobales.length, "lignes");
        } catch (error) {
            console.error('Erreur lors du préchargement :', error);
            errorMessage.textContent = "Erreur de chargement des données. Vérifiez le fichier data.json.gz.";
        }
    }

    // Lancement du chargement au démarrage
    préchargerDonnees();

    // 2. Traitement de la connexion
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        if (donneesGlobales.length === 0) {
            errorMessage.textContent = "Les données sont en cours de chargement, veuillez repatienter un instant...";
            return;
        }

        // Vérification de l'agent avec _responsible et password_EQ
        const agentTrouve = donneesGlobales.find(item => {
            const loginOK = item._responsible && String(item._responsible).trim() === usernameInput;
            const passOK = item.password_EQ && String(item.password_EQ).trim() === passwordInput;
            return loginOK && passOK;
        });

        if (agentTrouve) {
            // Mise à jour du nom de l'agent affiché
            agentNameSpan.textContent = usernameInput;

            // Filtrage des tâches rattachées à cet identifiant _responsible
            const tachesAgent = donneesGlobales.filter(item => 
                item._responsible && String(item._responsible).trim() === usernameInput
            );

            afficherTableau(tachesAgent);

            // Changement d'écran
            loginScreen.classList.add('hidden');
            appScreen.classList.remove('hidden');

            errorMessage.textContent = '';
            loginForm.reset();
        } else {
            errorMessage.textContent = 'Identifiant (_responsible) ou mot de passe (password_EQ) incorrect.';
        }
    });

    // 3. Injection des données filtrées dans le tableau HTML
    function afficherTableau(donnees) {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';

        if (donnees.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Aucune tâche enregistrée pour cet agent.</td></tr>';
            return;
        }

        donnees.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.fkt_recherche || ''}</td>
                <td>${item.code_den || ''}</td>
                <td>${item.GPS_Lat_ZD || ''}</td>
                <td>${item.GPS_Long_ || ''}</td>
                <td>${item.description || ''}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // 4. Déconnexion
    logoutBtn.addEventListener('click', () => {
        appScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    });
});
