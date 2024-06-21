from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from models import Centra as DBCentra, Delivery as DBDelivery, Batch as DBBatch, Notification as DBNotification, SessionLocal
from schemas import CentraCreate, Centra, DeliveryCreate, Delivery, BatchCreate, Batch, DeliveryUpdate, NotificationCreate, Notification
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import crud  # Ensure this import is correct and points to your crud module

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to the specific origins you want to allow
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class BatchUpdate(BaseModel):
    step: str
    weight: int

@app.put("/batches/update_status", response_model=List[int])
def update_batches_status(batch_ids: List[int], db: Session = Depends(get_db)):
    batches = db.query(DBBatch).filter(DBBatch.Batch_ID.in_(batch_ids)).all()
    if not batches:
        raise HTTPException(status_code=404, detail="Batches not found")
    for batch in batches:
        batch.Status = "Warehouse"
    db.commit()
    return [batch.Batch_ID for batch in batches]

@app.get("/api/batches/{centra_id}", response_model=List[Batch])
def get_batches_by_centra(centra_id: int, db: Session = Depends(get_db)):
    batches = crud.get_batches_by_centra_id(db, centra_id=centra_id)
    if not batches:
        raise HTTPException(status_code=404, detail="Batches not found")
    return batches

@app.get("/api/weights")
def get_weights(centra_id: int, db: Session = Depends(get_db)):
    weights = crud.get_weights_by_centra_id(db, centra_id=centra_id)
    return weights

@app.get("/api/batches")
def get_batches(centra_id: int, db: Session = Depends(get_db)):
    batches = crud.get_batches_by_centra_id(db, centra_id=centra_id)
    return batches

@app.post("/centra/", response_model=Centra)
def create_centra(centra: CentraCreate, db: Session = Depends(get_db)):
    db_centra = DBCentra(**centra.dict())
    db.add(db_centra)
    db.commit()
    db.refresh(db_centra)
    return db_centra

