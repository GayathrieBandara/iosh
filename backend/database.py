from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLALCHEMY_DATABASE_URL = "sqlite:///./iosh_app.db"
# SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost/iosh_app"
SQLALCHEMY_DATABASE_URL = "mssql+pyodbc://@wONd3r\\sathi/IOSH?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
