from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import datetime
import models
from database import get_db

router = APIRouter(
    prefix="/api/delivery",
    tags=["Delivery"]
)

# Note: In a production environment, partner_id would be extracted securely from a JWT token.
# For this milestone, we will pass it as a parameter to simulate the logged-in driver.

@router.get("/dashboard/{partner_id}")
def get_delivery_dashboard(partner_id: int, db: Session = Depends(get_db)):
    today = datetime.datetime.utcnow().date()
    
    assignments = db.query(models.DeliveryAssignment).filter(
        models.DeliveryAssignment.delivery_partner_id == partner_id
    ).all()

    today_deliveries = sum(1 for a in assignments if a.assigned_at.date() == today)
    pending_deliveries = sum(1 for a in assignments if a.delivery_status not in ["Delivered", "Cancelled"])
    completed_deliveries = sum(1 for a in assignments if a.delivery_status == "Delivered")

    return {
        "today_deliveries": today_deliveries,
        "pending_deliveries": pending_deliveries,
        "completed_deliveries": completed_deliveries
    }

@router.get("/assignments/{partner_id}")
def get_assigned_orders(partner_id: int, db: Session = Depends(get_db)):
    assignments = db.query(models.DeliveryAssignment).filter(
        models.DeliveryAssignment.delivery_partner_id == partner_id
    ).order_by(models.DeliveryAssignment.id.desc()).all()

    results = []
    for assign in assignments:
        order = assign.order
        customer = db.query(models.Customer).filter(models.Customer.id == order.customer_id).first()
        
        results.append({
            "assignment_id": assign.id,
            "order_id": order.order_id,
            "customer_name": customer.full_name if customer else "Unknown",
            "mobile_number": customer.mobile_number if customer else "",
            "delivery_address": customer.village if customer else "No Address Provided", 
            "total_amount": order.total_amount,
            "payment_method": order.payment_method,
            "delivery_status": assign.delivery_status,
            "assigned_at": assign.assigned_at
        })
    return results

@router.put("/assignments/{assignment_id}/status")
def update_delivery_status(assignment_id: int, status_data: dict, db: Session = Depends(get_db)):
    assignment = db.query(models.DeliveryAssignment).filter(models.DeliveryAssignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    new_status = status_data.get("delivery_status")
    assignment.delivery_status = new_status

    if new_status == "Delivered":
        assignment.delivered_at = datetime.datetime.utcnow()

    # Keep the main order table completely synced
    order = db.query(models.Order).filter(models.Order.order_id == assignment.order_id).first()
    if order:
        order.order_status = new_status

    db.commit()
    return {"message": f"Status successfully updated to {new_status}"}