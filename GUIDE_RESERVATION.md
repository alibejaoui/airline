# 🛫 Guide de Réservation - Maervia Airways

Ce guide t'explique comment réserver un vol dans l'application Maervia Airways.

## 📋 Prérequis

1. **Backend démarré** : Le serveur Node.js doit être en cours d'exécution
   ```bash
   cd backend
   npm run dev
   ```

2. **Frontend démarré** : L'application Angular doit être en cours d'exécution
   ```bash
   cd frontend/air
   npm start
   ```

3. **Base de données** : MongoDB doit être connecté et accessible

## 🚀 Étapes pour réserver un vol

### Étape 1 : Insérer des vols dans la base de données

Pour avoir des vols disponibles, tu dois d'abord les insérer dans MongoDB. Deux options :

#### Option A : Utiliser le script de seed (RECOMMANDÉ)

```bash
cd backend
npm run seed:flights
```

Ce script insère automatiquement plusieurs vols, dont le vol MA100 que tu veux réserver.

#### Option B : Insérer via Postman/Thunder Client

1. Crée d'abord un utilisateur admin :
   - **POST** `http://localhost:3000/api/auth/register`
   - Body (JSON) :
     ```json
     {
       "name": "Admin User",
       "email": "admin@example.com",
       "password": "Admin123!",
       "role": "admin"
     }
     ```
   - Copie le `token` reçu dans la réponse

2. Connecte-toi pour obtenir un token :
   - **POST** `http://localhost:3000/api/auth/login`
   - Body (JSON) :
     ```json
     {
       "email": "admin@example.com",
       "password": "Admin123!"
     }
     ```
   - Copie le `token` reçu

3. Insère le vol :
   - **POST** `http://localhost:3000/api/flights`
   - Header : `Authorization: Bearer <ton_token>`
   - Body (JSON) :
     ```json
     {
       "number": "MA100",
       "airline": "Maervia Airways",
       "from": "Tunis (TUN)",
       "to": "Paris (CDG)",
       "departureTime": "2025-12-10T09:30:00.000Z",
       "arrivalTime": "2025-12-10T12:15:00.000Z",
       "durationMinutes": 165,
       "cabin": "Economy",
       "price": 470.00,
       "seats": 120,
       "status": "scheduled",
       "aircraft": "Airbus A320"
     }
     ```

### Étape 2 : Créer un compte utilisateur

1. Va sur `http://localhost:4200/inscription` ou clique sur "Sign up" dans le menu
2. Remplis le formulaire d'inscription
3. Une fois inscrit, tu seras automatiquement connecté

### Étape 3 : Rechercher un vol

1. Va sur la page d'accueil (`http://localhost:4200`)
2. Remplis le formulaire de recherche :
   - **From** : `Tunis (TUN)` ou simplement `Tunis`
   - **To** : `Paris (CDG)` ou simplement `Paris`
   - **Departure date** : `2025-12-10` (ou la date du vol que tu cherches)
   - **Cabin** : `Economy`
3. Clique sur "Search flights"

### Étape 4 : Réserver le vol

1. Dans les résultats de recherche, clique sur "View flight" pour le vol MA100
2. Sur la page de détails du vol :
   - Sélectionne le nombre de sièges (par défaut : 1)
   - Clique sur "Confirm booking"

#### Si tu n'es pas connecté :

- Si tu n'as pas encore créé de compte, tu seras automatiquement redirigé vers la page de connexion
- Après connexion, tu seras automatiquement ramené sur la page du vol
- Clique à nouveau sur "Confirm booking"

### Étape 5 : Confirmation

Une fois la réservation confirmée, tu verras un message de succès :
```
Booking confirmed for X seat(s). Check your account for details.
```

## 🔧 Dépannage

### "No flights match your route and date"

- Vérifie que les vols sont bien insérés dans la base de données
- Vérifie que la date de recherche correspond à la date du vol
- Vérifie que les noms des villes sont corrects (ex: "Tunis" et "Paris")

### "Please sign in to confirm your booking"

- Connecte-toi d'abord via `/connexion`
- Ou crée un compte via `/inscription`

### Erreur 401 (Unauthorized)

- Ton token a expiré ou est invalide
- Connecte-toi à nouveau pour obtenir un nouveau token

### Le serveur ne répond pas

- Vérifie que le backend est bien démarré (`npm run dev` dans `backend/`)
- Vérifie que MongoDB est bien connecté
- Vérifie les logs du serveur pour voir les erreurs

## 📝 Notes importantes

- Le champ `bookedSeats` dans ton JSON n'est pas nécessaire - le système utilise seulement `seats` pour gérer la disponibilité
- Après chaque réservation, le nombre de sièges disponibles est automatiquement mis à jour
- Les réservations sont liées à l'utilisateur connecté
- Seuls les admins peuvent créer/modifier/supprimer des vols

