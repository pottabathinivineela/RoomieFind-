const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db");
const { verifyToken } = require("../middleware/auth");

router.get("/", (req, res) => {
  let listings = db.findAll("listings").filter((l) => l.isAvailable);
  const { location, minRent, maxRent, type, amenity, q } = req.query;
  if (location) listings = listings.filter((l) => l.city?.toLowerCase().includes(location.toLowerCase()) || l.area?.toLowerCase().includes(location.toLowerCase()));
  if (minRent) listings = listings.filter((l) => l.rent >= Number(minRent));
  if (maxRent) listings = listings.filter((l) => l.rent <= Number(maxRent));
  if (type) listings = listings.filter((l) => l.propertyType === type);
  if (amenity) listings = listings.filter((l) => l.amenities?.includes(amenity));
  if (q) { const ql = q.toLowerCase(); listings = listings.filter((l) => l.title?.toLowerCase().includes(ql) || l.description?.toLowerCase().includes(ql)); }
  listings = listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const owners = {};
  listings.forEach((l) => {
    if (!owners[l.ownerId]) {
      const u = db.findOne("users", (u) => u.id === l.ownerId);
      if (u) { const { passwordHash: _, ...safe } = u; owners[l.ownerId] = safe; }
    }
  });
  res.json({ listings, owners });
});

router.get("/:id", (req, res) => {
  const listing = db.findOne("listings", (l) => l.id === req.params.id);
  if (!listing) return res.status(404).json({ error: "Listing not found" });
  const owner = db.findOne("users", (u) => u.id === listing.ownerId);
  const reviews = db.findMany("reviews", (r) => r.targetId === listing.id);
  const { passwordHash: _, ...safeOwner } = owner || {};
  res.json({ listing, owner: safeOwner, reviews });
});

router.post("/", verifyToken, (req, res) => {
  const { title, description, propertyType, rent, deposit, bedrooms, bathrooms, area, city, pincode, amenities, photos, availableFrom } = req.body;
  if (!title || !rent || !city) return res.status(400).json({ error: "Title, rent and city required" });
  const listing = db.insert("listings", {
    id: uuidv4(), ownerId: req.user.id, title, description: description || "",
    propertyType: propertyType || "flat", rent: Number(rent), deposit: Number(deposit) || 0,
    bedrooms: Number(bedrooms) || 1, bathrooms: Number(bathrooms) || 1,
    area: area || "", city, pincode: pincode || "",
    amenities: amenities || [], photos: photos || [],
    availableFrom: availableFrom || new Date().toISOString(),
    isAvailable: true, createdAt: new Date().toISOString(),
  });
  res.status(201).json(listing);
});

router.put("/:id", verifyToken, (req, res) => {
  const listing = db.findOne("listings", (l) => l.id === req.params.id);
  if (!listing) return res.status(404).json({ error: "Not found" });
  if (listing.ownerId !== req.user.id) return res.status(403).json({ error: "Forbidden" });
  const updated = db.update("listings", (l) => l.id === req.params.id, req.body);
  res.json(updated);
});

router.delete("/:id", verifyToken, (req, res) => {
  const listing = db.findOne("listings", (l) => l.id === req.params.id);
  if (!listing) return res.status(404).json({ error: "Not found" });
  if (listing.ownerId !== req.user.id && req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  db.remove("listings", (l) => l.id === req.params.id);
  res.json({ message: "Deleted" });
});

router.get("/owner/my", verifyToken, (req, res) => {
  const listings = db.findMany("listings", (l) => l.ownerId === req.user.id);
  res.json(listings);
});

module.exports = router;
