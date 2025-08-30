# --- 1. IMPORTACIONES ---
import os
import warnings
import pandas as pd
import joblib
from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, JWTManager, get_jwt_identity, verify_jwt_in_request, get_jwt

# Ignorar advertencias de versiones para un log más limpio
warnings.filterwarnings('ignore')

# --- CONFIGURACIÓN INICIAL ---
app = Flask(__name__)
CORS(app)

# --- CONFIGURACIÓN DE LA APLICACIÓN ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://thyroid_user:R3m0t3*25@localhost/thyroid_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = '4249904897c683758d9e7b9c7b9c115eec6c1f221c1927f60b2f26212526ed8b'

# Inicialización de extensiones
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# --- 2. MODELOS DE LA BASE DE DATOS (SQLAlchemy) ---
class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    # Columna añadida para manejar roles
    rol = db.Column(db.String(50), nullable=False, default='medico')

class Paciente(db.Model):
    __tablename__ = 'pacientes'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)

class Diagnostico(db.Model):
    __tablename__ = 'diagnosticos'
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('pacientes.id'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    fecha_diagnostico = db.Column(db.TIMESTAMP, server_default=func.now())
    resultado_prediccion = db.Column(db.String(100))
    probabilidad_confianza = db.Column(db.Float)
    age = db.Column(db.Float)
    sex = db.Column(db.String(10))
    on_thyroxine = db.Column(db.String(10))
    query_on_thyroxine = db.Column(db.String(10))
    on_antithyroid_medication = db.Column(db.String(10))
    sick = db.Column(db.String(10))
    pregnant = db.Column(db.String(10))
    thyroid_surgery = db.Column(db.String(10))
    I131_treatment = db.Column(db.String(10))
    query_hypothyroid = db.Column(db.String(10))
    query_hyperthyroid = db.Column(db.String(10))
    lithium = db.Column(db.String(10))
    goitre = db.Column(db.String(10))
    tumor = db.Column(db.String(10))
    hypopituitary = db.Column(db.String(10))
    psych = db.Column(db.String(10))
    TSH_measured = db.Column(db.String(10))
    TSH = db.Column(db.Float)
    T3_measured = db.Column(db.String(10))
    T3 = db.Column(db.Float)
    TT4_measured = db.Column(db.String(10))
    TT4 = db.Column(db.Float)
    T4U_measured = db.Column(db.String(10))
    T4U = db.Column(db.Float)
    FTI_measured = db.Column(db.String(10))
    FTI = db.Column(db.Float)
    TBG_measured = db.Column(db.String(10))
    referral_source = db.Column(db.String(20))

# --- 3. CARGA DEL MODELO DE ML ---
try:
    pipeline = joblib.load("thyroid_model_pipeline.pkl")
    print("✅ Pipeline de modelo cargado exitosamente.")
except Exception as e:
    pipeline = None
    print(f"🚨 Un error inesperado ocurrió al cargar el modelo: {e}")

# --- 4. DECORADOR DE ROL DE ADMINISTRADOR ---
def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("rol") == 'admin':
                return fn(*args, **kwargs)
            else:
                return jsonify(msg="¡Acceso denegado! Se requieren permisos de administrador."), 403
        return decorator
    return wrapper

# --- 5. FUNCIÓN AUXILIAR DE PREPROCESAMIENTO ---
def preprocess_input_data(data):
    processed_data = {}
    for key, value in data.items():
        if isinstance(value, str):
            if value.lower() == 't':
                processed_data[key] = 1
            elif value.lower() == 'f':
                processed_data[key] = 0
            else:
                processed_data[key] = value
        else:
            processed_data[key] = value
    
    corrected_data = {key.replace('_', ' '): value for key, value in processed_data.items()}
    return corrected_data

# --- 6. ENDPOINTS DE LA API ---

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = Usuario.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password_hash, password):
        # AÑADIMOS EL ROL AL TOKEN PARA LA VERIFICACIÓN
        additional_claims = {"rol": user.rol}
        access_token = create_access_token(identity=str(user.id), additional_claims=additional_claims)
        # Devolvemos el rol al frontend para que pueda mostrar/ocultar elementos
        return jsonify(access_token=access_token, rol=user.rol)
    return jsonify({"msg": "Credenciales incorrectas"}), 401


@app.route('/api/register', methods=['POST'])
@jwt_required()
@admin_required() # <-- AHORA ESTÁ PROTEGIDO
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    rol = data.get('rol', 'medico') # El admin puede especificar el rol, por defecto 'medico'

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400
    
    user_exists = Usuario.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"msg": "El email ya está registrado"}), 409
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = Usuario(email=email, password_hash=hashed_password, rol=rol)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": f"Usuario {rol} registrado exitosamente"}), 201


@app.route('/api/patients', methods=['POST'])
@jwt_required()
def create_patient():
    data = request.get_json()
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({"msg": "El nombre del paciente es requerido"}), 400
    new_patient = Paciente(nombre=nombre)
    db.session.add(new_patient)
    db.session.commit()
    return jsonify({"id": new_patient.id, "nombre": new_patient.nombre}), 201
    
@app.route('/api/patients', methods=['GET'])
@jwt_required()
def get_patients():
    pacientes = Paciente.query.all()
    return jsonify([{"id": p.id, "nombre": p.nombre} for p in pacientes])

