from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.goal_routes import router as goal_router
from routes.deposit_routes import router as deposit_router

app = FastAPI()

# Dependency to get DB session

origins = [
    "http://localhost:5173",  # Vite React
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_root():
    return {"Hello": "World"}


app.include_router(goal_router)
app.include_router(deposit_router)
