from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
import models,schemas
from database import get_db

router = APIRouter(prefix="/api/storefront", tags=["Storefront"])

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    """Fetch all active categories."""
    categories = db.query(models.Category).filter(models.Category.status == "Active").all()
    # Add product count dynamically
    result = []
    for cat in categories:
        count = db.query(models.Product).filter(models.Product.category_id == cat.id).count()
        result.append({
            "id": cat.id,
            "category_name": cat.category_name,
            "category_image": cat.category_image,
            "product_count": count
        })
    return result

@router.get("/categories/{category_id}/products")
def get_products_by_category(category_id: int, db: Session = Depends(get_db)):
    """Fetch all products for a specific category."""
    products = db.query(models.Product).filter(
        models.Product.category_id == category_id,
        models.Product.status == "Active"
    ).all()
    return products

@router.get("/products/featured")
def get_featured_products(db: Session = Depends(get_db)):
    return db.query(models.Product).filter(models.Product.is_featured == True).limit(8).all()

@router.get("/products/popular")
def get_popular_products(db: Session = Depends(get_db)):
    return db.query(models.Product).filter(models.Product.is_popular == True).limit(8).all()

@router.get("/search")
def search_products(q: str, db: Session = Depends(get_db)):
    """Search by product name or category name."""
    products = db.query(models.Product).join(models.Category).filter(
        or_(
            models.Product.product_name.ilike(f"%{q}%"),
            models.Category.category_name.ilike(f"%{q}%")
        ),
        models.Product.status == "Active"
    ).all()
    return products

@router.get("/products/detail/{product_id}", response_model=schemas.ProductOut)
def get_product_details(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/products/{product_id}/related", response_model=List[schemas.ProductOut])
def get_related_products(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Fetch products in the same category, excluding the current one
    return db.query(models.Product).filter(
        models.Product.category_id == product.category_id,
        models.Product.id != product_id
    ).limit(4).all()