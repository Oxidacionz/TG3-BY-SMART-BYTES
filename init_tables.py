import sys
import os

# Ensure backend path is in sys.path
backend_path = os.path.join(os.getcwd(), "backend")
sys.path.append(backend_path)

# Import using 'app' package directly, matching how the application runs
from app.core.database_sb import engine, Base
from app.models import finance, transaction

print("Creating all tables in SQLite database...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully.")

# Verify creation
from sqlalchemy import inspect
inspector = inspect(engine)
tables = inspector.get_table_names()
print(f"Existing tables: {tables}")
