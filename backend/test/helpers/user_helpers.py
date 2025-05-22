from faker import Faker
def test_login_correct_random(client, userParam=False):
    fake = Faker()
    user = fake.bothify(text="????####").capitalize() if not userParam else userParam
    email = (fake.bothify(text="?????").capitalize()) + "@hotmail.com"
    password = fake.bothify(text="????####").capitalize()
    print(f"cuenta: \nuser:{user}\nemail:{email}\npassword:{password}")
    creacion = client.post(
        "/api/accountManager/register",
        json={"user": user, "email": email, "password": password},
    ).data
    print(f"email es {email}")
    assert b"success" in creacion
    responseBin = client.post(
        "/api/accountManager/login", json={"user": user, "password": password}
    )
    assert b"success" in responseBin.data
    token = responseBin.json.get("success", {}).get("token")
    assert token is not None
    return token
