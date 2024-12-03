import express from "express";
import bodyParser from "body-parser";
import usersRoutes from "./routes/users.js";
import categoryRoutes from "./routes/categories.js";
import ProductRoutes from "./routes/products.js";
import OrderRoutes from "./routes/orders.js";
import OrderDetails from "./routes/orderDetails.js";
import PaymentRoutes from "./routes/payment.js";
import DeliveryRoutes from "./routes/delivery.js";
import ServiceRoutes from "./routes/services.js";
import FeedbacksRoutes from "./routes/feedbacks.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", ProductRoutes);
app.use("/orders", OrderRoutes);
app.use("/orderdetails", OrderDetails);
app.use("/payments", PaymentRoutes);
app.use("/delivery", DeliveryRoutes);
app.use("/services", ServiceRoutes);
app.use("/feedbacks", FeedbacksRoutes);

// server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
