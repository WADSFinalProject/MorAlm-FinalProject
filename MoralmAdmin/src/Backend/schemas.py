from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class CentraBase(BaseModel):
    CentraName: str
    CentraAddress: str

class CentraCreate(CentraBase):
    pass

class Centra(CentraBase):
    Centra_ID: int
    class Config:
        orm_mode = True

class DeliveryBase(BaseModel):
    Status: str
    InDeliveryTime: datetime
    OutDeliveryTime: Optional[datetime] = None
    ExpeditionType: str
    Batch_ID: Optional[int] = None

class DeliveryCreate(DeliveryBase):
    pass

class DeliveryUpdate(BaseModel):
    Status: Optional[str] = None
    InDeliveryTime: Optional[datetime] = None
    OutDeliveryTime: Optional[datetime] = None
    ExpeditionType: Optional[str] = None
    Batch_ID: Optional[int] = None

class Delivery(DeliveryBase):
    Package_ID: int
    class Config:
        orm_mode = True

class BatchBase(BaseModel):
    Centra_ID: int
    RawWeight: int
    InTimeRaw: datetime
    Status: str
    InTimeWet: Optional[datetime] = None
    OutTimeWet: Optional[datetime] = None
    WetWeight: Optional[int] = None
    InTimeDry: Optional[datetime] = None
    OutTimeDry: Optional[datetime] = None
    DryWeight: Optional[int] = None
    InTimePowder: Optional[datetime] = None
    OutTimePowder: Optional[datetime] = None
    PowderWeight: Optional[int] = None
    Package_ID: Optional[int] = None
    WeightRescale: Optional[int] = None

class BatchCreate(BaseModel):
    Centra_ID: int
    RawWeight: int
    InTimeRaw: datetime
    Status: str

class Batch(BatchBase):
    Batch_ID: int
    class Config:
        orm_mode = True

class NotificationBase(BaseModel):
    title: str
    message: str
    timestamp: datetime

class NotificationCreate(NotificationBase):
    pass

class Notification(NotificationBase):
    id: int
    class Config:
        orm_mode = True
