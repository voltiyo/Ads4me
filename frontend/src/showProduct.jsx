import { useEffect, useState } from 'react';
import NavBar from './components/navbar'
import { useParams } from 'react-router-dom';
import {formatDistanceToNow} from "date-fns"
import { Swiper, SwiperSlide } from "swiper/react";
import {  Navigation,Pagination } from 'swiper/modules';
import cookies from "js-cookie"

function timeAgo(createdDate) {
    if (createdDate !== undefined){
        const result =  `${formatDistanceToNow(new Date(createdDate))} ago`;
        return result.replace(/^about /, '');
    }
}   


function HandleShowPhoneNumber(number,country) {
    const logindata = cookies.get("loginData");
    if (logindata) {
        alert(number)
    } else {
        window.location.href = `/${country}/login`
    }
}

export default function ProductPage(){
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
    const { productId, country } = useParams();
    const [product, setProduct] = useState("")
    const [productImage, setProductImage] = useState("")
    const [timeago, setTimeAgo] = useState("")
    const [owner, setOwner] = useState("")
    const [membersince, setmembersince] = useState("")

    useEffect(() => {
        async function FetchProduct(){
            let data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getProduct/` + productId);
            data = await data.json();
            setProduct(data);
        }
        if (productId !== undefined){
            FetchProduct();
        }
    },[])
    useEffect(() => {
        async function FetchImage(){
            let data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getImages/` + productId);
            data = await data.json();
            data.forEach(image => {
                setProductImage((img) => [...img,{src: image.path, url: ""}])
            });
        }
        if (productId !== undefined){
            FetchImage();
        }
    },[])
    useEffect(() => {
        const timespent = timeAgo(product.updated_at)
        setTimeAgo(timespent)
    },[])
    useEffect(() => {
        async function Fetchowner(){
            let data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getOwner/` + product.user_id);
            data = await data.json();
            setOwner(data);
        }
        if (product.user_id !== undefined){
            Fetchowner();
        }
    },[product])
    useEffect(() => {
        if (owner.created_at !== undefined) {
            const createdDate = new Date(owner.created_at)
            const result = months[createdDate.getUTCMonth()] + " " + createdDate.getUTCFullYear()
            setmembersince(result)
        }
    },[owner])

    document.title = "Ads4me - " + product.name
    if (product.active === false) {
        window.location.href = `/${country}/`
    }
    return (
        <div className='w-full '>
            <NavBar country={country}/>
            <div className='flex justify-around my-8' >
                <div className='w-[60%] '>
                    <div className='border rounded-lg bg-white/20 border-white p-4'>
                        <div className='border-b pb-2  w-full h-[550px] flex justify-center'>
                            <Swiper 
                                modules={[Navigation, Pagination]}
                                spaceBetween={10}
                                slidesPerView={1}
                                navigation
                                loop={true}>
                                    { productImage ? 
                                        productImage.map((image,index) => {
                                            return(
                                                <SwiperSlide key={index} className=''> 
                                                    <div className='flex items-center justify-center h-full'>
                                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/${image.src}`} className="h-[90%] rounded-lg" />
                                                    </div>
                                                </SwiperSlide>
                                            )
                                        })
                                        : ""
                                    }
                            </Swiper>
                        </div>
                        <div className='relative w-full p-4'>
                            <p className='text-3xl font-bold m-4 text-green-600 '>{product.price}</p>
                            <p className='font-semibold text-2xl text-white mx-4 my-2'>{product.name}</p>
                            <p className='flex items-center text-white justify-start gap-1'>
                                <img alt='Location' src="/location.png" className="size-6" />
                                {product.location}
                            </p>
                            <p className='absolute bottom-0 right-0 m-4 text-white'>{timeago}</p>
                        </div>
                    </div>
                    <div className='border border-white rounded-lg mt-4 p-8 bg-white/20'>
                        <h2 className='font-bold underline text-xl mb-3 text-white'>Description</h2>
                        <p className='text-white'>{product.description}</p>
                    </div>
                </div>


                <div className='w-[35%] rounded-lg border h-fit p-4 bg-white/20 border-white'>
                    <p className='mb-4 font-bold text-xl text-white'>Listed By {owner.username}</p>
                    <div className='flex items-center'>
                        <div>
                            <img alt={owner.username} src="/user.png" className="size-16 mx-2"/>
                        </div>
                        <div>
                            <p className='font-bold text-white'>{owner.username}</p>
                            <p className='text-white'>Member Since {membersince}</p>
                        </div>
                    </div>
                    <div className='my-4 flex flex-col items-center justify-center gap-2'>
                        <button onClick={() => { HandleShowPhoneNumber(owner.phone_number,country) }} className='text-white rounded-lg flex text-xl font-bold justify-center items-center w-full bg-green-600 h-12 hover:bg-green-500 transition-all duration-300 cursor-pointer'>
                            <img alt='Phone Number' src="/call.png" className="size-8 mx-2" />
                            show phone number
                        </button>
                        <button onClick={() => { window.location.href = `/${country}/new-conversation/${owner.user_id}`}} className='text-white rounded-lg flex text-xl font-bold justify-center items-center w-full bg-transparent border-2 border-green-600 h-12 hover:bg-green-600 transition-all duration-300 cursor-pointer'>
                            <img alt='Chat' src="/bubble-chat.png" className="size-6 mx-2" />
                            Chat
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}