from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas
from database import get_db

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)

@router.get("/dashboard-summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    # FIX: Changed from models.User to models.Customer
    total_customers = db.query(models.Customer).count()
    total_categories = db.query(models.Category).count()
    total_products = db.query(models.Product).count()
    
    total_orders = db.query(models.Order).count()
    
    # FIX: Changed Order.status to Order.order_status
    pending_orders = db.query(models.Order).filter(models.Order.order_status == "Pending").count()
    delivered_orders = db.query(models.Order).filter(models.Order.order_status == "Delivered").count()
    
    revenue_result = db.query(func.sum(models.Order.total_amount)).filter(models.Order.order_status == "Delivered").scalar()
    total_revenue = revenue_result if revenue_result else 0.0

    return {
        "total_customers": total_customers,
        "total_categories": total_categories,
        "total_products": total_products,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "delivered_orders": delivered_orders,
        "total_revenue": total_revenue
    }

# ==========================================
# CATEGORY MANAGEMENT
# ==========================================
@router.get("/categories")
def get_admin_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@router.post("/categories")
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    new_cat = models.Category(**category.dict())
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

@router.put("/categories/{category_id}")
def update_category(category_id: int, category: schemas.CategoryUpdate, db: Session = Depends(get_db)):
    db_cat = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_cat, key, value)
    db.commit()
    db.refresh(db_cat)
    return db_cat

@router.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_cat = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_cat)
    db.commit()
    return {"message": "Category deleted successfully"}

# ==========================================
# PRODUCT MANAGEMENT
# ==========================================
@router.get("/products")
def get_admin_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@router.post("/products")
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    new_prod = models.Product(**product.dict())
    db.add(new_prod)
    db.commit()
    db.refresh(new_prod)
    return new_prod

@router.put("/products/{product_id}")
def update_product(product_id: int, product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_prod = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_prod:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_prod, key, value)
    db.commit()
    db.refresh(db_prod)
    return db_prod

@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_prod = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_prod:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_prod)
    db.commit()
    return {"message": "Product deleted successfully"}

# ==========================================
# ORDER MANAGEMENT
# ==========================================
@router.get("/orders")
def get_admin_orders(db: Session = Depends(get_db)):
    # FIX: Sorted by created_at since order_id is a string
    return db.query(models.Order).order_by(models.Order.created_at.desc()).all()

# FIX: order_id is a string, not an int
@router.put("/orders/{order_id}/status")
def update_order_status(order_id: str, update_data: dict, db: Session = Depends(get_db)):
    # FIX: query by order_id instead of id
    db_order = db.query(models.Order).filter(models.Order.order_id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # FIX: Map payload 'status' to model 'order_status'
    if "status" in update_data:
        db_order.order_status = update_data["status"]
        
    if "delivery_partner" in update_data:
        db_order.delivery_partner = update_data["delivery_partner"]
        
    db.commit()
    db.refresh(db_order)
    return db_order

# ==========================================
# CUSTOMER MANAGEMENT
# ==========================================
@router.get("/customers")
def get_admin_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).order_by(models.Customer.id.desc()).all()

@router.put("/customers/{customer_id}/status")
def update_customer_status(customer_id: int, status_update: dict, db: Session = Depends(get_db)):
    db_customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    if "status" in status_update:
        db_customer.status = status_update["status"]
        db.commit()
        db.refresh(db_customer)
        
    return db_customer