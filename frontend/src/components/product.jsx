import { useEffect, useState } from "react";
import {formatDistanceToNow} from "date-fns"

function timeAgo(createdDate) {
    const result =  `${formatDistanceToNow(new Date(createdDate), { addSuffix: false })} ago`;
    return result.replace(/^about /, '');
}   

export default  function Product(data, key){
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
        <a href={`${window.location.pathname}/product/${new_data.product_id}`} key={key}>
            <div className="rounded-lg overflow-hidden flex flex-col items-center w-76 h-96 border border-gray-500">
                <div className="overflow-hidden flex items-center justify-center h-96">
                    <img src={`${import.meta.env.VITE_BACKEND_URL}/` + image} className="min-h-full object-cover hover:scale-105 transition-all duration-300" />
                </div>
                <div className="relative w-full p-4 h-full">
                    <p className="font-semibold text-white">{new_data.price} USD</p>
                    <h4 className="text-xl font-bold line-clamp-1 text-white">{new_data.name}</h4>
                    <p className="line-clamp-2 text-md leading-tight font-medium  text-white">{new_data.description}</p>
                    <div className="absolute pb-4 bottom-0 text-white">
                        <p className="relative  text-sm/8 text-white">{new_data.location}</p>
                        <p className="text-sm/0 text-white">{timeago}</p>
                    </div>
                </div>
            </div>
        </a>
    )
}