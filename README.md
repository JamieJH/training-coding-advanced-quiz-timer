# Capital Cities Quiz
- A small website that show a timer, when user press the start button, start the quiz with some random question.
- Upon starting the quiz, a answer box is enabled for user to enter their question.
- For multiple choices questions, user can select only one from the available answers.
- The timer stops when user press the stop button, whatever entered in the answer box is considered the final answer.
- With multiple choices questions, the timer stop when an answer is selected.
- Only multiple choices questions are marked.
- Each correct answer reward 1 point to the total score.
- This project does not use any library.


### Getting questions
- The questions are taken from the `questions.json` files via `fetch`.
- The chosen port for VSCode editor is **5505**, this port is used to read data from `questions.json`. 
- If another port is used (i.e. by using another editor or change the port setting in `.vscode/settings.json`), change the `PORT` constant in `question.js` file accordingly.