from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import pandas as pd
import io
from . import models, database, auth
from .ai_engine import ai_engine

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    responses={404: {"description": "Not found"}},
)

# Dependency to check for admin role
def get_current_admin(current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin)):
    if not file.filename.endswith(('.csv', '.xlsx')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload CSV or Excel.")
    
    try:
        contents = await file.read()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
            
        # Basic validation of columns
        required_columns = ['year', 'month', 'department', 'employees', 'accidents', 'near_misses', 'training_hours', 'compliance_score']
        if not all(col in df.columns for col in required_columns):
             raise HTTPException(status_code=400, detail=f"Missing required columns: {required_columns}")

        # Bulk insert
        objects = []
        for index, row in df.iterrows():
            objects.append(models.HistoricalData(
                year=row['year'],
                month=row['month'],
                department=row['department'],
                employees=row['employees'],
                accidents=row['accidents'],
                near_misses=row['near_misses'],
                training_hours=row['training_hours'],
                compliance_score=row['compliance_score']
            ))
            
        db.bulk_save_objects(objects)
        db.commit()
        
        # Retrain AI model with new data
        ai_engine.retrain(df)
        
        return {"filename": file.filename, "rows_processed": len(df), "message": "File uploaded and data processed successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/data")
def get_historical_data(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin)):
    data = db.query(models.HistoricalData).offset(skip).limit(limit).all()
    count = db.query(models.HistoricalData).count()
    return {"data": data, "total": count}

@router.get("/analysis")
def get_analysis_data(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin)):
    # Aggregate data for charts
    data = db.query(models.HistoricalData).all()
    if not data:
        return {"message": "No data available for analysis"}
        
    df = pd.DataFrame([vars(d) for d in data])
    if '_sa_instance_state' in df.columns:
        del df['_sa_instance_state']
        
    # Analysis 1: Accidents by Year
    accidents_by_year = df.groupby('year')['accidents'].sum().to_dict()
    
    # Analysis 2: Compliance vs Accidents (Correlation)
    correlation = df[['compliance_score', 'accidents']].corr().iloc[0, 1]
    
    # Analysis 3: Department Performance
    dept_performance = df.groupby('department')[['accidents', 'training_hours']].mean().to_dict('index')

    return {
        "accidents_by_year": accidents_by_year,
        "correlation_compliance_accidents": correlation,
        "department_performance": dept_performance
    }

@router.get("/users")
def get_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    # Be careful not to expose hashed_password in a real app, but Pydantic response model usually filters it if set up right.
    # Here we might want to return a specific schema or rely on the ORM to dict conversion if we are careful.
    # Ideally we should use a response_model=List[UserResponse] but UserResponse is in main.py.
    # For now, let's return the objects and let FastAPI handle serialization if models.User matches a schema, 
    # OR construct a safe dict list.
    
    # Safest quick way without circular imports or redefining schemas:
    safe_users = []
    for u in users:
        safe_users.append({
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "certificate_count": len(u.certificates)
        })
    
    return safe_users

@router.get("/users/{user_id}")
def get_user_details(user_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Fetch certificates
    certificates = db.query(models.Certificate).filter(models.Certificate.owner_id == user_id).all()
    
    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        },
        "certificates": [
            {
                "id": c.id,
                "cert_id": c.cert_id,
                "type": c.type,
                "status": c.status,
                "issue_date": c.issue_date,
                "expiry_date": c.expiry_date
            } for c in certificates
        ]
    }

# Pydantic models for update/create actions (ideally in main.py, but for quick access here)
from pydantic import BaseModel

class UserUpdate(BaseModel):
    full_name: str
    role: str
    email: str

class UserCreateAdmin(BaseModel):
    full_name: str
    email: str
    password: str
    role: str

@router.post("/users")
def create_user_admin(user: UserCreateAdmin, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin)):
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

@router.put("/users/{user_id}")
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if new email conflicts with another user
    existing_email = db.query(models.User).filter(models.User.email == user_update.email, models.User.id != user_id).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already in use by another user")

    user.full_name = user_update.full_name
    user.role = user_update.role
    user.email = user_update.email
    
    db.commit()
    return {"message": "User updated successfully"}

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Optional: Delete associated certificates or prevent deletion if certificates exist
    # For now, we'll allow deletion and cascade might handle it or they become orphaned
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}
