from datetime import datetime


def validate_book(title, description, price: int, release_date, cover_image=None):
    if not isinstance(title, str):
        raise ValueError("El parametro title debe ser string")
    elif not validateLength(title, 70, 4):
        raise ValueError("El titulo debe tener entre 4 y 70 carácteres")
    if not isinstance(description, str):
        raise ValueError("El parametro description debe ser string")
    elif not validateLength(description, 1200, 4):
        raise ValueError("La descripcion debe tener entre 4 y 250 caracteres")
    #el precio es forzado
    try:
        price = int(price)
    except ValueError:
        raise ValueError("El precio debe ser un número válido")
    if not validate(price, 9999999, 1):
        raise ValueError("El precio debe ser entre 1 y 9999999")
    if not isinstance(release_date, str):
        raise ValueError("El parametro release_date debe ser string")
    elif not is_valid_date(release_date):
        raise ValueError("El release_date debe ser correcto")
    #cover_image no obligatorio
    if cover_image is not None:
        if not isinstance(cover_image, str):
            raise ValueError("El parametro cover_image debe ser string")


def validate_book_unnecessary(
    price: int, title=None, description=None, release_date=None, cover_image=None
):
    # pass
    if title is not None:
        if not isinstance(title, str):
            raise ValueError("El parametro title debe ser string")
        if not validateLength(title, 70, 4):
            raise ValueError("El titulo debe tener entre 4 y 70 carácteres")
    if description is not None:
        if not isinstance(description, str):
            raise ValueError("El parametro description debe ser string")
        if not validateLength(description, 1200, 4):
            raise ValueError("La descripcion debe tener entre 4 y 250 caracteres")
    if price is not None:
        try:
            price = int(price)
        except ValueError:
            raise ValueError("El precio debe ser un número válido")
        if not validate(price, 9999999, 1):
            raise ValueError("El precio debe ser entre 1 y 9999999")
    if release_date is not None:
        if not isinstance(release_date, str):
            raise ValueError("El parametro release_date debe ser string")
        if not is_valid_date(release_date):
            raise ValueError("El release_date debe ser correcto")
    if cover_image is not None:
        if not isinstance(cover_image, str):
            raise ValueError("El parametro cover_image debe ser string")


def is_valid_date(date_str):
    """Verifica si la fecha tiene el formato correcto (YYYY-MM-DD)."""
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False


def validateLength(value, max, min):
    if len(value) > max or len(value) < min:
        return False
    return True


def validate(value, max, min):
    if value > max or value < min:
        return False
    return True
