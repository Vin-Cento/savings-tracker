from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_count():
    count_response = client.get("/goals/count?active=true")
    assert count_response.status_code in [200, 204]
    count_data = count_response.json()


def test_create_get_delete_flow():
    create_response = client.post(
        "/goals",
        json={
            "id": "f84f6b2d-e443-4206-bde2-e64357201a57",
            "name": "Emergency Fund",
            "target": 2000,
            "deadline": None
        }
    )

    assert create_response.status_code == 201
    data = create_response.json()
    assert data["name"] == "Emergency Fund"
    assert data["target"] == 2000
    assert data["active"] is True
    assert "id" in data

    # count_response = client.get("/goals/count?active=true")
    # assert count_response.status_code in [200, 204]
    # count_data = count_response.json()
    # count_data[]

    delete_response = client.delete(f"/goals/{data['id']}")
    assert delete_response.status_code in [200, 204]
    get_response = client.get(f"/goals/{data['id']}")
    assert get_response.status_code == 404


def test_list_goals():
    create_response = client.post(
        "/goals",
        json={
            "id": "f84f6b2d-e443-4206-bde2-e64357201a57",
            "name": "Vacation",
            "target": 3000,
            "deadline": None,
        },
    )
    assert create_response.status_code == 201
    create_data = create_response.json()
    assert create_data["name"] == "Vacation"
    assert create_data["target"] == 3000
    assert create_data["active"] is True
    assert "id" in create_data

    response = client.get("/goals/", params={"page": 1, "limit": 5})

    assert response.status_code == 200

    data = response.json()

    assert data["page"] == 1
    assert data["limit"] == 5
    assert data["total"] == 1
    assert len(data["data"]) == 1
    assert data["data"][0]["name"] == "Vacation"

    delete_response = client.delete(f"/goals/{create_data['id']}")
    assert delete_response.status_code in [200, 204]
    get_response = client.get(f"/goals/{create_data['id']}")
    assert get_response.status_code == 404
