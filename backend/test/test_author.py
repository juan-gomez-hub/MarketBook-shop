from test.helpers.user_helpers import test_login_correct_random


def test_makeme_author(client, authorParam=None):
    token = test_login_correct_random(client)
    responseBin = client.post(
        "/market/makeme/author",
        headers={"Authorization": token},
        json={"name": authorParam or "example", "biography": "asd"},
    )
    assert b"success" in responseBin.data
    return responseBin.headers.get("Authorization")
