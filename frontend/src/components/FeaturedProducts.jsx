import { useEffect, useState } from "react"
import Product from "./product"
import { useParams } from "react-router-dom"

export default function FeaturedProducts(){
    const [categories, setCategories] = useState([])
    const { country } = useParams();
    useEffect( () => {
        async function fetchCategories(){
            let data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getCategories`)
            data = await data.json()
            setCategories(data)
        }
        fetchCategories();    
    }, [])
    return (
        <div className="mx-15">
            {
                categories.map((category,index) => {
                    if (category.products.length === 0) return null;
                    const shuffledProducts = category.products.sort(() => Math.random() - 0.5);
                    return(
                        
                        <div  key={index} className="py-8">
                            <h2 className="text-3xl p-4 headline text-white underline font-bold cursor-pointer" onClick={() => { window.location.href = `/${country}/category/${category.name}`}} >{category.name}</h2>
                            <div className="flex items-center justify-around">
                                {
                                    shuffledProducts.slice(0, 4).map((product, index) => {
                                        return(
                                            <Product key={index} data={product}/>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}