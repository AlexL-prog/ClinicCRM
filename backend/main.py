from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["localhost:5173", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/patients")
async def get_patients():
    return [{"id": 1, 
            "name": "John Doe",
            "birthDate": "30.09.2001",
            "gender": "Male",
            "createdAt": "2023-09-30T12:00:00Z",
            "updatedAt": "2023-09-30T12:00:00Z"},
            {"id": 2,
            "name": "Jane Smith",
            "birthDate": "15.05.1995",
            "gender": "Female",
            "createdAt": "2023-09-30T12:00:00Z",
            "updatedAt": "2023-09-30T12:00:00Z"},
            {"id": 3,
            "name": "Alice Johnson",
            "birthDate": "22.11.1988",
            "gender": "Female",
            "createdAt": "2023-09-30T12:00:00Z",
            "updatedAt": "2023-09-30T12:00:00Z"}]