import { useParams } from "react-router-dom";
import NavBar from "./components/navbar";

function Feature({ feature }){
    return(
        <div className="flex items-center justify-center gap-4">
            <img src="/checked.png" alt="feature" className="size-8" />
            <p className="text-2xl font-semibold text-white">
                {feature}
            </p>
        </div>
    )
}

export default function ProfessionalPlanPage(){
    const { country } = useParams();
    document.title = "Ads4me - Professional Plan"
    return(
        <div>
            <NavBar country={country}/>
            <div className="flex items-center justify-around my-20">
                <div className="bg-green-700 w-[40%] flex items-center p-4 rounded-lg justify-center flex-col">
                    <h2 className="text-3xl font-bold text-white mb-14">Basic Plan</h2>
                    <div>
                        <Feature feature="1 sponsored ad"/>
                        <Feature feature="6 Images for Each Ad"/>
                    </div>
                </div>
                <div className="bg-green-700 w-[40%] flex items-center p-4 rounded-lg justify-center flex-col">
                    <h2 className="text-3xl font-bold text-white mb-14">Plus Plan</h2>
                    <div>
                        <Feature feature="3 sponsored ad"/>
                        <Feature feature="8 Images for Each Ad"/>
                    </div>
                </div>
            </div>
        </div>
        
    )
}