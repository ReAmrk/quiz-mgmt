from ninja_extra import NinjaExtraAPI
from ninja_jwt.authentication import JWTAuth
from ninja_jwt.controller import NinjaJWTDefaultController

api = NinjaExtraAPI(version='1.0.0')
api.register_controllers(NinjaJWTDefaultController)


api.add_router('categories', "domain.categories.apis.router", tags=["Categories"], auth=JWTAuth())
api.add_router('questions', "domain.questions.apis.router", tags=["Questions"], auth=JWTAuth())
api.add_router('participants', "domain.participants.apis.router", tags=["Participants"], auth=JWTAuth())
api.add_router('teams', "domain.teams.apis.router", tags=["Teams"], auth=JWTAuth())
api.add_router('quizzes', "domain.quizzes.apis.router", tags=["Quizzes"], auth=JWTAuth())
api.add_router('questions_in_quizzes', "domain.questions_in_quizzes.apis.router", tags=["Questions in Quizzes"], auth=JWTAuth())
api.add_router('teams_in_quizzes', "domain.teams_in_quizzes.apis.router", tags=["Teams in Quizzes"], auth=JWTAuth())
api.add_router('points', "domain.points.apis.router", tags=["Points"], auth=JWTAuth())
