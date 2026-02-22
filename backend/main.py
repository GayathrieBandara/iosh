from fastapi import FastAPI, Depends, HTTPException, status
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from . import models, database, auth

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="IOSH Smart Web Application API")

# Pydantic Schemas
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "member"

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    
    class Config:
        from_attributes = True

# Auth Routes
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    # Hardcoded bypass for now
    if form_data.username == "admin" and form_data.password == "123":
        access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth.create_access_token(
            data={"sub": "admin@iosh.lk", "role": "admin"}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# Certificate Pydantic Models
class CertificateCreate(BaseModel):
    cert_id: str
    type: str
    expiry_date: str  # ISO Format YYYY-MM-DD
    owner_email: str

class CertificateResponse(BaseModel):
    id: int
    cert_id: str
    type: str
    issue_date: datetime
    expiry_date: datetime
    status: str
    owner_id: int

    class Config:
        from_attributes = True

# Certificate Routes
@app.post("/certificates/", response_model=CertificateResponse)
def create_certificate(cert: CertificateCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can issue certificates")
    
    owner = db.query(models.User).filter(models.User.email == cert.owner_email).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner email not found")

    new_cert = models.Certificate(
        cert_id=cert.cert_id,
        type=cert.type,
        expiry_date=datetime.strptime(cert.expiry_date, "%Y-%m-%d"),
        owner_id=owner.id,
        status="active"
    )
    db.add(new_cert)
    db.commit()
    db.refresh(new_cert)
    return new_cert

@app.get("/certificates/", response_model=list[CertificateResponse])
def read_certificates(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role == "admin":
        certs = db.query(models.Certificate).offset(skip).limit(limit).all()
    else:
        certs = db.query(models.Certificate).filter(models.Certificate.owner_id == current_user.id).all()
    return certs

@app.get("/stats")
def read_stats(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    total_users = db.query(models.User).count()
    total_certs = db.query(models.Certificate).count()
    active_certs = db.query(models.Certificate).filter(models.Certificate.status == "active").count()
    pending_assessments = 5  # Mock data for now
    revenue = total_certs * 1500  # Mock calculation
    
    return {
        "total_users": total_users,
        "total_certs": total_certs,
        "active_certs": active_certs,
        "pending_assessments": pending_assessments,
        "revenue": revenue
    }

# AI Prediction Route
class RiskInput(BaseModel):
    employees: int
    accidents: int
    training_hours: int

@app.post("/predict")
def predict_risk(data: RiskInput, current_user: models.User = Depends(auth.get_current_user)):
    from .ai_engine import ai_engine
    risk_score = ai_engine.predict_risk(data.employees, data.accidents, data.training_hours)
    
    classification = "Low"
    if risk_score > 30: classification = "Moderate"
    if risk_score > 70: classification = "High"
    
    return {
        "risk_score": risk_score,
        "classification": classification,
        "recommendation": "Increase training hours" if risk_score > 50 else "Maintain current safety standards"
    }

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",  # Fallback
]

# Public Verification Endpoint
@app.get("/public/verify/{cert_id}")
def verify_certificate_public(cert_id: str, db: Session = Depends(database.get_db)):
    cert = db.query(models.Certificate).filter(models.Certificate.cert_id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    owner = db.query(models.User).filter(models.User.id == cert.owner_id).first()
    
    return {
        "cert_id": cert.cert_id,
        "type": cert.type,
        "expiry_date": cert.expiry_date,
        "status": cert.status,
        "owner_email": owner.email  # Exposing limited info for verification
    }

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the IOSH Smart Web Application API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

from . import admin_routes
app.include_router(admin_routes.router)
