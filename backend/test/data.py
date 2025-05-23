import os


class Book:
    def __init__(
        self, title, description, release_date, price, cover_image=None, author=None
    ):
        self.title = title
        self.description = description
        self.release_date = release_date
        self.price = price
        self.cover_image = (
            f"{os.getcwd()+'/images_to_test/'+cover_image}" if cover_image else None
        )
        self.author = author


book = [
    Book(
        "Sunrise on the Reaping (A Hunger Games Novel) (The Hunger Games)",
        """From the million-copy bestselling author of The Lost Bookshop
'A delicious book that I couldn’t resist devouring in one sitting. It was a delight to lose myself in the world of Edie and the mysterious baker. I would recommend to pastry lovers and book lovers alike!' Sally Page, Sunday Times bestselling author of The Keeper of Stories

Nestled among the cobblestone streets of Compiègne, there existed a bakery unlike any other.
Rumours were whispered through the town that its pastries offered a taste of magic, chasing away the darkest of sorrows. Just one bite of a croissant might bring luck, unlock a precious memory or reveal hidden longings.
But dark clouds were looming on the horizon…

For Edie Lane, a recipe for disaster doesn’t require that many ingredients. Take an unhealthy amount of wishful thinking and a sprinkle of desperation and that’s how Edie left everything behind in Ireland for her dream job at a bakery in Paris. Except the bakery isn’t in Paris – and neither is Edie.
This might not be where Edie intended to be but she soon realizes it's exactly where she needs to be..""",
        "2025-03-18",
        "2",
        "caratula1.jpg",
        # None
    ),
    Book(
        "The Midnight Library",
        "A woman is given the chance to explore the infinite lives she could have lived by stepping into a library between life and death.",
        "2021-08-26",
        2.5,
        "caratula2.jpg",
    ),
    Book(
        "Death Comes to Marlow: A Novel (The Marlow Murder Club Book 2)",
        "BBCOne show creator of Death in Paradise, Robert Thorogood delights in giving the Christie-mystery a busy-body twist. Judith (our favorite skinny-dipping, whiskey-sipping, crossword puzzle author), along with Becks the vicar's wife, and Susie the dogwalker find themselves in a head-scratching, utterly clever country house, locked-room murder mystery. Holiday festivities are now January doldrums when Judith gets a call—Sir Peter Bailey, a prominent Marlovian is inviting notable citizens to his house the day before his wedding to celebrate.Judith decides to go—after all, it's a few houses up the Thames and free champagne, for sure. During the party, a loud crash inside stops the festivities. The groom-to-be has been crushed to death in his study. The door was locked from the inside so the police say suicide, obviously. ",
        "2025-02-22",
        36.02,
        "Death Comes to Marlow.jpg",
        "Robert Thorogood",
    ),
    Book(
        "ALGUN TIEMPO ATRAS : LA VIDA DE GUSTAVO CERATI",
        "La perfección es inalcanzable. Sin embargo, Gustavo Cerati la buscó con fuerza y pasión en su arte. En conexión con ese espíritu irreductible, Algún tiempo atrás. La vida de Gustavo Cerati aborda el recorrido vital y creativo del hombre y del artista con la misma conciencia -la de que hay enigmas de imposible resolución- pero sin limitarse jamás en su afanosa investigación. Decidido a recuperar la parte más luminosa de esta figura única, la de uno de los músicos argentinos de mayor proyección internacional, Sergio Marchi no deja rincón sin visitar",
        "2023-04-27",
        42999,
        "ALGUN TIEMPO ATRAS.jpg",
        "Sergio Marchi",
    ),
]
