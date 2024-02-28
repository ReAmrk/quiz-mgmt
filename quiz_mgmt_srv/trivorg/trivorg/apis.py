from ninja import NinjaAPI

api = NinjaAPI(version='1.0.0')

api.add_router('categories', "domain.categories.apis.router")
api.add_router('questions', "domain.questions.apis.router")
api.add_router('participants', "domain.participants.apis.router")
api.add_router('teams', "domain.teams.apis.router")
api.add_router('quizzes', "domain.quizzes.apis.router")
api.add_router('questions_in_quizzes', "domain.questions_in_quizzes.apis.router")
api.add_router('teams_in_quizzes', "domain.teams_in_quizzes.apis.router")