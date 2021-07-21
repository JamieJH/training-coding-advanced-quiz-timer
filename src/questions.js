import { QuizText, QuizMultipleChoices } from "./Quiz.js";

// whatever the port localhost is run on, the port can be changed in .vscode/settings.json if VSCode is used
const PORT = 5505;  

const getQuestions = fetch(`http://localhost:${PORT}/src/questions.json`)
    .then(response => {
        if (response.status === 200 || response.ok) {
            return response.json();
        }
        throw (new Error("Unable to read json file"));
    })
    .then(response => {
        const allQuizes = response.quizes;
        const allQuizesInstances = allQuizes.map(quiz => {
            if (quiz["incorrect-answers"]) {
                return new QuizMultipleChoices(quiz["question"], quiz["correct-answer"], quiz["incorrect-answers"])
            }
            else {
                return new QuizText(quiz["question"], quiz["correct-answer"])
            }
        })

        return allQuizesInstances;
    })
    .catch(error => {
        throw (new Error(error));
    })


export default getQuestions;