from faker import Faker
import os
from test import data
from test.helpers.image_helpers import upload_image
from test.test_author import makeme_author


def test_create_book(client):
    book = data.book
    for libro in book:
        tokenAuthor = makeme_author(client,libro.author or None)
        assert tokenAuthor is not None, "El login fallo"
        img=None
        if(libro.cover_image):
            img = upload_image(client, tokenAuthor,libro.cover_image)
        responseBin = client.post(
            "/market/create/book",
            headers={"Authorization": f"{tokenAuthor}"},
            json={
                "title": libro.title,
                "description": libro.description,
                "release_date": libro.release_date,
                "cover_image"if img else "": img,
                "price": libro.price
            },
        ).data
        assert b"Success" in responseBin
