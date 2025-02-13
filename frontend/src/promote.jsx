import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Feature } from "./ProfessionalPlan"

export default function Promote() {
    const [plans, setPlans] = useState([])
    const { product_id } = useParams()
    useEffect(() => {
        async function GetPlans() {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getPlans`);
            const data = await response.json();
            setPlans(data)
        }
        GetPlans();
    }, [])
    
    return (
        <div>
            <h1 className="text-5xl text-center text-white font-bold my-10">Promote</h1>
            <div className="flex items-center justify-around flex-wrap my-20">
                {   
                    plans.length > 0 ? plans.map((plan, index) => {
                        const features = plan.features.split(",");

                        return (
                            <div className="relative bg-green-700 w-[40%] flex items-center p-4 rounded-lg justify-center flex-col">
                                <p className="absolute left-5 top-5 text-4xl font-black text-white">{plan.price} USD</p>
                                <h2 className="text-3xl font-bold text-white mt-10">{plan.name} Plan</h2>
                                <p className="text-2xl font-bold text-white mb-14">{plan.description}</p>
                                <div className="flex flex-col gap-2">
                                    {
                                        features.map((feature => {
                                            return (
                                                <Feature feature={feature} />
                                            )
                                        }))
                                    }
                                </div>
                                <div className="w-full mt-8">
                                    <button className="w-full border-2 text-white text-xl font-bold rounded-lg hover:text-green-700 hover:bg-white transition-all duration-500 hover:border-white cursor-pointer" onClick={() => { window.location.href = `/checkout/${product_id}/${plan.plan_id}` }}>Take it</button>
                                </div>
                            </div>
                        )
                    })
                    :
                    <div>
                        No Plan Found !
                    </div>
                }
            </div>
        </div>
    )
}