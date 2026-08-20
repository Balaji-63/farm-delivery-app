### 4. ER Diagram (Entity Relationship)

# Database Entity Relationship (ER) Diagram

mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER ||--o{ CART : owns
    CUSTOMER {
        string id PK
        string customer_id
        string full_name
        string mobile_number
        string email
        string village
    }

    CATEGORY ||--o{ PRODUCT : contains
    CATEGORY {
        int id PK
        string name
        string description
    }

    PRODUCT ||--o{ CART : added_to
    PRODUCT ||--o{ ORDER_ITEM : part_of
    PRODUCT {
        int id PK
        int category_id FK
        string name
        float price
        int stock
    }

    ORDER ||--|{ ORDER_ITEM : includes
    ORDER ||--o{ ORDER_TRACKING : has_history
    ORDER ||--o{ DELIVERY_HISTORY : logged_in
    ORDER {
        string order_id PK
        string customer_id FK
        float total_amount
        string order_status
        datetime created_at
    }

    DELIVERY_PARTNER ||--o{ ORDER : assigned_to
    DELIVERY_PARTNER ||--o{ DELIVERY_ASSIGNMENT : handles
    DELIVERY_PARTNER {
        int id PK
        string partner_id
        string name
        string mobile_number
        string status
    }
az
    ORDER_TRACKING {
        int id PK
        string order_id FK
        string status
        string updated_by
        datetime updated_at
    }