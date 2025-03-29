function creerQuizDepuisDoc() {
  // Get the active document
  const doc = DocumentApp.getActiveDocument();
  const contenu = doc.getBody().getText();
  
  // Extract title (first line) and description (between *** markers)
  const lines = contenu.split('\n');
  const quizTitle = lines[0].trim();
  const descriptionMatch = contenu.match(/\*\*\*([\s\S]+?)\*\*\*/);
  const quizDescription = descriptionMatch ? descriptionMatch[1].trim() : 'Quiz généré automatiquement depuis un document Google Doc';
  
  // Create the form with extracted title and description
  const form = FormApp.create(quizTitle)
                    .setDescription(quizDescription)
                    .setProgressBar(true)
                    .setCollectEmail(true)
                    .setIsQuiz(true);

  // Process content by levels (sections starting with -)
  const levels = contenu.split(/\n(?=-[^\n]+)/);
  
  // Skip the first part (title/description) if it exists
  if (quizTitle && descriptionMatch) {
    levels.shift();
  }

  levels.forEach(levelContent => {
    // Extract level title (after -) and optional description (after --)
    const levelParts = levelContent.split('\n');
    const levelTitleLine = levelParts.shift().trim();
    const levelTitle = levelTitleLine.replace(/^-/, '').trim();
    
    let levelDescription = '';
    if (levelParts.length > 0 && levelParts[0].startsWith('//')) {
      levelDescription = levelParts.shift().replace(/^\/\//, '').trim();
    }
    
    // Add a section for this level
    const levelSection = form.addPageBreakItem()
                            .setTitle(levelTitle);
    if (levelDescription) {
      levelSection.setHelpText(levelDescription);
    }
    
    // Process questions in this level
    const questions = levelContent.split(/\n(?=Question \d+:)/);
    questions.shift(); // Remove the level title line
    
    questions.forEach(questionText => {
      // Split question and explanation (handles cases where explanation is missing)
      const sections = questionText.trim().split(/(?:Explication\n)?\n\n/);
      const questionPart = sections[0].trim();
      const explanation = sections[1] ? sections[1].trim() : '';
      
      // Extract question number and text
      const questionLines = questionPart.split('\n');
      const questionNumberLine = questionLines.shift();
      const questionTextLine = questionLines.shift().trim();
      
      // Process answer options
      const options = [];
      const correctAnswers = [];
      
      questionLines.forEach(line => {
        if (line.trim() === '') return;
        
        // Extract option letter and text
        const optionMatch = line.match(/^([A-Z])\.\s*(.+?)(\s*\(Correct\))?$/i);
        if (optionMatch) {
          const optionLetter = optionMatch[1];
          let optionText = optionMatch[2].trim();
          const isCorrect = optionMatch[3] !== undefined;
          
          options.push(optionText);
          if (isCorrect) {
            correctAnswers.push(optionText);
          }
        }
      });
      
      // Shuffle the options
      const shuffledOptions = shuffleArray(options);
      
      // Create the question item
      let item;
      if (correctAnswers.length > 1) {
        // Checkbox question (multiple correct answers)
        item = form.addCheckboxItem()
                  .setTitle(questionTextLine)
                  .setRequired(true);
        
        const choices = shuffledOptions.map(option => {
          return item.createChoice(option, correctAnswers.includes(option));
        });
        item.setChoices(choices);
      } else {
        // Multiple choice question (single correct answer)
        item = form.addMultipleChoiceItem()
                  .setTitle(questionTextLine)
                  .setRequired(true);
        
        const choices = shuffledOptions.map(option => {
          return item.createChoice(option, option === correctAnswers[0]);
        });
        item.setChoices(choices);
      }
      
      // Set points and feedback (only if explanation exists)
      item.setPoints(1);
      if (explanation && explanation !== '') {
        const feedback = FormApp.createFeedback()
                             .setText(explanation)
                             .build();
        item.setFeedbackForCorrect(feedback)
            .setFeedbackForIncorrect(feedback);
      }
    });
  });
  
  Logger.log('Formulaire créé avec succès : ' + form.getEditUrl());
  return form.getEditUrl();
}

// Helper function to shuffle an array
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}