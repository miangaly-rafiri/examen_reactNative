#  MyBook 

Une appli React Native/Expo pour gérer une bibliothèque personnelle

# Fonctionnalités

## Gestion des livres
- **Ajouter** un nouveau livre avec tous ses détails
- **Modifier** les informations d'un livre existant
- **Supprimer** des livres sur collections
- **Marquer** comme lu/non lu et favoris
- **Noter** les livres sur 5 étoiles
- **Ajouter des notes** personnelles pour chaque livre

## Recherche et filtres
- **Recherche** en temps réel par titre ou auteur
- **Filtrer** par statut (lu/non lu, favoris)
- **Trier** par :
  - Nom (A-Z, Z-A)
  - Année (croissant, décroissant)
  - Date d'ajout
  - Notes

## Gestion des images
- **Ajouter une couverture** depuis la galerie
- **Prendre une photo** avec l'appareil photo
- **Visualiser** les couvertures en grand format

## Connexion/déconnexion
- **Mode hors ligne** : utilisation complète sans internet
- **Synchronisation automatique** quand la connexion revient
- **Données stockées** localement sur l'appareil

## Paramètres
- **Thème** : clair, sombre ou automatique
- **Synchronisation** : activer/désactiver la sync auto
- **Notifications** : préférences de notifications
- **Statut** : voir l'état de la connexion et du stockage

## Statistiques
- **Nombre total** de livres
- **Livres lus** vs non lus
- **Pourcentage** de livres complétés
- **Répartition** par année
- **Moyenne** des notes

## Installation

1. **Cloner le projet**
   ```bash
   git clone [ton-repo]
   cd my-book-app
   lancer : npx expo start 

# Pour le téléphone portable 
Installez Expo Go sur le téléphone
Dans VSCode, ouvrez le terminal
``` Tapez npx expo start
Scannez le QR code avec votre téléphone

### Configuration réseau importante : 
Dans le `server.js`, ajoutez `'0.0.0.0'` pour que le serveur accepte les connexions de votre téléphone sur le même WiFi.

# Si ça ne marche pas: 
Trouvez l'IP de son ordinateur :
- Ouvrez le terminal dans VSCode
```Windows : ipconfig → cherchez "IPv4 Address" 
```Mac : ifconfig | grep "inet " | grep -v 127.0.0.1
- Récupérer cet adresse IP et le mettre dans le Service (front) à la place de l'url de l'API : localhost:3000
- Remplacez localhost par l'IP de son ordinateur
 - Redémarrez expo

