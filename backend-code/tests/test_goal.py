from fastapi.testclient import TestClient


def test_create_goal(client: TestClient):
    response = client.post(
        "/goals",
        json={
            "id": -1,
            "name": "Emergency Fund",
            "target": 2000,
            "deadline": None
        }
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Emergency Fund"
    assert data["target"] == 2000
    assert data["active"] is True
    assert "id" in data
