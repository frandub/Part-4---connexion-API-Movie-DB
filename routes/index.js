
//CECI EST LE FICHIER BACKEND QUI CONTIENT MES ROUTES !!!!!!!


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//initialisation du module request qui permet de taper ds une API
var request = require('request');
//initialisation du module request qui permet de mongoDB
var mongoose= require('mongoose');







// CONNEXION MONGO  et creation d'une collection
var options = {
  server: { socketOptions: {connectTimeoutMS: 5000 } }};
  mongoose.connect('mongodb://user_mymovies:pw_mymovies1@ds227821.mlab.com:27821/database_mymovies',      options,              function(err) {      console.log(err);     } );


/*
● Dans le fichier  routes/index.js,   définissez une variable  movieSchema  qui contiendra le schéma des données relatives aux films “ likés ”. Le schéma devra posséder les propriétés suivantes:
★ poster_path  en tant que chaîne de caractères
★ overview  en tant que chaîne de caractères
★ title  en tant que chaîne de caractères
★ idMovieDB  en tant que nombre
● Dans une variable  movieModel  définissez un modèle qui fonctionnera sur la collection  movies  et qui utilisera le schéma précédemment créé.
*/
var movieSchema = mongoose.Schema({     poster_path: String,  overview:String,    title: String,     idMovieDB: String });
var movie_modele = mongoose.model('movie_collections', movieSchema);






/*INSTRUCTIONS/
La première étape avant de commencer est d’établir un état des lieux des
questions et des réponses attendues par l’application Front end. Si on résume,
l’application Front end va devoir demander au Backend:
★ La liste des films récents
★ De sauvegarder les films likés
★ De récupérer les films likés pour les afficher au chargement de l’application
★ De supprimer les films likés dans le cas où l'utilisateur les dislikes

Création des routes dans le fichier  routes/index.js
● Créez une route en méthode GET nommée
● Créez une route en méthode GET nommée
● Créez une route en méthode POST nommée
● Créez une route en méthode DELETE nommée

  aura besoin pour fonctionner de l’identifiant du film que l’on souhaite supprimer. Faites en sorte que cette information fasse parti de l’URL et non des paramètres GET. Nommez cette information  position
● Pour le moment chacune de ces routes renverra simplement un objet JSON qui contiendra une propriété  result  initialisée à  true
● Testez les routes avec Postman. Vous devriez pour chacune d’elles avoir comme réponse l’objet suivant  {  result :  true  }

*/





/*
VOici  ma clé APIS movieDB: bf7c9c4c0ede66f91731b0895e435b2d

D’un point de vue fonctionnel, la route qui à la responsabilité de nous délivrer les films récents est la route GET nommée  /movie
Son objectif sera d’interroger l’API et de renvoyer sa réponse.
Lire les films récents
● Installez et initialisez dans le projet le module request
● Dans la route  /movie  interroger l’API en utilisant les mêmes paramètres que
ceux que vous avez testé et validé à l’étape précédente
Note:
Attention au format de retour de l’API, il faudra réaliser une opération pour
convertir les données au format JSON
● Modifiez la réponse mise en oeuvre précédemment en la remplaçant par la
réponse reçue de la part de l’API
Note:
Attention au côté asynchrone, vous pouvez renvoyer un résultat au navigateur
que lorsque vous avez la garantie d’avoir reçu le résultat de l’API
● Testez la route avec Postman, vous devriez avoir comme retour le même
résultat que celui reçu en utilisant directement l’API
*/











/* GET . */
router.get('/movie', function(req, res, next) {
        //cette route me sert a faire 1 requete movieDB pour afficher des films
        //je connecte l'API de openweathermap     -->  mon API key personnelle de francois dubois : bf7c9c4c0ede66f91731b0895e435b2d
      //  request("https://api.themoviedb.org/3/search?api_key=bf7c9c4c0ede66f91731b0895e435b2d&", function(error, response, body) {
        request("https://api.themoviedb.org/3/discover/movie?api_key=bf7c9c4c0ede66f91731b0895e435b2d&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1", function(error, response, body) {

        //Even more powerful, you can issue multiple requests, just comma separate the values:
        //https://api.themoviedb.org/3/movie/157336?api_key={api_key}&append_to_response=videos,images
        Body_converti = JSON.parse(body);
        });

res.json( {Body_converti });
});












