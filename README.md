# Sistema Web de Predicción de Enfermedad Tiroidea 🩺

Este es un sistema web completo de pila (full-stack) diseñado para predecir la probabilidad de enfermedad tiroidea basándose en datos clínicos. La aplicación utiliza un modelo de Machine Learning entrenado con XGBoost y proporciona una interfaz de usuario moderna y funcional para la gestión de pacientes, diagnósticos y reportes.



## ✨ Características Principales

* **Autenticación Segura:** Sistema de registro y login basado en tokens (JWT) con roles de usuario.
* **Gestión de Usuarios por Administrador:** Un panel de administrador para crear y gestionar cuentas de usuario (médicos).
* **Gestión de Pacientes:** Creación y listado de pacientes.
* **Predicción Inteligente:** Un formulario clínico completo que se comunica con un modelo de XGBoost pre-entrenado para obtener diagnósticos en tiempo real.
* **Persistencia de Datos:** Todos los usuarios, pacientes y diagnósticos se guardan en una base de datos MySQL.
* **Dashboard de Reportes:** Visualización de estadísticas clave, como el total de pacientes, total de diagnósticos y una gráfica de distribución de resultados.
* **Panel de Control Detallado:** Una tabla con todos los diagnósticos realizados, con capacidad futura para filtrar y buscar.

---
## 🏗️ Arquitectura del Sistema

El proyecto sigue una **Arquitectura de Tres Capas** desacoplada, lo que garantiza seguridad, escalabilidad y mantenibilidad.



1.  **Capa de Presentación (Frontend):** Una Single Page Application (SPA) construida con **React** y Vite.
2.  **Capa de Lógica (Backend):** Una API RESTful construida con **Python (Flask)** y servida en producción por **Gunicorn**.
3.  **Capa de Datos (Database):** Un sistema de gestión de base de datos relacional **MySQL**.

El servidor web **Nginx** actúa como proxy inverso, sirviendo el frontend estático y redirigiendo las llamadas a la API al backend de Gunicorn.

---
## 🛠️ Stack Tecnológico

| Área                 | Tecnología                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| **Frontend** | ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black) Vite, Axios, React Router |
| **Backend** | ![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white) Flask, Gunicorn       |
| **Machine Learning** | ![Scikit-learn](https://img.shields.io/badge/-Scikit--learn-F7931E?logo=scikit-learn&logoColor=white) XGBoost, Pandas |
| **Base de Datos** | ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&logoColor=white) SQLAlchemy              |
| **Autenticación** | JWT (JSON Web Tokens), Bcrypt                                                                          |
| **Despliegue** | ![Ubuntu](https://img.shields.io/badge/-Ubuntu-E95420?logo=ubuntu&logoColor=white) AWS EC2, Nginx        |

---
## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para configurar el proyecto en un entorno de desarrollo o producción.

### **1. Configuración del Backend (Servidor Ubuntu)**

**Prerrequisitos:**
* Ubuntu Server
* Python 3.12+
* Servidor MySQL

```bash
# 1. Clona el repositorio
git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)
cd tu-repositorio

# 2. Crea y activa un entorno virtual con Python 3.12
python3.12 -m venv venv
source venv/bin/activate

# 3. Instala las dependencias de Python
pip install -r requirements.txt

# 4. Configura la base de datos
#    - Asegúrate de que MySQL esté instalado y corriendo.
#    - Crea la base de datos `thyroid_db` y el usuario `thyroid_user` con los permisos necesarios.
#    - Crea las tablas usando los scripts SQL proporcionados.

# 5. Configura las variables de entorno
#    - Edita el archivo `app.py` y actualiza las siguientes líneas con tus credenciales:
#      app.config['SQLALCHEMY_DATABASE_URI'] = '...'
#      app.config['JWT_SECRET_KEY'] = '...'

# 6. Inicia el servidor de producción
gunicorn --workers 3 --bind 0.0.0.0:5000 app:app
```

### **2. Configuración del Frontend (PC Local)**

**Prerrequisitos:**
* Node.js y npm

```bash
# 1. Navega a la carpeta del frontend
cd thyroid-frontend

# 2. Instala las dependencias de JavaScript
npm install

# 3. Configura la URL de la API
#    - Edita los archivos en `src/pages` y actualiza la variable `API_URL` con la IP pública de tu servidor.
#      const API_URL = 'http://<TU_IP_PUBLICA>:5000';

# 4. Inicia el servidor de desarrollo local
npm run dev
```

### **3. Despliegue del Frontend en Producción**

```bash
# 1. En tu PC local, dentro de la carpeta del frontend, compila la aplicación
npm run build

# 2. Sube la carpeta 'dist' resultante a tu servidor Ubuntu
scp -i <tu_llave.pem> -r dist ubuntu@<tu_ip_servidor>:~/

# 3. En el servidor, mueve los archivos y configura Nginx como se detalla en la documentación.
```

---
## 📚 Endpoints de la API

La API proporciona los siguientes endpoints principales:

* `POST /api/register`: (Admin) Registra un nuevo usuario.
* `POST /api/login`: Inicia sesión y devuelve un token JWT.
* `POST /api/patients`: (Protegido) Crea un nuevo paciente.
* `GET /api/patients`: (Protegido) Devuelve la lista de pacientes.
* `POST /api/predict`: (Protegido) Realiza una predicción y la guarda en la base de datos.
* `GET /api/dashboard-stats`: (Protegido) Devuelve estadísticas para el dashboard.
* `GET /api/diagnostics`: (Protegido) Devuelve una lista de todos los diagnósticos.
* `POST /api/test-predict`: (Público) Endpoint de prueba que solo devuelve la predicción.
