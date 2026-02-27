from sqlalchemy import create_engine
import sys

# SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost/iosh_app"
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost/iosh_app"

try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    connection = engine.connect()
    print("Successfully connected to the database!")
    connection.close()
except Exception as e:
    print(f"Failed to connect: {e}")
    sys.exit(1)
