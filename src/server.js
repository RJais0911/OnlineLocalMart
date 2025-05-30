const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./db");
connectDB();

const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  information: {
    type: String,
    required: [true, "Information is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["electronics", "clothing", "grocery", "accessories"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Item name is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  image_url: {
    type: String,
    required: [true, "Image URL is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: [true, "Vendor ID is required"],
  },
});

const Shop = mongoose.model("Shop", shopSchema);
const Item = mongoose.model("Item", itemSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.post("/register-shop", async (req, res) => {
  try {
    const { name, info, category, username, password } = req.body;

    if (!name || !info || !category || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingShop = await Shop.findOne({ username });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    const shop = new Shop({
      name,
      information: info,
      category,
      username,
      password,
    });

    const savedShop = await shop.save();
    res.redirect(`/login.html`);

    console.log("Shop registered successfully with ID:", savedShop._id);
  } catch (error) {
    console.error("Error registering shop:", error);
    res.status(500).json({
      success: false,
      message: "Error registering shop",
      error: error.message,
    });
  }
});

app.get("/vendors", async (req, res) => {
  try {
    const vendors = await Shop.find({});
    console.log("Vendors fetched successfully:", vendors);
    res.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/vendor/:id", async (req, res) => {
  try {
    const vendorId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID format",
      });
    }

    const vendor = await Shop.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const items = await Item.find({ vendor_id: vendorId }).select(
      "name price image_url description"
    );

    const vendorInfo = {
      success: true,
      name: vendor.name,
      information: vendor.information,
      category: vendor.category,
      items: items.map((item) => ({
        name: item.name,
        _id: item.id,
        price: item.price,
        image_url: item.image_url,
        description: item.description,
      })),
    };

    res.json(vendorInfo);
  } catch (error) {
    console.error("Error fetching vendor information:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const product = await Item.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const vendor = await Shop.findById(product.vendor_id);

    const productInfo = {
      success: true,
      _id: product._id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      description: product.description,
      vendor_id: product.vendor_id,
      vendor_name: vendor ? vendor.name : "Unknown Vendor",
      // Add any additional fields you want to include
      category: product.category,
      stock: product.stock,
      created_at: product.created_at,
    };

    res.json(productInfo);
  } catch (error) {
    console.error("Error fetching product information:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const vendor = await Shop.findOne({ username: username });

    if (vendor && vendor.password === password) {
      console.log("Password verified");
      res.json({
        success: true,
        vendorId: vendor._id,
      });
    } else {
      console.log("Wrong password");
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add-item", async (req, res) => {
  try {
    const { name, price, image_url, description, vendorId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).send("Invalid vendor ID");
    }

    const vendor = await Shop.findById(vendorId);
    if (!vendor) {
      return res.status(404).send("Vendor not found");
    }

    const item = new Item({
      name,
      price,
      image_url,
      description,
      vendor_id: vendorId,
    });

    await item.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/featured", async (req, res) => {
  try {
    const items = await Item.aggregate([{ $sample: { size: 9 } }]);

    const formattedItems = items.map((item) => ({
      image: item.image_url,
      title: item.price,
      description: item.description,
    }));

    res.json(formattedItems);
  } catch (error) {
    console.error("Error fetching featured items:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
