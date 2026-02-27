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
