from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from database import get_db
import jwt

# This creates the /api/cart base URL
router = APIRouter(prefix="/api/cart", tags=["Cart"])

# 🛡️ Security Helper: Gets the currently logged-in user from the token
def get_current_user(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
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

# 🛒 ADD TO CART (Handles both /api/cart and /api/cart/)
@router.post("/", response_model=schemas.CartOut)
@router.post("", response_model=schemas.CartOut)
def add_to_cart(item: schemas.CartCreate, db: Session = Depends(get_db), current_user: models.Customer = Depends(get_current_user)):
    # Check if this product is already in the customer's cart
    cart_item = db.query(models.Cart).filter(
        models.Cart.customer_id == current_user.id,
        models.Cart.product_id == item.product_id
    ).first()

    if cart_item:
        # If it's already there, just increase the quantity
        cart_item.quantity += item.quantity
    else:
        # Otherwise, create a brand new cart entry
        cart_item = models.Cart(
            customer_id=current_user.id,
            product_id=item.product_id,
            quantity=item.quantity
        )
        db.add(cart_item)
    
    db.commit()
    db.refresh(cart_item)
    return cart_item

# 🛍️ VIEW CART (Fetches all items for the Cart Page)
@router.get("/", response_model=List[schemas.CartOut])
@router.get("", response_model=List[schemas.CartOut])
def get_cart(db: Session = Depends(get_db), current_user: models.Customer = Depends(get_current_user)):
    return db.query(models.Cart).filter(models.Cart.customer_id == current_user.id).all()
    
# ❌ REMOVE FROM CART
@router.delete("/{cart_id}")
def remove_from_cart(cart_id: int, db: Session = Depends(get_db), current_user: models.Customer = Depends(get_current_user)):
    cart_item = db.query(models.Cart).filter(
        models.Cart.id == cart_id, 
        models.Cart.customer_id == current_user.id
    ).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")
        
    db.delete(cart_item)
    db.commit()
    return {"message": "Item removed successfully"}