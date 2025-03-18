# Démarrer pour les dev

```shell
// Installation des dépendances
$ npm i
$ npm run back:install

// Démarrage des services
$ npm run back:dev
$ npm run dev
```

# Démarrage de l'application.

Il sera nécessaire de générer une nouvelle clé d'api pour pouvoir accèder aux données.
A savoir que pour la modifier il faudra modifier la fichier config.py.

```shell
$ cd backend
$ pip install -r requirements.txt
// Si cela ne fonctionne pas, pip install fastapi uvicorn pydantic

$ python main.py
// Aller sur la page : http://localhost:8080/index.html
```