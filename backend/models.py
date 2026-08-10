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
    status = Column(String(20), default="Active") # Added for Admin enable/disable customer
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
    images = Column(JSON, nullable=True) # Field for multiple images
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

class CustomerAddress(Base):
    __tablename__ = "customer_addresses"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id")) 
    full_name = Column(String(100))
    mobile_number = Column(String(15))
    address = Column(String(255)) # Door no / Street
    village = Column(String(100))
    district = Column(String(100))
    state = Column(String(100))
    pincode = Column(String(20))
    landmark = Column(String(255), nullable=True)
    is_default = Column(Boolean, default=False)

class Order(Base):
    __tablename__ = "orders"
    
    order_id = Column(String(50), primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id")) 
    total_amount = Column(Float)
    payment_method = Column(String(50))
    order_status = Column(String(50), default="Pending") # Pending, Confirmed, Preparing, Out for Delivery, Delivered, Cancelled
    delivery_partner = Column(String(100), nullable=True) # Added for Admin Delivery Assignment
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    items = relationship("OrderItem", backref="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(50), ForeignKey("orders.order_id"))
    product_id = Column(Integer, ForeignKey("products.id")) 
    quantity = Column(Integer)
    price = Column(Float)

class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(50), ForeignKey("orders.order_id"))
    status = Column(String(50)) # Pending, Confirmed, Preparing, Out for Delivery, Delivered, Cancelled
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationship back to order
    order = relationship("Order", backref="status_history")

class DeliveryPartner(Base):
    __tablename__ = "delivery_partners"

    id = Column(Integer, primary_key=True, index=True)
    partner_id = Column(String(50), unique=True, index=True)
    name = Column(String(100))
    mobile_number = Column(String(15), unique=True, index=True)
    email = Column(String(100), nullable=True)
    status = Column(String(20), default="Active") # Active / Inactive
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class DeliveryAssignment(Base):
    __tablename__ = "delivery_assignments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(50), ForeignKey("orders.order_id"))
    delivery_partner_id = Column(Integer, ForeignKey("delivery_partners.id"))
    delivery_status = Column(String(50), default="Assigned") # Assigned, Accepted, Picked Up, Out for Delivery, Delivered
    assigned_at = Column(DateTime, default=datetime.datetime.utcnow)
    delivered_at = Column(DateTime, nullable=True)

    # Relationships
    order = relationship("Order", backref="delivery_assignment")
    partner = relationship("DeliveryPartner", backref="assignments")