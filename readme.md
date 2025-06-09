## ⚙️ Instalación

```bash
# Clona el repositorio
git clone https://github.com/usuario/proyecto.git
cd proyecto´´´


## 🚀 Ejecutar backend

cd backend

# Crear un entorno virtual
python -m venv venv
source venv/bin/activate 

# Instalar las dependencias
pip install -r requirements.txt

# Ejecución
source backend/env/bin/activate
cp .env.example .env
flask run --reload

## 🚀 Ejecutar frontend
cd frontend
npm start
