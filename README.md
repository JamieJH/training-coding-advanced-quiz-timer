# Capital Cities Quiz
- A small website that show a timer, when user press the start button, start the quiz with some random question.
- Upon starting the quiz, a answer box is enabled for user to enter their question.
- The timer stops when user press the stop button, whatever entered in the answer box is considered the final answer.
- This project does not use any library.


### Getting questions
- The questions are taken from the `questions.json` files via `fetch`.
- The chosen port for VSCode editor is **5505**, this port is used to read data from `questions.json`. 
- If another port is used (i.e. by using another editor or change the port setting in `.vscode/settings.json`), change the `PORT` constant in `question.js` file accordingly.