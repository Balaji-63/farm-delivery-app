from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Ensure tables exist
models.Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    try:
        # Clear existing data to prevent duplicates
        db.query(models.Product).delete()
        db.query(models.Category).delete()
        db.commit()

        print("🌱 Planting categories...")
        categories = [
            {"name": "Milk & Dairy", "img": "https://images.unsplash.com/photo-1550583724-b2692b85b150"},
            {"name": "Fresh Meat", "img": "https://images.unsplash.com/photo-1632154023554-c2975e9be348?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
            {"name": "Sea Food", "img": "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62"},
            {"name": "Eggs", "img": "https://images.unsplash.com/photo-1506976785307-8732e854ad03"}
        ]
        
        cat_map = {}
        for c in categories:
            new_cat = models.Category(category_name=c["name"], category_image=c["img"], status="Active")
            db.add(new_cat)
            db.commit()
            db.refresh(new_cat)
            cat_map[c["name"]] = new_cat.id

        print("📦 Stocking all 13 Farm Products...")
        products = [
            # ----- MILK & DAIRY -----
            {
                "name": "Cow Milk", "cat": "Milk & Dairy", "price": 60.0, "unit": "Litre", "stock": 100, "featured": True,
                "desc": "Fresh, raw cow milk straight from the village farm. Delivered daily within hours of milking.",
                "img": "https://plus.unsplash.com/premium_photo-1694481100261-ab16523c4093?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
                "name": "Goat Milk", "cat": "Milk & Dairy", "price": 120.0, "unit": "Litre", "stock": 30, "featured": False,
                "desc": "Highly nutritious, easily digestible raw goat milk. Perfect for immunity and health.",
                "img": "https://plus.unsplash.com/premium_photo-1694481100261-ab16523c4093?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            
            # ----- SEA FOOD -----
            {
                "name": "Fresh Water Fish", "cat": "Sea Food", "price": 250.0, "unit": "Kg", "stock": 40, "featured": True,
                "desc": "Catch of the day! Freshly caught from local village lakes and ponds.",
                "img": "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62",
            },
            {
                "name": "Sea Fish", "cat": "Sea Food", "price": 350.0, "unit": "Kg", "stock": 50, "featured": False,
                "desc": "Premium salt-water fish sourced directly from the morning coastal catch.",
                "img": "https://images.unsplash.com/photo-1527615387286-63d18588792e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
                "name": "Fresh Water Prawn", "cat": "Sea Food", "price": 550.0, "unit": "Kg", "stock": 25, "featured": True,
                "desc": "Sweet and tender fresh water prawns organically farmed in village ponds.",
                "img": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47",
            },
            {
                "name": "Sea Prawn", "cat": "Sea Food", "price": 650.0, "unit": "Kg", "stock": 30, "featured": False,
                "desc": "Large, juicy sea prawns packed with flavor, delivered fresh from the coast.",
                "img": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },

            # ----- FRESH MEAT -----
            {
                "name": "Country Chicken", "cat": "Fresh Meat", "price": 350.0, "unit": "Kg", "stock": 40, "featured": True,
                "desc": "Organic free-range country chicken (Nattu Kozhi). Healthy, farm-raised, and tender.",
                "img": "https://images.unsplash.com/photo-1694984716506-525271247a72?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
                "name": "Broiler Chicken", "cat": "Fresh Meat", "price": 220.0, "unit": "Kg", "stock": 80, "featured": False,
                "desc": "Clean, fresh, and tender broiler chicken. Perfect for everyday curries and roasts.",
                "img": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
                "name": "Goat Meat", "cat": "Fresh Meat", "price": 850.0, "unit": "Kg", "stock": 15, "featured": True,
                "desc": "Premium quality, grass-fed organic goat meat (Mutton) sourced directly from the village.",
                "img": "https://images.unsplash.com/photo-1448907503123-67254d59ca4f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },

            # ----- EGGS -----
            {
                "name": "Country Eggs", "cat": "Eggs", "price": 90.0, "unit": "Dozen", "stock": 100, "featured": True,
                "desc": "Nutrient-rich, organic brown eggs sourced directly from free-roaming village hens.",
                "img": "https://images.unsplash.com/photo-1506976785307-8732e854ad03",
            },
            {
                "name": "White Eggs", "cat": "Eggs", "price": 60.0, "unit": "Dozen", "stock": 200, "featured": False,
                "desc": "Farm fresh, high-protein daily white eggs delivered safely to your door.",
                "img": "https://plus.unsplash.com/premium_photo-1726072360068-cdc3561ea615?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
                "name": "Quail Eggs", "cat": "Eggs", "price": 120.0, "unit": "Pack of 20", "stock": 30, "featured": False,
                "desc": "Highly nutritious, speckled quail eggs. A superfood straight from the farm.",
                "img": "https://images.unsplash.com/photo-1516684669134-de6f7c473a2a",
            },
            {
                "name": "Duck Eggs", "cat": "Eggs", "price": 150.0, "unit": "Dozen", "stock": 40, "featured": False,
                "desc": "Large, rich, and creamy duck eggs. Excellent for baking and robust breakfasts.",
                "img": "https://images.unsplash.com/photo-1637100352284-558716ddbb35?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }
        ]

        for p in products:
            # Create a simulated array of 3 images for the Day 3 Product Details gallery
            image_array = [p["img"], p["img"], p["img"]] 

            new_prod = models.Product(
                category_id=cat_map[p["cat"]],
                product_name=p["name"],
                description=p["desc"],
                product_image=p["img"],
                images=image_array, 
                price=p["price"],
                stock=p["stock"],
                unit=p["unit"],
                is_featured=p["featured"],
                status="Active"
            )
            db.add(new_prod)
        
        db.commit()
        print("✅ Success! All 13 master products have been successfully seeded into the database!")

    except Exception as e:
        print(f"❌ Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()