@app.get("/centra/", response_model=List[Centra])
def read_centras(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(DBCentra).offset(skip).limit(limit).all()

@app.get("/centra/{centra_id}", response_model=Centra)
def read_centra(centra_id: int, db: Session = Depends(get_db)):
    db_centra = db.query(DBCentra).filter(DBCentra.Centra_ID == centra_id).first()
    if db_centra is None:
        raise HTTPException(status_code=404, detail="Centra not found")
    return db_centra

@app.put("/centra/{centra_id}", response_model=Centra)
def update_centra(centra_id: int, centra: CentraCreate, db: Session = Depends(get_db)):
    db_centra = db.query(DBCentra).filter(DBCentra.Centra_ID == centra_id).first()
    if db_centra is None:
        raise HTTPException(status_code=404, detail="Centra not found")
    for key, value in centra.dict().items():
        setattr(db_centra, key, value)
    db.commit()
    db.refresh(db_centra)
    return db_centra

@app.delete("/centra/{centra_id}", response_model=Centra)
def delete_centra(centra_id: int, db: Session = Depends(get_db)):
    db_centra = db.query(DBCentra).filter(DBCentra.Centra_ID == centra_id).first()
    if db_centra is None:
        raise HTTPException(status_code=404, detail="Centra not found")
    db.delete(db_centra)
    db.commit()
    return db_centra

@app.post("/delivery/", response_model=Delivery)
def create_delivery(delivery: DeliveryCreate, db: Session = Depends(get_db)):
    db_delivery = DBDelivery(**delivery.dict())
    db.add(db_delivery)
    db.commit()
    db.refresh(db_delivery)
    return db_delivery

@app.get("/delivery/", response_model=List[Delivery])
def read_deliveries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(DBDelivery).offset(skip).limit(limit).all()

@app.get("/delivery/{package_id}", response_model=Delivery)
def read_delivery(package_id: int, db: Session = Depends(get_db)):
    db_delivery = db.query(DBDelivery).filter(DBDelivery.Package_ID == package_id).first()
    if db_delivery is None:
        raise HTTPException(status_code=404, detail="Delivery not found")
    return db_delivery

@app.put("/delivery/{package_id}", response_model=Delivery)
def update_delivery(package_id: int, delivery: DeliveryUpdate, db: Session = Depends(get_db)):
    db_delivery = db.query(DBDelivery).filter(DBDelivery.Package_ID == package_id).first()
    if db_delivery is None:
        raise HTTPException(status_code=404, detail="Delivery not found")
    for key, value in delivery.dict(exclude_unset=True).items():
        setattr(db_delivery, key, value)
    db.commit()
    db.refresh(db_delivery)
    return db_delivery

@app.delete("/delivery/{package_id}", response_model=Delivery)
def delete_delivery(package_id: int, db: Session = Depends(get_db)):
    db_delivery = db.query(DBDelivery).filter(DBDelivery.Package_ID == package_id).first()
    if db_delivery is None:
        raise HTTPException(status_code=404, detail="Delivery not found")
    db.delete(db_delivery)
    db.commit()
    return db_delivery

@app.post("/batch/", response_model=Batch)
def create_batch(batch: BatchCreate, db: Session = Depends(get_db)):
    db_batch = DBBatch(**batch.dict())
    db.add(db_batch)
    db.commit()
    db.refresh(db_batch)
    return db_batch

@app.get("/batch/", response_model=List[Batch])
def read_batches(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(DBBatch).offset(skip).limit(limit).all()

@app.get("/batch/{batch_id}", response_model=Batch)
def read_batch(batch_id: int, db: Session = Depends(get_db)):
    db_batch = db.query(DBBatch).filter(DBBatch.Batch_ID == batch_id).first()
    if db_batch is None:
        raise HTTPException(status_code=404, detail="Batch not found")
    return db_batch

@app.get("/batch/package/{package_id}", response_model=Batch)
def read_batch_by_package(package_id: int, db: Session = Depends(get_db)):
    db_batch = db.query(DBBatch).filter(DBBatch.Package_ID == package_id).first()
    if db_batch is None:
        raise HTTPException(status_code=404, detail="Batch not found")
    return db_batch

@app.get("/centra/batch/{batch_id}", response_model=Centra)
def read_centra_by_batch(batch_id: int, db: Session = Depends(get_db)):
    db_batch = db.query(DBBatch).filter(DBBatch.Batch_ID == batch_id).first()
    if db_batch is None:
        raise HTTPException(status_code=404, detail="Batch not found")
    db_centra = db.query(DBCentra).filter(DBCentra.Centra_ID == db_batch.Centra_ID).first()
    if db_centra is None:
        raise HTTPException(status_code=404, detail="Centra not found")
    return db_centra

@app.put("/batch/{batch_id}", response_model=Batch)
def update_batch(batch_id: int, batch_update: BatchUpdate, db: Session = Depends(get_db)):
    db_batch = db.query(DBBatch).filter(DBBatch.Batch_ID == batch_id).first()
    if db_batch is None:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    # Update the weight and status based on the step
    if batch_update.step == 'Wet Leaves':
        db_batch.WetWeight = batch_update.weight
        db_batch.Status = 'Wet Leaves'
    elif batch_update.step == 'Dry Leaves':
        db_batch.DryWeight = batch_update.weight
        db_batch.Status = 'Dry Leaves'
    elif batch_update.step == 'Flour Leaves':
        db_batch.PowderWeight = batch_update.weight
        db_batch.Status = 'Flour Leaves'
    elif batch_update.step == 'Rescale':
        db_batch.Status = 'Rescale'
        db_batch.WeightRescale = batch_update.weight

    # Create notification
    notification = DBNotification(
        title=f"Batch {batch_id} status changed",
        message=f"Batch {batch_id} status changed to {db_batch.Status}",
        timestamp=datetime.now()
    )
    db.add(notification)

    db.commit()
    db.refresh(db_batch)
    return db_batch

@app.delete("/batch/{batch_id}", response_model=Batch)
def delete_batch(batch_id: int, db: Session = Depends(get_db)):
    db_batch = db.query(DBBatch).filter(DBBatch.Batch_ID == batch_id).first()
    if db_batch is None:
        raise HTTPException(status_code=404, detail="Batch not found")
    db.delete(db_batch)
    db.commit()
    return db_batch

@app.post("/api/create_batch", response_model=Batch)
def create_new_batch(weight: int, centra_id: int, db: Session = Depends(get_db)):
    new_batch = DBBatch(
        RawWeight=weight,
        InTimeRaw=datetime.now(),
        Centra_ID=centra_id,
        Status='Gather Leaves'
    )
    db.add(new_batch)
    db.commit()
    db.refresh(new_batch)
    return new_batch

# Add this endpoint to main.py in your FastAPI backend

@app.get("/api/archived_batches", response_model=List[Batch])
def get_archived_batches(db: Session = Depends(get_db)):
    archived_batches = db.query(DBBatch).filter(DBBatch.Status == "Archived").all()
    return archived_batches

# New endpoint to fetch notifications
@app.get("/api/notifications", response_model=List[Notification])
def get_notifications(db: Session = Depends(get_db)):
    notifications = db.query(DBNotification).order_by(DBNotification.timestamp.desc()).all()
    return notifications

@app.delete("/api/notifications/{notification_id}")
def delete_notification(notification_id: int, db: Session = Depends(get_db)):
    notification = db.query(DBNotification).filter(DBNotification.id == notification_id).first()
    if notification is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(notification)
    db.commit()
    return {"message": "Notification deleted successfully"}

@app.delete("/api/notifications")
def delete_all_notifications(db: Session = Depends(get_db)):
    db.query(DBNotification).delete()
    db.commit()
    return {"message": "All notifications deleted successfully"}

@app.get("/api/warehouse_batches", response_model=List[Batch])
def get_warehouse_batches(db: Session = Depends(get_db)):
    warehouse_batches = db.query(DBBatch).filter(DBBatch.Status == "Warehouse").all()
    return warehouse_batches


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
