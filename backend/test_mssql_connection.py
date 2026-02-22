from sqlalchemy import create_engine
import sys

connection_string = "mssql+pyodbc://@wONd3r\\sathi/IOSH?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"

try:
    engine = create_engine(connection_string)
    connection = engine.connect()
    print("Successfully connected to the MSSQL database!")
    connection.close()
except Exception as e:
    print(f"Failed to connect to the database: {e}")
    sys.exit(1)
