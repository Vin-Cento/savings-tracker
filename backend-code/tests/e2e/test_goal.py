import uuid

from schema.deposit_schema import DepositSchema
from tests.util import generate_random_string
from schema.goal_schema import GoalSchema, GoalCreateSchema
from services.goal_service_class import GoalService


def test_count_goal(client, goal_service: GoalService):
    goal_count = 10
    for _ in range(goal_count):
        goal_service.add_goal(GoalCreateSchema(
            name=generate_random_string(10), target=3000))
    for _ in range(int(goal_count)):
        goal_service.add_goal(GoalCreateSchema(
            name=generate_random_string(10), target=3000, active=False))
    true_resp = client.get('/goals/count?active=True')
    assert true_resp.status_code == 200
    true_count = int(true_resp.json())
    assert goal_count == true_count

    false_resp = client.get('/goals/count?active=False')
    assert false_resp.status_code == 200
    false_count = int(true_resp.json())
    assert goal_count == false_count


def test_create_get_delete_flow(client):
    name = generate_random_string(10)
    target = 3000
    goal_payload = {
        "name": name,
        "target": target,
        "deadline": None,
    }
    create_response = client.post("/goals", json=goal_payload)

    assert create_response.status_code == 201

    create_data = GoalSchema.model_validate(create_response.json())
    assert create_data.name == name
    assert create_data.target == target
    assert create_data.active is True
    assert isinstance(create_data.id, uuid.UUID)

    delete_response = client.delete(f"/goals/{str(create_data.id)}")
    assert delete_response.status_code in [200, 204]
    get_response = client.get(f"/goals/{str(create_data.id)}")
    assert get_response.status_code == 404


def test_list_goals(client):
    name = generate_random_string(10)
    goal_payload = {
        "name": name,
        "target": 3000,
        "deadline": None,
    }
    create_response = client.post("/goals", json=goal_payload)
    assert create_response.status_code == 201

    create_data = GoalSchema.model_validate(create_response.json())
    assert create_data.name == name
    assert create_data.target == 3000
    assert create_data.active is True
    assert isinstance(create_data.id, uuid.UUID)

    response = client.get("/goals", params={"page": 1, "limit": 5})

    assert response.status_code == 200

    data = response.json()

    assert data["page"] == 1
    assert data["limit"] == 5

    delete_response = client.delete(f"/goals/{create_data.id}")
    assert delete_response.status_code in [200, 204]
    get_response = client.get(f"/goals/{create_data.id}")
    assert get_response.status_code == 404


def test_add_deposit(client):
    goal_payload = {
        "id": "f84f6b2d-e443-4206-bde2-e64357201a57",
        "name": generate_random_string(10),
        "target": 2000,
        "deadline": None
    }
    create_response = client.post("/goals", json=goal_payload)
    assert create_response.status_code == 201
    goal = GoalSchema.model_validate(create_response.json())

    deposit_payload = {
        "amount": 250,
        "note": "first deposit",
        "goal_id": str(goal.id),
    }
    deposit_res = client.post("/deposit/add", json=deposit_payload)
    assert deposit_res.status_code == 200
    deposit = DepositSchema.model_validate(deposit_res.json())

    assert deposit.amount == 250
    assert deposit.note == "first deposit"
    assert deposit.goal_id == goal.id


def test_max_out_deposit(client):
    goal_max_amount = 1000
    goal_payload = {
        "id": "f84f6b2d-e443-4206-bde2-e64357201a57",
        "name": generate_random_string(10),
        "target": goal_max_amount,
        "deadline": None,
    }

    goal_res = client.post("/goals", json=goal_payload)
    assert goal_res.status_code == 201

    goal = GoalSchema.model_validate(goal_res.json())

    deposit_payload = {
        "amount": 10000,
        "note": "first deposit",
        "goal_id": str(goal.id),
    }

    deposit_res = client.post("/deposit/add", json=deposit_payload)

    assert deposit_res.status_code == 200

    deposit = DepositSchema.model_validate(deposit_res.json())

    assert deposit.amount == goal_max_amount
    assert deposit.note == "first deposit"
    assert deposit.goal_id == goal.id

    goal_res_updated = client.get(f"/goals/{str(deposit.goal_id)}")
    goal_updated = GoalSchema.model_validate(goal_res_updated.json())
    assert deposit.amount == goal_updated.target
    assert goal.completed != goal_updated.completed
