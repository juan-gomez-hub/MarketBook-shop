## ⚙️ Instalación

```bash
# Clona el repositorio
git clone https://github.com/juan-gomez-hub/MarketBook-shop.git
cd MarketBook-shop
```

### 🚀 Ejecutar backend
```bash
cd backend

python -m venv venv
source venv/bin/activate 

pip install -r requirements.txt

source backend/env/bin/activate
cp .env.example .env
flask run --reload
```
### Ejecutar test en backend (carga 30 paginas)

```bash
pytest -s test/
```

### 🚀 Ejecutar frontend
```bash
cd frontend
npm start
```
