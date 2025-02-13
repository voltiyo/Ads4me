import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./index.css";

import Home from "./Home.jsx";
import Marketplace from "./Marketplace.jsx";
import ProductPage from "./showProduct.jsx";
import LoginPage from "./Login.jsx";
import RegisterPage from "./Register.jsx";
import Logout from "./logout.jsx";
import CreateAd from "./CreateAd.jsx";
import MyAds from "./MyAds.jsx";
import EditProduct from "./EditProduct.jsx";
import CategoryPage from "./CategoryPage.jsx";
import ProfessionalPlanPage from "./ProfessionalPlan.jsx";
import Search from "./search.jsx";
import Conversations from "./Conversations.jsx";
import Messages from "./Messages.jsx";
import AdminPage from "./admin.jsx";
import NewConversation from "./newConversation.jsx";
import AdminLogin from "./AdminLogin.jsx";
import CheckoutPage from "./CheckoutPage.jsx"; // Create this page
import Promote from "./promote.jsx";
import Promoted from "../PromotedPage.jsx";

// Load Stripe with your public key
const stripePromise = loadStripe("pk_test_51Qj3gkE8xlkwurfqGmuMK6w2aiYRKpnxwDK3HFR6v8Jd62QHcg5BLtzWjRrB1iF5972L13j2LyAXELYUVPnO65rs00lWTxnwwa");

createRoot(document.getElementById("root")).render(
  <Router>
    <Elements stripe={stripePromise}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:country" element={<Marketplace />} />
        <Route path="/:country/product/:productId" element={<ProductPage />} />
        <Route path="/:country/login" element={<LoginPage />} />
        <Route path="/:country/logout" element={<Logout />} />
        <Route path="/:country/register" element={<RegisterPage />} />
        <Route path="/:country/create-ad" element={<CreateAd />} />
        <Route path="/:country/my-ads" element={<MyAds />} />
        <Route path="/:country/edit/:productId" element={<EditProduct />} />
        <Route path="/:country/category/:Category" element={<CategoryPage />} />
        <Route path="/:country/professional-plan" element={<ProfessionalPlanPage />} />
        <Route path="/:country/search/:searchTerm" element={<Search />} />
        <Route path="/:country/messages" element={<Conversations />} />
        <Route path="/:country/messages/:convId" element={<Messages />} />
        <Route path="/admin/:page" element={<AdminPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/:country/new-conversation/:user_id" element={<NewConversation />} />
        <Route path="/checkout/:product_id/:plan_id" element={<CheckoutPage />} />
        <Route path="/promote/:product_id" element={<Promote />} />
        <Route path="/promoted/:product_id" element={<Promoted />} />
      </Routes>
    </Elements>
  </Router>
);
