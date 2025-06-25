#!/bin/sh

# Extraer valores usando shell puro

# Quitar el prefijo mysql://
CLEAN_URI="${URI_DB#mysql://}"

# Separar usuario y resto
USERPASS="${CLEAN_URI%@*}"
HOSTDB="${CLEAN_URI#*@}"

# Separar usuario y contraseña
USER="${USERPASS%%:*}"
PASS="${USERPASS#*:}"

# Separar host:puerto y base
HOSTPORT="${HOSTDB%%/*}"
DB="${HOSTDB#*/}"

# Separar host y puerto
HOST="${HOSTPORT%%:*}"

echo "========== Esperando a MySQL =========="
echo "Host: $HOST"
echo "User: $USER"
echo "DB:   $DB"
echo "======================================="
echo "Esperando a que MySQL esté disponible en $MYSQL_HOST..."

#until mysql -h"$MYSQL_HOST" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "SELECT 1" "$MYSQL_DB" >/dev/null 2>&1; do
#  echo "MySQL no está listo. Reintentando..."
#  sleep 2
#done
echo "Probando conexión con MySQL:"
echo "mysql -h$HOST -u$USER -p$PASS -e 'SELECT 1' $DB"

until mysql -h"$HOST" -u"$USER" -p"$PASS" -e "SELECT 1" "$DB"; do
  echo "Fallo en la conexión. Código de salida: $?"
  sleep 2
done

echo "MySQL listo. Iniciando aplicación..."

exec "$@"
