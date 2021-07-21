class Quiz {
    #type;
    #question;
    #correctAnswer;

    constructor(type, question, correctAnswer) {
        this.#type = type;
        this.#question = question;
        this.#correctAnswer = correctAnswer
    }

    getQuestion() {
        return this.#question;
    }

    getType() {
        return this.#type;
    }

    getCorrectAnswer() {
        return this.#correctAnswer;
    }

}

class QuizText extends Quiz {
    constructor(question, correctAnswer) {
        super("text", question, correctAnswer);
    }
}

class QuizMultipleChoices extends Quiz {
    #incorrectChoices;

    constructor(question, correctChoice, incorrectChoices) {
        super("multiple choices", question, correctChoice);
        this.#incorrectChoices = incorrectChoices;
    }

    getAllChoices() {
        const correctChoice = super.getCorrectAnswer();
        const incorrectChoices = this.getIncorrectChoices()
        return [correctChoice, ...incorrectChoices];
    }

    getIncorrectChoices() {
        return this.#incorrectChoices;
    }
}

export {QuizText, QuizMultipleChoices}