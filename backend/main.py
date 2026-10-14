from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field,  field_validator
from typing import List
from datetime import datetime, date
from uuid import uuid4, UUID

class Patient(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str = Field(..., min_length=1, max_length=20)
    birthDate: date
    gender: str
    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: datetime = Field(default_factory=datetime.now)

    @field_validator('birthDate')
    @classmethod
    def validate_birth_date(cls, value: date) -> date:
        today = date.today()

        if value > today:
            raise ValueError("Birth date cannot be in the future")
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age > 120:
            print(f"Age: {age}, Birth Date: {value}, Today: {today}")
            raise ValueError("Age cannot be greater than 120 years")
        return value

    @field_validator('name', 'gender')
    @classmethod
    def validate_not_empty(cls, v: str, info: ValidationInfo) -> str:
        if not v or not v.strip():
            raise ValueError(f"{info.field_name.capitalize()} cannot be empty")
        return v

class PatientUpdate(BaseModel):
    name: str = Field(..., min_length=1, max_length=20)
    birthDate: date
    gender: str = Field(..., min_length=1, max_length=20)
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
    Patient(id=uuid4(), name="John Doe", birthDate=date(2001, 9, 30), gender="Male", createdAt=datetime.now().isoformat(), updatedAt=datetime.now().isoformat()),
    Patient(id=uuid4(), name="Jane Smith", birthDate=date(1995, 5, 15), gender="Female", createdAt=datetime.now().isoformat(), updatedAt=datetime.now().isoformat()),
    Patient(id=uuid4(), name="Alice Johnson", birthDate=date(1988, 11, 22), gender="Female", createdAt=datetime.now().isoformat(), updatedAt=datetime.now().isoformat())]


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
