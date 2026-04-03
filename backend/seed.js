const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const db = require("./utils/db");

async function seed() {
  console.log("Seeding database...");

  const hash = await bcrypt.hash("password123", 10);

  const users = [
    { id: "u1", name: "Raj Kumar", email: "raj@example.com", passwordHash: hash, phone: "9876543210", role: "owner", isVerified: true, avatar: "", bio: "Property owner with 5+ years experience", createdAt: new Date().toISOString() },
    { id: "u2", name: "Priya Singh", email: "priya@example.com", passwordHash: hash, phone: "9876543211", role: "owner", isVerified: true, avatar: "", bio: "Managing 3 properties in Hyderabad", createdAt: new Date().toISOString() },
    { id: "u3", name: "Arjun Mehta", email: "arjun@example.com", passwordHash: hash, phone: "9876543212", role: "tenant", isVerified: true, avatar: "", bio: "Software engineer at TCS, looking for a room near Hitech City", createdAt: new Date().toISOString() },
    { id: "u4", name: "Sana Shaikh", email: "sana@example.com", passwordHash: hash, phone: "9876543213", role: "tenant", isVerified: false, avatar: "", bio: "MBA student at ISB, need a quiet place to study", createdAt: new Date().toISOString() },
    { id: "u5", name: "Vikram Nair", email: "vikram@example.com", passwordHash: hash, phone: "9876543214", role: "tenant", isVerified: true, avatar: "", bio: "Working professional, early riser, non-smoker", createdAt: new Date().toISOString() },
  ];
  db.writeAll("users", users);

  const listings = [
    { id: "l1", ownerId: "u1", title: "Spacious 2BHK in Banjara Hills", description: "Well-furnished 2BHK apartment with modular kitchen, 24/7 security and power backup. Walking distance to Hi-Lites Mall. Ideal for working professionals or small families.", propertyType: "flat", rent: 22000, deposit: 66000, bedrooms: 2, bathrooms: 2, area: "Banjara Hills", city: "Hyderabad", pincode: "500034", amenities: ["wifi", "ac", "parking", "gym", "power_backup"], photos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80"], availableFrom: "2024-02-01T00:00:00.000Z", isAvailable: true, createdAt: new Date(Date.now()-5*86400000).toISOString() },
    { id: "l2", ownerId: "u1", title: "Cozy 1BHK near Hitech City Metro", description: "Fully furnished 1BHK close to Hitech City metro station. Perfect for IT professionals. Semi-furnished with basic amenities. No brokerage.", propertyType: "flat", rent: 14000, deposit: 28000, bedrooms: 1, bathrooms: 1, area: "Hitech City", city: "Hyderabad", pincode: "500081", amenities: ["wifi", "ac", "power_backup"], photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80"], availableFrom: "2024-01-15T00:00:00.000Z", isAvailable: true, createdAt: new Date(Date.now()-3*86400000).toISOString() },
    { id: "l3", ownerId: "u2", title: "PG Accommodation for Girls – Jubilee Hills", description: "Safe and secure PG for working women and students. Home-cooked meals included. CCTV, biometric entry, dedicated study room. Strict no-visitors policy after 10 PM.", propertyType: "pg", rent: 8500, deposit: 17000, bedrooms: 1, bathrooms: 1, area: "Jubilee Hills", city: "Hyderabad", pincode: "500033", amenities: ["wifi", "meals", "laundry", "cctv"], photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80"], availableFrom: "2024-01-20T00:00:00.000Z", isAvailable: true, createdAt: new Date(Date.now()-2*86400000).toISOString() },
    { id: "l4", ownerId: "u2", title: "3BHK Independent House – Gachibowli", description: "Spacious independent house in prime Gachibowli location. Large terrace, servant quarters, dedicated parking for 2 cars. Close to DLF, Raheja IT Park and top schools.", propertyType: "house", rent: 38000, deposit: 114000, bedrooms: 3, bathrooms: 3, area: "Gachibowli", city: "Hyderabad", pincode: "500032", amenities: ["parking", "garden", "power_backup", "cctv", "ac"], photos: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80", "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&q=80"], availableFrom: "2024-02-10T00:00:00.000Z", isAvailable: true, createdAt: new Date(Date.now()-1*86400000).toISOString() },
    { id: "l5", ownerId: "u1", title: "Furnished Room – Madhapur", description: "Single furnished room in a shared 3BHK. Flatmates are IT professionals. Attached bathroom, wardrobe, AC. Split utility bills. No brokerage, owner verified.", propertyType: "room", rent: 7500, deposit: 15000, bedrooms: 1, bathrooms: 1, area: "Madhapur", city: "Hyderabad", pincode: "500081", amenities: ["wifi", "ac", "washing_machine"], photos: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&q=80"], availableFrom: "2024-01-25T00:00:00.000Z", isAvailable: true, createdAt: new Date().toISOString() },
  ];
  db.writeAll("listings", listings);

  const roommateProfiles = [
    { id: "rp3", userId: "u3", budgetMin: 6000, budgetMax: 10000, preferredArea: "Hitech City", genderPref: "male", gender: "male", smoking: false, sleepSchedule: "early", cleanliness: 4, workSchedule: "9-5 office", bio: "Looking for a fellow IT professional. Like to keep things clean and tidy.", createdAt: new Date().toISOString() },
    { id: "rp4", userId: "u4", budgetMin: 7000, budgetMax: 9000, preferredArea: "Jubilee Hills", genderPref: "female", gender: "female", smoking: false, sleepSchedule: "flexible", cleanliness: 5, workSchedule: "student", bio: "MBA student, need a quiet study environment, vegetarian preferred.", createdAt: new Date().toISOString() },
    { id: "rp5", userId: "u5", budgetMin: 6000, budgetMax: 11000, preferredArea: "Hitech City", genderPref: "male", gender: "male", smoking: false, sleepSchedule: "early", cleanliness: 4, workSchedule: "9-5 office", bio: "Early riser, gym enthusiast, very organized.", createdAt: new Date().toISOString() },
  ];
  db.writeAll("roommateProfiles", roommateProfiles);

  const reviews = [
    { id: "rv1", reviewerId: "u3", targetId: "l2", targetType: "listing", rating: 5, comment: "Amazing location, owner was very responsive. Highly recommend!", createdAt: new Date().toISOString() },
    { id: "rv2", reviewerId: "u4", targetId: "l3", targetType: "listing", rating: 4, comment: "Great PG, very safe and clean. Meals are good but could be improved.", createdAt: new Date().toISOString() },
  ];
  db.writeAll("reviews", reviews);
  db.writeAll("messages", []);
  db.writeAll("connections", []);

  console.log("Done! Seeded users, listings, roommate profiles, reviews.");
  console.log("\nTest accounts (password: password123):");
  console.log("  Owner:  raj@example.com");
  console.log("  Tenant: arjun@example.com, sana@example.com, vikram@example.com");
}

seed().catch(console.error);
