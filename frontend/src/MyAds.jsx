import NavBar from "./components/navbar"
import { useParams } from "react-router-dom"
import cookies from "js-cookie"
import { useEffect, useState } from "react";
import { formatDistanceToNow }   from "date-fns"

function timeAgo(createdDate) {
    const result =  `${formatDistanceToNow(new Date(createdDate), { addSuffix: false })} ago`;
    return result.replace(/^about /, '');
}   

async function deleteAd(product_id){
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/deleteAdByProductId/${product_id}`)
    const data = await response.json();
    if (data.success){
        window.location.reload();
    } 
}


function Product(data){
    const { country } = useParams();
    let new_data = data.data
    const [image, setImage] = useState("")
    const [timeago, setTimeAgo] = useState("")
    
    useEffect(() => {
        async function getImage() {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getImages/${new_data.product_id}`)
            const imgdata = await response.json();
            
            const imgpath = imgdata[0].path

            setImage(imgpath)
            
        }
        getImage();
    }, [new_data]);
    
    useEffect(() => {
        const timespent = timeAgo(new_data.updated_at)
        setTimeAgo(timespent)
    },[])
    return (
        
            <div className="relative rounded-lg overflow-hidden flex flex-row items-center max-w-[800px] h-48 border border-gray-500">
                <div className="overflow-hidden flex items-center justify-center w-[80%]">
                    <img src={`${import.meta.env.VITE_BACKEND_URL}/${image}`} alt={new_data.name} className="w-full  hover:scale-105 transition-all duration-300" />
                </div>
                <div className="relative w-full p-4 h-full">
                    <p className="font-semibold text-white">{new_data.price} USD</p>
                    <h4 className="text-xl font-bold line-clamp-1 text-white w-80">{new_data.name}</h4>
                    <p className="line-clamp-2 text-md leading-tight font-medium text-white w-80">{new_data.description}</p>
                    <div className="absolute pb-4 bottom-0 text-white">
                        <p className="relative  text-sm/8 text-white">{new_data.location}</p>
                        <p className="text-sm/0 text-white">{timeago}</p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 flex flex-col mx-4 gap-2 h-full justify-center items-center">
                    <button className="bg-green-600 rounded-lg w-22 h-8 font-semibold cursor-pointer text-white" onClick={() => { window.location.href = `/${country}/product/${new_data.product_id}` }}>Preview</button>
                    <button className="bg-blue-600 rounded-lg w-22 h-8 font-semibold cursor-pointer text-white" onClick={() => { window.location.href = `/${country}/edit/${new_data.product_id}` }}>Edit</button>
                    <button className="bg-red-600 rounded-lg w-22 h-8 font-semibold cursor-pointer text-white" onClick={() => { deleteAd(new_data.product_id)}}>Delete</button>
                </div>
            </div>
    )
}

export default function MyAds(){

    document.title = "Ads4me - My ads"
    const { country } = useParams();
    const [ads,setAds] = useState(null);

    const loginData = cookies.get("loginData");
    let userId = undefined
    if (loginData){
        const parsedLoginData = JSON.parse(loginData);
        userId = parsedLoginData.user_id;
    } else {
        window.location.href = `/${country}/login`
    }


    useEffect(()=>{
        async function fetchMyProducts(){
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getAdsByUserId/${userId}`)

            let data = await response.json();
            setAds(data)

        }
        fetchMyProducts();
    },[])


    return(
        <div>
            <NavBar country={country}/>
            <div className="mt-8">
                <h1 className="text-4xl text-center font-bold text-white">My Ads</h1>
                <div className="flex items-center justify-center flex-col my-8 gap-4">
                    {ads && ads.length > 0 ? (
                        ads.map((ad, index) => {
                            
                            return(
                                <div key={index}>
                                    <Product data={ad} country={country} />
                                </div>
                                
                            )
                        })
                    ) 
                    :
                    (
                        <div className="w-full flex flex-col justify-center items-center">
                            <p className="text-3xl text-white">
                                You don't have any Ad
                            </p>
                            <a href={`/${country}/create-ad`} className="text-2xl underline text-center w-full text-white">Create a new Ad</a>
                        </div>
                    )
                    }
                </div>
            </div>
        </div>
    )
}