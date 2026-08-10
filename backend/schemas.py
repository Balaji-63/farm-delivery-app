from pydantic import BaseModel, EmailStr
from typing import Optional, Any, List
from datetime import datetime

# ==========================================
# CUSTOMER SCHEMAS
# ==========================================
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
    email: Optional[EmailStr] = None
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class CustomerStatusUpdate(BaseModel):
    status: str

# ==========================================
# CATEGORY SCHEMAS (NEW FOR ADMIN)
# ==========================================
class CategoryBase(BaseModel):
    category_name: str
    category_image: Optional[str] = None
    status: str = "Active"

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    category_name: Optional[str] = None
    category_image: Optional[str] = None
    status: Optional[str] = None

class CategoryOut(CategoryBase):
    id: int
    class Config:
        from_attributes = True

# ==========================================
# PRODUCT SCHEMAS
# ==========================================
class ProductBase(BaseModel):
    category_id: int
    product_name: str
    description: Optional[str] = None
    product_image: Optional[str] = None
    images: Optional[Any] = None
    price: float
    stock: int
    unit: str
    is_featured: bool = False
    is_popular: bool = False
    status: str = "Active"

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    category_id: Optional[int] = None
    product_name: Optional[str] = None
    description: Optional[str] = None
    product_image: Optional[str] = None
    images: Optional[Any] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    unit: Optional[str] = None
    is_featured: Optional[bool] = None
    is_popular: Optional[bool] = None
    status: Optional[str] = None

class ProductOut(ProductBase):
    id: int

    class Config:
        from_attributes = True

# ==========================================
# CART SCHEMAS
# ==========================================
class CartBase(BaseModel):
    product_id: int
    quantity: int

class CartCreate(CartBase):
    pass

class CartOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductOut

    class Config:
        from_attributes = True

# ==========================================
# ADDRESS SCHEMAS
# ==========================================
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

# ==========================================
# ORDER SCHEMAS
# ==========================================
class OrderCreate(BaseModel):
    address_id: int
    payment_method: str

class OrderStatusHistoryOut(BaseModel):
    status: str
    updated_at: datetime

    class Config:
        from_attributes = True

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float

    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    order_id: str
    total_amount: float
    payment_method: str
    order_status: str
    delivery_partner: Optional[str] = None
    created_at: datetime
    items: List[OrderItemOut] = []
    status_history: List[OrderStatusHistoryOut] = []

    class Config:
        from_attributes = True

class OrderUpdateAdmin(BaseModel):
    order_status: Optional[str] = None
    delivery_partner: Optional[str] = None

# ==========================================
# DASHBOARD SCHEMAS (NEW FOR ADMIN)
# ==========================================
class DashboardSummary(BaseModel):
    total_customers: int
    total_categories: int
    total_products: int
    total_orders: int
    pending_orders: int
    delivered_orders: int
    total_revenue: float

class DeliveryPartnerBase(BaseModel):
    name: str
    mobile_number: str
    email: Optional[str] = None
    status: Optional[str] = "Active"

class DeliveryPartnerCreate(DeliveryPartnerBase):
    partner_id: str

class DeliveryPartnerOut(DeliveryPartnerBase):
    id: int
    partner_id: str

    class Config:
        orm_mode = True

class DeliveryAssignmentCreate(BaseModel):
    order_id: str
    delivery_partner_id: int

class DeliveryStatusUpdate(BaseModel):
    delivery_status: str