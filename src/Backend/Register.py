from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import databases
from sqlalchemy import create_engine, MetaData, Table, Column, String, Integer, select
import uuid
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = "mysql+pymysql://root:191103@localhost/user"
database = databases.Database(DATABASE_URL)
metadata = MetaData()

users = Table(
    "userinformation",
    metadata,
    Column("UID", String(100), primary_key=True),
    Column("FirstName", String(100), nullable=False),
    Column("LastName", String(100), nullable=True),
    Column("Password", String(100), nullable=False),
    Column("RoleType", String(100), nullable=False),
    Column("CentraType", Integer, nullable=True),
    Column("Email", String(100), nullable=False),
)

engine = create_engine(DATABASE_URL)
metadata.create_all(engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

class User(BaseModel):
    FirstName: str
    LastName: str
    Password: str
    RoleType: str
    CentraType: int | None = None

@app.post("/users/", status_code=201)
async def create_user(user: User):
    email = f"{user.FirstName}.{user.LastName}@{user.RoleType.lower()}.com"
    if user.RoleType.lower() == "centra" and user.CentraType:
        email = f"{user.FirstName}.{user.LastName}@centra{user.CentraType}.com"
    
    uid = str(uuid.uuid4())
    query = users.insert().values(
        UID=uid,
        FirstName=user.FirstName,
        LastName=user.LastName,
        Password=user.Password,
        RoleType=user.RoleType,
        CentraType=user.CentraType,
        Email=email
    )
    await database.execute(query)
    return {"message": "User created successfully", "UID": uid}

@app.get("/users/")
async def read_users():
    query = users.select()
    return await database.fetch_all(query)

@app.get("/users/centratype/{uid}")
async def get_centra_type(uid: str):
    query = select(users.c.CentraType).where(users.c.UID == uid)
    result = await database.fetch_one(query)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

@app.get("/users/uid/{email}")
async def get_uid(email: str):
    logger.info(f"Fetching UID for email: {email}")
    query = select(users.c.UID).where(users.c.Email == email)
    try:
        result = await database.fetch_one(query)
        if result is None:
            raise HTTPException(status_code=404, detail="User not found")
        return result
    except Exception as e:
        logger.error(f"Error fetching UID for email {email}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.delete("/users/{uid}")
async def delete_user(uid: str):
    query = users.delete().where(users.c.UID == uid)
    await database.execute(query)
    return {"message": "User deleted successfully"}

@app.put("/users/{uid}")
async def update_user(uid: str, user: User):
    query = users.update().where(users.c.UID == uid).values(
        FirstName=user.FirstName,
        LastName=user.LastName,
        Password=user.Password,
        RoleType=user.RoleType,
        CentraType=user.CentraType,
        Email=f"{user.FirstName}.{user.LastName}@{user.RoleType.lower()}.com"
    )
    await database.execute(query)
    return {"message": "User updated successfully"}
