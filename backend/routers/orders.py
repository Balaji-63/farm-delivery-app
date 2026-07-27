from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from routers.checkout import get_current_user # Reusing auth logic

router = APIRouter(prefix="/api/orders", tags=["Orders"])

@router.get("", response_model=List[schemas.OrderOut])
def get_my_orders(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    orders = db.query(models.Order).filter(models.Order.customer_id == current_user.id).order_by(models.Order.created_at.desc()).all()
    return orders

@router.get("/{order_id}", response_model=schemas.OrderOut)
def get_order_details(order_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    order = db.query(models.Order).filter(models.Order.order_id == order_id, models.Order.customer_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/{order_id}/cancel")
def cancel_order(order_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    order = db.query(models.Order).filter(models.Order.order_id == order_id, models.Order.customer_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.order_status not in ["Pending"]:
        raise HTTPException(status_code=400, detail="Order cannot be cancelled at this stage")
        
    order.order_status = "Cancelled"
    
    # Add to history
    history = models.OrderStatusHistory(order_id=order_id, status="Cancelled")
    db.add(history)
    db.commit()
    return {"message": "Order cancelled successfully"}

@router.post("/{order_id}/reorder")
def reorder_items(order_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    order = db.query(models.Order).filter(models.Order.order_id == order_id, models.Order.customer_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Move previous items into user's cart
    for item in order.items:
        # Check if item already in cart to increment, or just add new
        existing_cart_item = db.query(models.Cart).filter(
            models.Cart.customer_id == current_user.id, 
            models.Cart.product_id == item.product_id
        ).first()
        
        if existing_cart_item:
            existing_cart_item.quantity += item.quantity
        else:
            new_cart_item = models.Cart(
                customer_id=current_user.id,
                product_id=item.product_id,
                quantity=item.quantity
            )
            db.add(new_cart_item)
            
    db.commit()
    return {"message": "Items added to cart successfully"}