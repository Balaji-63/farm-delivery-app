from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, JSON, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String(10), unique=True, index=True)
    full_name = Column(String(100))
    mobile_number = Column(String(15), unique=True, index=True)
    email = Column(String(100), nullable=True)
    village = Column(String(100))
    password_hash = Column(String(255))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(100), nullable=False)
    category_image = Column(String(255), nullable=True)
    status = Column(String(20), default="Active")
    
    # Relationship to products
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    product_name = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    product_image = Column(String(255), nullable=True)
    images = Column(JSON, nullable=True) # New field for multiple images
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0, nullable=False)
    unit = Column(String(20), nullable=False) # Kg / Litre / Piece
    is_featured = Column(Boolean, default=False)
    is_popular = Column(Boolean, default=False) 
    status = Column(String(20), default="Active")
    
    # Relationship back to category
    category = relationship("Category", back_populates="products")

class Cart(Base):
    __tablename__ = "cart"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    product = relationship("Product")