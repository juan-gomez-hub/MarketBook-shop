import pytest



def test_auth_corect(client, user="test1", password="123456Te",email="teste2@hotmail.com"):
    #Esto es lo mismo que el test_login_correct
    client.post('/api/accountManager/register', json={
        "user": user,
        "email": email,
        "password": password
    }).data
    responseBin = client.post('/api/accountManager/login',
                           json={"user": user,"password":password})
    assert b"success" in responseBin.data
    token = responseBin.json.get("success", {}).get("token")
    assert token is not None
