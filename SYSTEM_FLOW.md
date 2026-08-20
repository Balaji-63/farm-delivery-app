### 3. System Flow Diagram

# System Flow Diagram

mermaid
graph TD
    %% Customer Flow
    A[Customer Logs In] --> B[Browse Storefront]
    B --> C[Add Items to Cart]
    C --> D[Checkout & Place Order]
    
    %% Order Processing
    D -->|Creates Order| E[(MySQL Database)]
    E --> F[Order Status: Pending]
    
    %% Admin Flow
    G[Admin Logs In] --> H[View Pending Orders]
    H --> I[Assign Delivery Partner]
    I -->|Updates DB| E
    I --> J[Order Status: Assigned]
    
    %% Delivery Flow
    K[Delivery Partner Logs In] --> L[View Assigned Orders]
    J -.-> L
    L --> M[Accept Delivery]
    M --> N[Mark Picked Up]
    N --> O[Out for Delivery]
    O --> P[Confirm Delivered]
    
    %% Tracking Flow (Simultaneous)
    P -->|Updates DB| E
    E -.-> Q[Customer Tracking Page]
    Q --> R[Views Live Timeline & ETA]
    R --> S[Order Complete / Reorder]