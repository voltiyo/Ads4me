import { useParams } from "react-router-dom"
import NavBar from "./components/navbar";
import { useEffect, useState } from "react";
import Product from "./components/product";

export default function CategoryPage(){
    const { country, Category } = useParams();
    const [category, setCategory] = useState("");

    useEffect(() => {
        async function GetCateg(){
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getCategories`);
            const data = await response.json();
            const categ = data.filter(categ => categ.name === Category)[0]
            setCategory(categ)
        }
        if (Category !== undefined){
            GetCateg();
        }
    },[Category])


    document.title = "Ads4me - " + categ.name

    return(
        <div>
            <NavBar country={country} />
            <div className="flex items-center justify-center flex-col">
                <h1 className="text-[3rem] p-4 headline text-white underline font-bold text-center">{category.name}</h1>
                <div className="flex items-center justify-around flex-wrap gap-y-12">
                {
                    category.products ? 
                    category.products.map((product, index) => {
                        return (
                            <div className="w-[22%]" key={index}>
                                <Product data={product} key={index}/>
                            </div>
                        )
                    })
                    : 
                    ""
                }
                </div>
            </div>
        </div>
    )
}