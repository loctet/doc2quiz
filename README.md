# Doc2Quiz - Google Docs to Google Forms Quiz Generator

This Google Apps Script project automatically converts a structured Google Doc into a Google Forms quiz. It supports multiple levels, various question types, and includes features like explanations and shuffled answers.

## Document Structure

Your Google Doc should follow this specific structure:

### 1. Title and Description
- First line: Quiz title
- Description (optional): Enclosed between triple asterisks `***`

Example:
```
My Awesome Quiz
***This quiz covers important concepts about JavaScript programming***
```

### 2. Levels/Sections
Each level starts with a dash `-` and can include an optional description starting with `//`

Example:
```
-Level 1: Basic Concepts
//This section covers fundamental concepts
```

### 3. Questions
Each question should follow this format:

```
Question 1: What is JavaScript?
A. A programming language
B. A markup language
C. A database system
D. An operating system (Correct)

Explication
JavaScript is a high-level, interpreted programming language that enables interactive web pages.
```

#### Question Structure Rules:
1. Each question must start with "Question X:" where X is the question number
2. The question text should be on the next line
3. Answer options should be on separate lines, starting with letters (A, B, C, D, etc.)
4. Correct answers should be marked with `(Correct)` at the end of the line
5. Optional explanation should be separated by a blank line and start with "Explication"

### Complete Example Document

```
JavaScript Fundamentals Quiz
***Test your knowledge of JavaScript programming basics***

-Level 1: Basic Concepts
//This section covers fundamental JavaScript concepts

Question 1: What is JavaScript?
A. A programming language
B. A markup language
C. A database system
D. An operating system (Correct)

Explication
JavaScript is a high-level, interpreted programming language that enables interactive web pages.

Question 2: Which of the following are JavaScript data types? (Select all that apply)
A. String (Correct)
B. Integer
C. Boolean (Correct)
D. Float
E. Object (Correct)

Explication
JavaScript has several data types including String, Boolean, Object, Number, Undefined, and Symbol.

-Level 2: Advanced Concepts
//This section covers more advanced JavaScript topics

Question 3: What is a closure in JavaScript?
A. A way to close browser windows
B. A function that has access to variables in its outer scope (Correct)
C. A method to close database connections
D. A way to end program execution

Explication
A closure is a function that has access to variables in its outer scope, even after the outer function has returned.
```

## Features

- Automatically creates a Google Form quiz from your document
- Supports multiple levels/sections
- Handles both single-answer and multiple-answer questions
- Includes explanations as feedback for correct/incorrect answers
- Randomizes answer options
- Supports optional descriptions for each level
- Progress bar enabled
- Points system (1 point per question)

## How to Use

1. Create a new Google Doc
2. Structure your content following the format above
3. Open the Google Apps Script editor
4. Copy the `creerQuizDepuisDoc.js` code into a new script
5. Run the `creerQuizDepuisDoc()` function
6. The script will create a new Google Form quiz and return its edit URL

## Notes

- Make sure to follow the exact formatting specified above
- Question numbers should be sequential
- Answer options must start with capital letters (A, B, C, etc.)
- Correct answers must be marked with `(Correct)`
- Explanations are optional but recommended for better learning
- The script will automatically shuffle answer options for each question 