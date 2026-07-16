from pydantic import BaseModel, EmailStr
from typing import Optional, Any, List

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