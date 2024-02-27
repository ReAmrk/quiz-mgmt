from domain.teams.apis import TeamSchemaOut


class TeamInterface:

    def get_teams(self):
        return TeamSchemaOut
