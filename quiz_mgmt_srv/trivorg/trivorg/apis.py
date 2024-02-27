from ninja import NinjaAPI

api = NinjaAPI(version='1.0.0')

api.add_router('categories', "domain.categories.apis.router")
api.add_router('questions', "domain.questions.apis.router")
api.add_router('participants', "domain.participants.apis.router")
api.add_router('teams', "domain.teams.apis.router")