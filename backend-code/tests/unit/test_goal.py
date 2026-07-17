from uuid import uuid4
from models.models import GoalRow
from services.goal_service_class import GoalService
from tests.util import generate_random_string
from schema.goal_schema import GoalCreateSchema

def test_get_none(goal_service: GoalService):
    goal_get = goal_service.get_goal(uuid4())
    assert goal_get == None

def test_add_goal(goal_service: GoalService):
    goal = goal_service.add_goal(GoalCreateSchema(name=generate_random_string(10), target=3000))
    goal_get = goal_service.get_goal(goal.id)
    assert goal == goal_get

def test_count_goal(goal_service: GoalService):
    goal_count = 9
    for _ in range(goal_count):
        goal_service.add_goal(GoalCreateSchema(name=generate_random_string(10), target=3000))
    goal_service.add_goal(GoalCreateSchema(name=generate_random_string(10), target=3000, active=False))
    total = goal_service.count_goal(GoalRow.active == True)
    assert total == goal_count
    total_non_active = goal_service.count_goal(GoalRow.active == False)
    assert total_non_active == 1

def test_fetch_none(goal_service: GoalService):
    goals = goal_service.list_goal()
    assert goals.total == 0

def test_fetch_goal(goal_service: GoalService):
    goal_count = 50
    for i in range(goal_count):
        goal_service.add_goal(GoalCreateSchema(name=generate_random_string(10), target=i*100))
    goals = goal_service.list_goal()
    goals_below = goal_service.list_goal(GoalRow.target > 1000, limit=1000)
    assert goals.total == goal_count
    assert goals_below.total > 0
