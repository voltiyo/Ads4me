import { useEffect, useState } from "react";
import Navbar from "./components/navbar"
import { useParams } from "react-router-dom"
import Product from "./components/product";

export default function Search(){
    const { country, searchTerm } = useParams();
    const [ads, setAds] = useState([])

    useEffect(()=> {
        async function getAds(){
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/search/${searchTerm.toLowerCase()}`)
            const data = await response.json();
            setAds(data)
        }
        getAds();
    },[])
    document.title = "Ads4me - " + searchTerm
    return (
        <div>
            <Navbar  country={country}/>
            <div className="flex flex-wrap w-full gap-y-8 items-center justify-around my-20">
                {
                    ads.length > 0 && (
                        ads.map((ad,index) => {
                            return (
                                <div key={index} className="w-[22%]">
                                    <Product data={ad} />
                                </div>
                            )
                        })
                    )
                }
            </div>
        </div>
    )
}