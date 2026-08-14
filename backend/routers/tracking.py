from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import datetime
import models, schemas
from database import get_db

router = APIRouter(
    prefix="/api/tracking",
    tags=["Tracking"]
)

# Helper function to insert a log every time a status changes
def log_order_status(db: Session, order_id: str, status: str, updated_by: str = "System"):
    new_log = models.OrderTracking(order_id=order_id, status=status, updated_by=updated_by)
    db.add(new_log)
    db.commit()

@router.get("/{order_id}")
def get_order_tracking(order_id: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Fetch all historical status changes for this order
    tracking = db.query(models.OrderTracking).filter(
        models.OrderTracking.order_id == order_id
    ).order_by(models.OrderTracking.updated_at.asc()).all()
    
    # Get active delivery partner info if assigned
    partner_info = None
    if order.delivery_partner:
        partner = db.query(models.DeliveryPartner).filter(models.DeliveryPartner.name == order.delivery_partner).first()
        if partner:
            partner_info = {
                "name": partner.name,
                "mobile_number": partner.mobile_number
            }
            
    # Calculate a simple 2-hour ETA based on order creation time
    eta = (order.created_at + datetime.timedelta(hours=2)).isoformat() if order.order_status != "Delivered" else None
    return {
        "order_id": order.order_id,
        "current_status": order.order_status,
        "tracking_history": tracking,
        "delivery_partner": partner_info,
        "estimated_delivery": eta
    }