from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
import uuid
import jwt
from auth import oauth2_scheme, SECRET_KEY, ALGORITHM

# 🔥 FIXED: Changed prefix from "/api/checkout" to "/api" so it matches your React api.js file
router = APIRouter(prefix="/api", tags=["Checkout"])

# 🔥 FIXED: Added the missing get_current_user dependency so it actually verifies the token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        mobile = payload.get("sub")
        if mobile is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    user = db.query(models.Customer).filter(models.Customer.mobile_number == mobile).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# --- ADDRESS MANAGEMENT ---

@router.post("/addresses", response_model=schemas.AddressOut)
def add_address(address: schemas.AddressCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # If this is set as default, remove default from others
    if address.is_default:
        db.query(models.CustomerAddress).filter(models.CustomerAddress.customer_id == current_user.id).update({"is_default": False})
        
    new_address = models.CustomerAddress(**address.dict(), customer_id=current_user.id)
    db.add(new_address)
    db.commit()
    db.refresh(new_address)
    return new_address

@router.get("/addresses", response_model=List[schemas.AddressOut])
def get_addresses(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(models.CustomerAddress).filter(models.CustomerAddress.customer_id == current_user.id).all()

@router.delete("/addresses/{address_id}")
def delete_address(address_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    address = db.query(models.CustomerAddress).filter(models.CustomerAddress.id == address_id, models.CustomerAddress.customer_id == current_user.id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    db.delete(address)
    db.commit()
    return {"message": "Address deleted"}

# --- ORDER PLACEMENT ---

@router.post("/orders", response_model=schemas.OrderOut)
def place_order(order_req: schemas.OrderCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # 1. Get user's cart items
    cart_items = db.query(models.Cart).filter(models.Cart.customer_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # 2. Calculate Total
    item_total = sum([item.quantity * item.product.price for item in cart_items])
    delivery_charge = 40.0 if item_total < 500 else 0.0
    grand_total = item_total + delivery_charge

    # 3. Generate Order ID
    new_order_id = f"ORD-{uuid.uuid4().hex[:6].upper()}"

    # 4. Create Order
    new_order = models.Order(
        order_id=new_order_id,
        customer_id=current_user.id,
        total_amount=grand_total,
        payment_method=order_req.payment_method,
        order_status="Pending"
    )
    db.add(new_order)

    # 5. Move Cart Items to Order Items
    for item in cart_items:
        order_item = models.OrderItem(
            order_id=new_order_id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price
        )
        db.add(order_item)

    # 6. Clear Cart
    db.query(models.Cart).filter(models.Cart.customer_id == current_user.id).delete()
    
    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/orders/{order_id}", response_model=schemas.OrderOut)
def get_order_details(order_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    order = db.query(models.Order).filter(models.Order.order_id == order_id, models.Order.customer_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order