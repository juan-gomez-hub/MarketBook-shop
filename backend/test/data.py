# ruta = "/home/gomez/Imágenes/caratulas/"
# covers = [
#     "caratula1.jpg",
#     "caratula2.jpg",
#     "caratula3.jpg",
#     "caratula4.jpg",
#     "caratula5.jpg",
#     "caratula6.jpg",
#     "caratula7.jpg",
# ]
class Book:
    def __init__(self, title, description, release_date, price, cover_image):
        self.title = title
        self.description = description
        self.release_date = release_date
        self.price = price
        self.cover_image = cover_image


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
        "/home/gomez/Imágenes/caratulas/caratula1.jpg",
    ),
    Book(
         "The Midnight Library",
         "A woman is given the chance to explore the infinite lives she could have lived by stepping into a library between life and death.",
         "2021-08-26",
         2.5,
        "/home/gomez/Imágenes/caratulas/caratula2.jpg"
    ),
]
