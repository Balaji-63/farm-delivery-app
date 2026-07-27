from pydantic import BaseModel, EmailStr
from typing import Optional, Any, List
from datetime import datetime

class CustomerCreate(BaseModel):
    full_name: str
    mobile_number: str
    email: Optional[EmailStr] = None
    village: str
    password: str

class CustomerLogin(BaseModel):
    mobile_number: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class CustomerOut(BaseModel):
    customer_id: str
    full_name: str
    mobile_number: str
    village: str
    
    class Config:
        from_attributes = True

# 🔥 NEW: Added ProductOut so CartOut and your Router can use it
class ProductOut(BaseModel):
    id: int
    category_id: int
    product_name: str
    description: Optional[str] = None
    product_image: Optional[str] = None
    images: Optional[Any] = None
    price: float
    stock: int
    unit: str
    is_featured: bool
    is_popular: bool
    status: str

    class Config:
        from_attributes = True

class CartBase(BaseModel):
    product_id: int
    quantity: int

class CartCreate(CartBase):
    pass

class CartOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductOut # This will now work perfectly!

    class Config:
        from_attributes = True

class AddressBase(BaseModel):
    full_name: str
    mobile_number: str
    address: str
    village: str
    district: str
    state: str
    pincode: str
    landmark: Optional[str] = None
    is_default: bool = False

class AddressCreate(AddressBase):
    pass

class AddressOut(AddressBase):
    id: int
    customer_id: int
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    address_id: int
    payment_method: str

class OrderOut(BaseModel):
    order_id: str
    total_amount: float
    payment_method: str
    order_status: str
    created_at: datetime
    class Config:
        from_attributes = True

class OrderStatusHistoryOut(BaseModel):
    status: str
    updated_at: datetime

    class Config:
        orm_mode = True

# Update the existing OrderOut schema (if you have one) or add this:
class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    # We will fetch product details dynamically in the route

    class Config:
        orm_mode = True

class OrderOut(BaseModel):
    order_id: str
    total_amount: float
    payment_method: str
    order_status: str
    created_at: datetime
    items: List[OrderItemOut] = []
    status_history: List[OrderStatusHistoryOut] = []

    class Config:
        orm_mode = True