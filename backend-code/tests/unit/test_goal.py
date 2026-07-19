from uuid import uuid4
from models.models import GoalRow
from services.goal_service_class import GoalService
from tests.util import generate_random_string
from schema.goal_schema import GoalCreateSchema, GoalUpdateSchema

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

def test_update_goal(goal_service: GoalService):
    name = generate_random_string(10)
    goal = goal_service.add_goal(GoalCreateSchema(name=name, target=10))
    assert goal.name == name
    assert goal.target == 10
    new_goal = goal_service.update_goal(
        GoalUpdateSchema(id=goal.id,name="new name", target=1000, 
                         active=goal.active, completed=goal.completed, 
                         deadline=goal.deadline)
    )
    assert new_goal != None
    assert new_goal.name == "new name"
    assert new_goal.target == 1000

def test_delete_goal(goal_service: GoalService):
    name = generate_random_string(10)
    goal = goal_service.add_goal(GoalCreateSchema(name=name, target=10))
    assert goal.name == name
    assert goal.target == 10
    deleted = goal_service.delete_goal(goal.id)
    assert deleted ==True
    deleted_goal = goal_service.get_goal(goal.id)
    assert deleted_goal is None

def test_delete_none(goal_service: GoalService):
    deleted_goal = goal_service.delete_goal(uuid4())
    assert deleted_goal == False
