from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from uuid import uuid4, UUID

class Patient(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str
    birthDate: str
    gender: str
    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: datetime = Field(default_factory=datetime.now)

class PatientUpdate(BaseModel):
    name: str
    birthDate: str
    gender: str
    updatedAt: datetime = Field(default_factory=datetime.now)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["localhost:5173", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

patients = [
    Patient(id=uuid4(), name="John Doe", birthDate="30.09.2001", gender="Male", createdAt=datetime.now().isoformat(), updatedAt=datetime.now().isoformat()),
    Patient(id=uuid4(), name="Jane Smith", birthDate="15.05.1995", gender="Female", createdAt=datetime.now().isoformat(), updatedAt=datetime.now().isoformat()),
    Patient(id=uuid4(), name="Alice Johnson", birthDate="22.11.1988", gender="Female", createdAt=datetime.now().isoformat(), updatedAt=datetime.now().isoformat())]


@app.get("/patients", response_model=List[Patient])
async def get_patients() -> List[Patient]:
    return patients

@app.get("/patients/{patient_id}", response_model=Patient)
async def get_patient(patient_id: UUID) -> Patient:
    patients = await get_patients()
    for patient in patients:
        if patient.id == patient_id:
            return patient
    raise HTTPException(status_code=404, detail="Patient not found")

@app.post("/patients", status_code=status.HTTP_201_CREATED)
async def create_patient(patient: Patient) -> Patient:
    new_patient = patient.model_dump()

    patients.append(new_patient)
    return new_patient

@app.patch("/patients/{patient_id}", response_model=Patient)
async def update_patient(patient_id: UUID, patient: PatientUpdate) -> Patient:
    patients = await get_patients()
    for i, existing_patient in enumerate(patients):
        if existing_patient.id == patient_id:
            updated_patient = existing_patient.model_copy(update=patient.model_dump())
            patients[i] = updated_patient
            return updated_patient
    raise HTTPException(status_code=404, detail="Patient not found")

@app.delete("/patients/{patient_id}")
async def delete_patient(patient_id: UUID) -> None:
    patients = await get_patients()
    for i, existing_patient in enumerate(patients):
        if existing_patient.id == patient_id:
            del patients[i]
            return
    raise HTTPException(status_code=404, detail="Patient not found")
