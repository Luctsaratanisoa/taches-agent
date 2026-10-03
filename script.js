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

    // Fonction pour charger et lire le fichier data.csv
    async function chargerTableauDepuisCSV() {
        try {
            const response = await fetch('data.csv');
            if (!response.ok) {
                throw new Error("Impossible de trouver le fichier data.csv");
            }
            
            const csvText = await response.text();
            
            // Découpage du fichier par ligne
            const lignes = csvText.trim().split(/\r?\n/);
            const tableBody = document.getElementById('table-body');
            tableBody.innerHTML = '';

            // Lecture à partir de la ligne 1 (en ignorant les en-têtes à la ligne 0)
            for (let i = 1; i < lignes.length; i++) {
                if (!lignes[i].trim()) continue;
                
                // Séparation par virgule
                const colonnes = lignes[i].split(',');

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${colonnes[0] || ''}</td>
                    <td>${colonnes[1] || ''}</td>
                    <td>${colonnes[2] || ''}</td>
                    <td>${colonnes[3] || ''}</td>
                    <td>${colonnes[4] || ''}</td>
                `;
                tableBody.appendChild(row);
            }
        } catch (error) {
            console.error('Erreur :', error);
            alert("Erreur lors du chargement des données CSV.");
        }
    }

    // Traitement de la connexion
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        if (usernameInput === VALID_USER && passwordInput === VALID_PASS) {
            agentNameSpan.textContent = usernameInput;

            // Chargement du fichier CSV
            chargerTableauDepuisCSV();

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
