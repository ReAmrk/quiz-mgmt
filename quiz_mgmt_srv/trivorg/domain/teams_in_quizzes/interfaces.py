from domain.teams.apis import TeamSchemaOut
from domain.quizzes.apis import QuizSchemaOut


class QuizInterface:

    def get_quiz(self):
        return QuizSchemaOut


class TeamInterface:

        def get_team(self):
            return TeamSchemaOut