document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const appScreen = document.getElementById('app-screen');
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const logoutBtn = document.getElementById('logout-btn');
    const agentNameSpan = document.getElementById('agent-name');

    // Identifiants de démonstration
    const VALID_USER = "admin";
    const VALID_PASS = "12345";

    // Fonction pour télécharger et décompresser le fichier data.json.gz
    async function chargerTableauDepuisGz() {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Chargement et décompression des données en cours...</td></tr>';

        try {
            // 1. Récupération du fichier binaire .gz
            const response = await fetch('data.json.gz');
            if (!response.ok) {
                throw new Error("Impossible de trouver le fichier data.json.gz");
            }

            const buffer = await response.arrayBuffer();

            // 2. Décompression avec la bibliothèque Pako
            const decompressed = pako.inflate(new Uint8Array(buffer), { to: 'string' });
            
            // 3. Conversion du texte JSON en objet JavaScript
            const donnees = JSON.parse(decompressed);

            // 4. Ingestion dans le tableau HTML
            tableBody.innerHTML = '';

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

        } catch (error) {
            console.error('Erreur :', error);
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Erreur lors du chargement des données. Vérifiez que data.json.gz est bien sur GitHub.</td></tr>';
        }
    }

    // Traitement de la connexion
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        if (usernameInput === VALID_USER && passwordInput === VALID_PASS) {
            agentNameSpan.textContent = usernameInput;

            // Déclencher le chargement et la décompression
            chargerTableauDepuisGz();

            loginScreen.classList.add('hidden');
            appScreen.classList.remove('hidden');

            errorMessage.textContent = '';
            loginForm.reset();
        } else {
            errorMessage.textContent = 'Identifiant ou mot de passe incorrect.';
        }
    });

    // Gestion de la déconnexion
    logoutBtn.addEventListener('click', () => {
        appScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    });
});
