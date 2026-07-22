from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, auth
from database import engine, get_db
from auth import oauth2_scheme
import jwt

# 🔥 FIXED: Added the checkout router to your imports
from routers import storefront, cart, checkout

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Farm Delivery API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allows your Vite frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],
)

# 🔥 FIXED: Registering the checkout router here so FastAPI knows it exists
app.include_router(storefront.router)
app.include_router(cart.router)
app.include_router(checkout.router)

# --- REGISTRATION ---
@app.post("/api/register", response_model=schemas.CustomerOut)
def register_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    # Check if mobile exists
    db_user = db.query(models.Customer).filter(models.Customer.mobile_number == customer.mobile_number).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Mobile number already registered")
    
    # Generate CUS00X ID
    last_customer = db.query(models.Customer).order_by(models.Customer.id.desc()).first()
    if last_customer:
        last_id_num = int(last_customer.customer_id.replace("CUS", ""))
        new_customer_id = f"CUS{last_id_num + 1:03d}"
    else:
        new_customer_id = "CUS001"

    hashed_pw = auth.get_password_hash(customer.password)
    
    new_user = models.Customer(
        customer_id=new_customer_id,
        full_name=customer.full_name,
        mobile_number=customer.mobile_number,
        email=customer.email,
        village=customer.village,
        password_hash=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# --- LOGIN ---
@app.post("/api/login", response_model=schemas.Token)
def login(credentials: schemas.CustomerLogin, db: Session = Depends(get_db)):
    user = db.query(models.Customer).filter(models.Customer.mobile_number == credentials.mobile_number).first()
    if not user or not auth.verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token = auth.create_access_token(data={"sub": user.mobile_number, "customer_id": user.customer_id})
    return {"access_token": access_token, "token_type": "bearer"}

# --- PROFILE (PROTECTED) ---
@app.get("/api/profile", response_model=schemas.CustomerOut)
def get_profile(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        mobile = payload.get("sub")
        if mobile is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    user = db.query(models.Customer).filter(models.Customer.mobile_number == mobile).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user