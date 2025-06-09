## ⚙️ Instalación

```bash
# Clona el repositorio
git clone https://github.com/usuario/proyecto.git
cd proyecto
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

### 🚀 Ejecutar frontend
```bash
cd frontend
npm start
```
