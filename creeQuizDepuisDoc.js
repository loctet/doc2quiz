function creerQuizDepuisDoc() {
  //Recuper l'ID du document
  var numid = DocumentApp.getActiveDocument().getId();
  // Ouvre le document Google Doc à partir de son ID
  var doc = DocumentApp.openById(numid);
  //const doc = DocumentApp.getActiveDocument();
  var contenu = doc.getBody().getText();
  
  // Crée un nouveau formulaire Google Forms
  var form = FormApp.create(doc.getName())
                    .setDescription('Quiz généré automatiquement depuis un document Google Doc');

  // Découpe le texte en différentes questions sur la base du format spécifié
  var questions = contenu.split(/\n(?=Question \d+ :)/);

  // Traite chaque question du document
  questions.forEach(function(questionTexte) {
    // Sépare chaque question de son explication
    var sections = questionTexte.trim().split(/Explication\n/);
    var explication = sections[1] ? sections[1].trim() : '';

    // Fractionne en lignes pour isoler et supprimer "Question X :"
    var lignes = sections[0].split('\n');
    lignes.shift(); // Supprime la ligne "Question X :"
    var titreQuestion = lignes.shift().trim(); // Récupère la vraie question
    var optionsTexte = lignes.join('\n');

    var choix = [];
    var bonnesReponses = [];

    // Parcourt chaque option de réponse pour déterminer les bonnes réponses
    optionsTexte.split('\n').forEach(function(option){
      // Supprime les lettres (A., B., etc.) devant les options
      var opt = option.replace(/^[A-Z]\.\s*/, '').trim();
      if(opt){
        var estCorrect = opt.includes('(correct)') || opt.includes('(Correct)');
        opt = opt.replace(/\(correct\)|\(Correct\)/, '').trim();
        choix.push(opt);
        if (estCorrect) bonnesReponses.push(opt);
      }
    });

    var item;

    // Vérifie s'il y a plusieurs bonnes réponses ou une seule
    if (bonnesReponses.length > 1) {
      // Question à choix multiples
      item = form.addCheckboxItem().setTitle(titreQuestion);
      item.setChoices(choix.map(function(choixTexte){
        return item.createChoice(choixTexte, bonnesReponses.includes(choixTexte));
      }));
    } else {
      // Question à choix unique
      item = form.addMultipleChoiceItem().setTitle(titreQuestion);
      item.setChoices(choix.map(function(choixTexte){
        return item.createChoice(choixTexte, choixTexte === bonnesReponses[0]);
      }));
    }

    // Configure la question en mode quiz
    form.setIsQuiz(true);
    item.setPoints(1);
    item.setRequired(true);

    // Ajoute l'explication comme feedback après chaque réponse
    if (explication) {
      var feedback = FormApp.createFeedback().setText(explication).build();
      item.setFeedbackForCorrect(feedback)
          .setFeedbackForIncorrect(feedback);
    }

  });

  // Affiche une alerte avec l'URL du formulaire créé
  Logger.log('Formulaire créé avec succès : ' + form.getEditUrl());
}