/*  ROUTE POUR afficher les films favoris */
router.get('/mymovies', function(req, res, next) {
  res.json({  result :  true  });
});










/* ROUTE POUR ENREGISTRER (POST)  UN FILM FAVORI */
router.post('/mymovies', function(req, res, next) {


  //NOUVELLE VERSION : ON ENREGISTRE DIRECTEMENT TOUT DANS LA BASE MONGO DB
          //UN AJOUT DANS DANS MONGODB se fait toujours en 2 TEMPS:
                //d’abord preparer  les données
                var mesdonneesApusher = new movie_modele ({
                    poster_path:req.body.poster_path,
                    overview: req.body.overview ,
                    title:req.body.title ,
                    idMovieDB:req.body.idMovieDB
                   });
                //puis les pusher d’un coup !
                mesdonneesApusher.save(

                   function (sonErreur, sonMessage) {
                     //CHARGEMENT DE LA BASE MISE A JOUR POUR LA RENVOYER AU FRONT END
                     //ATTENTION ATTENTION, pour ne pas que le parse trace sa route et continue d'executer les scripts sans attendre les reponses de l'API puis de la MONGODB, ben il faut absolument ibriquer tout ca les uns dans les autres
                     //donc faut imbriquer API>push BDD>find BDD   et dedans je renvoue ma page index > et là slt je peux sortir de ces 3 boucles
                             movie_modele.find(
                               //attention, le find renvoie TOUTE LA COLLECTION
                                  function (nomdonneaumessageErreur, movie_collections) {
                                     //ALORS ICI ATTENTION ATTENTION!!! LE RES.json doit absolument etre executé QUE LORSQUE on a fini d'éxécuter la fonction REQUEST de l'API!!!!!!
                                     //au debut j'avais fait l'erreur de laisser a la fin mais ca ne pouvait pas fair le render vers index.ejs car il renvoyait la page avant d'avoir fini la route.
                                     console.log('totoooooooooooooooooooooooooooooo')
                                     console.log(movie_collections)
                                     console.log(sonErreur)

                                      res.json({  movie_collections });
                                  });
                   }
                 );
                //---------------------------------
});















/* ROUTE POUR SUPPRIMER UN FILM FAVORI  */
router.delete('/mymovies', function(req, res, next) {
                          //ON ENREGISTRE DIRECTEMENT TOUT DANS LA BASE MONGO DB
                          movie_modele.remove({ idMovieDB:req.body.filmAsupprimer},
                          function(error) {
                          });
                        //PUIS CHARGEMENT DE LA BASE MISE A JOUR POUR LA RENVOYER AU FRONT END
                        //a present que je viens d'ajouter une ligne dans ma collection, il faut que j'afiche tout le contenu de ma collection!
                        // donc je  charge tout le contenu de ma collection dans une variable appelée "movie_collections", et je la renvoie coté backend
                                movie_modele.find(
                                     function (nomdonneaumessageErreur, movie_collections) {
                                        movie_collections_temporaire = movie_collections
                                        console.log('movie_collections contient tous ces trucs',  movie_collections);
                                        console.log('nomdonneaumessageErreur',  nomdonneaumessageErreur);
                                        //je renvoie ma page index dans ma fonction adressée a mongodb come ça suis sur d'avoir fait  la modif avant de renvoyer
                                        res.render('index', { title: 'Express' , movie_collections_renvoye:movie_collections_temporaire });
                                     }
                                    );

  res.json({  result :  'effacement fait'   });
});






module.exports = router;
