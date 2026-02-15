from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MEMBER = "member"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default=UserRole.MEMBER)
    
    certificates = relationship("Certificate", back_populates="owner")

class CertificateType(str, enum.Enum):
    MEDICAL = "medical"
    ENVIRONMENTAL = "environmental"
    PROFESSIONAL = "professional"

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    cert_id = Column(String, unique=True, index=True) # Public Display ID
    owner_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String)
    issue_date = Column(DateTime, default=datetime.utcnow)
    expiry_date = Column(DateTime)
    status = Column(String, default="active")
    
    owner = relationship("User", back_populates="certificates")

class HistoricalData(Base):
    __tablename__ = "historical_data"

    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer)
    month = Column(String)
    department = Column(String)
    employees = Column(Integer)
    accidents = Column(Integer)
    near_misses = Column(Integer)
    training_hours = Column(Integer)
    compliance_score = Column(Integer)
