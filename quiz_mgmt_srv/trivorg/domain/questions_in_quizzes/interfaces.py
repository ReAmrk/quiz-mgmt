from domain.quizzes.apis import QuizSchemaOut
from domain.questions.apis import QuestionSchemaOut


class QuizInterface:

    def get_quiz(self):
        return QuizSchemaOut


class QuestionInterface:

        def get_question(self):
            return QuestionSchemaOut