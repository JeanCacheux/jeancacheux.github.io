# Site personnel de Jean Cacheux

Site statique conçu pour GitHub Pages.

## Mise en ligne depuis un iPad

1. Ouvrez le dépôt `jeancacheux.github.io` dans Safari.
2. Passez le dépôt en **Public** dans `Settings > General > Danger Zone > Change repository visibility`.
3. Revenez à l'onglet **Code**.
4. Appuyez sur **Add file**, puis **Upload files**.
5. Décompressez d'abord le fichier ZIP dans l'application **Fichiers** de l'iPad.
6. Téléversez à la racine du dépôt :
   - `index.html`
   - `styles.css`
   - `script.js`
7. Validez avec **Commit changes**.
8. Dans `Settings > Pages`, choisissez :
   - Source : `Deploy from a branch`
   - Branch : `main`
   - Folder : `/ (root)`
9. Le site sera disponible à l'adresse :
   `https://jeancacheux.github.io`

## Personnalisation

Dans `index.html`, remplacez notamment :

- `prenom.nom@cnrs.fr`
- `Nom du laboratoire`
- `Adresse du laboratoire`
- les titres et liens des publications
- les liens HAL, Google Scholar et ORCID
- les membres de l'équipe
- les projets publics

Les couleurs et la mise en page se trouvent dans `styles.css`.