@app.route('/api/predict', methods=['POST'])
@jwt_required()
def predict_and_save():
    if pipeline is None: return jsonify({"error": "Modelo no disponible"}), 503
    try:
        data = request.get_json()
        paciente_id = data.get('paciente_id')
        form_data = data.get('form_data')
        if not paciente_id or not form_data:
            return jsonify({"msg": "paciente_id y form_data son requeridos"}), 400
        
        clean_data = preprocess_input_data(form_data)
        input_df = pd.DataFrame([clean_data])
        
        prediction_code = pipeline.predict(input_df)[0]
        probabilities = pipeline.predict_proba(input_df)[0]
        
        is_sick = int(prediction_code) == 1
        diagnosis_text = "Enfermedad Tiroidea Detectada" if is_sick else "Sin Enfermedad Tiroidea"
        confidence = float(probabilities[1]) if is_sick else float(probabilities[0])

        usuario_id = int(get_jwt_identity())
        nuevo_diagnostico = Diagnostico(
            paciente_id=paciente_id,
            usuario_id=usuario_id,
            resultado_prediccion=diagnosis_text,
            probabilidad_confianza=confidence,
            age=form_data.get('age'), sex=form_data.get('sex'), on_thyroxine=form_data.get('on_thyroxine'),
            query_on_thyroxine=form_data.get('query_on_thyroxine'), on_antithyroid_medication=form_data.get('on_antithyroid_medication'),
            sick=form_data.get('sick'), pregnant=form_data.get('pregnant'), thyroid_surgery=form_data.get('thyroid_surgery'),
            I131_treatment=form_data.get('I131_treatment'), query_hypothyroid=form_data.get('query_hypothyroid'),
            query_hyperthyroid=form_data.get('query_hyperthyroid'), lithium=form_data.get('lithium'), goitre=form_data.get('goitre'),
            tumor=form_data.get('tumor'), hypopituitary=form_data.get('hypopituitary'), psych=form_data.get('psych'),
            TSH_measured=form_data.get('TSH_measured'), TSH=form_data.get('TSH'), T3_measured=form_data.get('T3_measured'),
            T3=form_data.get('T3'), TT4_measured=form_data.get('TT4_measured'), TT4=form_data.get('TT4'),
            T4U_measured=form_data.get('T4U_measured'), T4U=form_data.get('T4U'), FTI_measured=form_data.get('FTI_measured'),
            FTI=form_data.get('FTI'), TBG_measured=form_data.get('TBG_measured'), referral_source=form_data.get('referral_source')
        )

        db.session.add(nuevo_diagnostico)
        db.session.commit()

        return jsonify({"diagnosis_text": diagnosis_text, "confidence_probability": f"{confidence:.4f}"})
    
    except Exception as e:
        app.logger.error(f"Error en /api/predict: {e}", exc_info=True)
        print(f"DEBUG: Ocurrió una excepción - {e}")
        db.session.rollback()
        return jsonify({"error": "Ocurrió un error durante la predicción y guardado", "details": str(e)}), 500

@app.route('/api/test-predict', methods=['POST'])
def test_predict():
    if pipeline is None: return jsonify({"error": "Modelo no disponible"}), 503
    try:
        data = request.get_json()
        if not data: return jsonify({"error": "No se recibió JSON"}), 400
        
        clean_data = preprocess_input_data(data)
        input_df = pd.DataFrame([clean_data])

        prediction_code = pipeline.predict(input_df)[0]
        probabilities = pipeline.predict_proba(input_df)[0]
        
        is_sick = int(prediction_code) == 1
        diagnosis_text = "Enfermedad Tiroidea Detectada" if is_sick else "Sin Enfermedad Tiroidea"
        confidence = float(probabilities[1]) if is_sick else float(probabilities[0])

        return jsonify({
            "diagnosis_text": diagnosis_text,
            "prediction_code": int(prediction_code),
            "confidence_probability": f"{confidence:.4f}"
        })
    except Exception as e:
        return jsonify({"error": "Ocurrió un error en la predicción de prueba", "details": str(e)}), 400

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "model_loaded": pipeline is not None})
    
@app.route('/api/dashboard-stats', methods=['GET'])
@jwt_required()
def dashboard_stats():
    try:
        total_pacientes = db.session.query(func.count(Paciente.id)).scalar()
        total_diagnosticos = db.session.query(func.count(Diagnostico.id)).scalar()
        diagnosticos_por_tipo = db.session.query(
            Diagnostico.resultado_prediccion, 
            func.count(Diagnostico.id)
        ).group_by(Diagnostico.resultado_prediccion).all()

        stats_chart = [{'name': resultado, 'count': count} for resultado, count in diagnosticos_por_tipo]

        return jsonify({
            "total_pacientes": total_pacientes,
            "total_diagnosticos": total_diagnosticos,
            "diagnosticos_por_tipo": stats_chart
        })

    except Exception as e:
        return jsonify({"error": "Error al cargar estadísticas", "details": str(e)}), 500

@app.route('/api/diagnostics', methods=['GET'])
@jwt_required()
def get_diagnostics():
    try:
        # Consulta que une Diagnostico con Paciente para obtener el nombre
        diagnosticos_con_paciente = db.session.query(
            Diagnostico, Paciente.nombre
        ).join(
            Paciente, Diagnostico.paciente_id == Paciente.id
        ).order_by(Diagnostico.fecha_diagnostico.desc()).all()

        results = []
        for diag, nombre_paciente in diagnosticos_con_paciente:
            results.append({
                "id": diag.id,
                "paciente_nombre": nombre_paciente,
                "fecha": diag.fecha_diagnostico.strftime("%Y-%m-%d %H:%M:%S"),
                "resultado": diag.resultado_prediccion,
                "confianza": diag.probabilidad_confianza
            })
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": "Error al cargar los diagnósticos", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)