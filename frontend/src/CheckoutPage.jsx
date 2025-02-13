import { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {useParams} from "react-router-dom"

const CheckoutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [ad, setAd] = useState([])
  const [image, setImage] = useState([])
  const { product_id, plan_id } = useParams()
  const [plan, setPlan] = useState([])

  useEffect(() => {
    async function getPlan() {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getPlan/${plan_id}`)
      const data = await response.json();
      setPlan(data);
    }
    getPlan()
  },[])
  useEffect(() => {
    async function getAd() {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getProduct/${product_id}`)
      const data = await response.json();
      setAd(data);
    }
    getAd()
  },[])
  useEffect(() => {
    async function getImage() {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getImages/${ad.product_id}`)
        const imgdata = await response.json();
        const imgpath = imgdata[0].path
        setImage(imgpath)
    }
    getImage();
  }, [ad]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("")
    setSuccess("")

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Send paymentMethod.id to backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id, return_url: import.meta.env.VITE_FRONT_END_URL , amount: parseFloat(plan.price) * 100, ad_id: product_id, pack: plan.name, exp: plan.active_days}),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess("Payment successful!");
        setTimeout(() => {
          window.location.href = `/promoted/${product_id}`
        }, 1000);
      } else {
        setError("Payment failed!");
      }
    } catch (err) {
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-[50%] bg-white/20 h-[50%] rounded-lg">
        <h2 className="text-4xl font-bold text-white text-center my-5">Checkout</h2>
        <div className="flex items-center justify-center ">
          <div className="flex items-center justify-center w-[50%] bg-white/15 pr-4 rounded-lg mb-8 gap-4">
            <div className="p-0 flex items-center justify-center rounded-l-lg overflow-hidden">
              <img src={`${import.meta.env.VITE_BACKEND_URL}/${image}`} className="size-24 object-cover min-h-full " />
            </div>
            <div className="max-w-[70%]">
              <p className="font-bold text-white text-2xl line-clamp-1">{ad.name}</p>
              <p className="font-bold text-white/50 text-xl line-clamp-2">{ad.description}</p>
            </div>
          </div>
          </div>
        <form onSubmit={handleSubmit} className="flex items-center justify-center flex-col gap-4">
          <CardElement options={{
              style: {
                base: {
                  color: "white",
                  "::placeholder": {
                    color: "white",
                  },
                  fontWeight: "700",
                },
                invalid: {
                  color: "#ff4d4d", // Red for invalid input
                },
              },
            }} className="w-[50%] border border-white rounded-lg py-4 px-4 "/>
          <button type="submit" disabled={loading || !stripe} className="bg-green-500 py-4 text-white font-bold rounded-lg hover:bg-green-600 transition-all duration-500 cursor-pointer w-[50%]">
            {loading ? "Processing..." : "Pay"}
          </button>
        </form>
        {error && <p className="text-red-600 font-bold text-xl text-center">{error}</p>}
        {success && <p className="text-green-600 font-bold text-xl text-center">{success}</p>}
      </div>
    </div>
  );
};

export default CheckoutPage;
