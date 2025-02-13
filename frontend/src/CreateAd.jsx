import { useParams } from "react-router-dom"
import NavBar from "./components/navbar";
import cookies from "js-cookie"
import { useEffect, useState } from "react";
import Select from 'react-select';

async function HandleCreateAd(country, dropdownvalue, images, userId) {
    const categoryId = dropdownvalue;
    const adTitle = document.querySelector("#title")
    const adDescription = document.querySelector("#description")
    const adPrice = document.querySelector("#price")
    const adQuantity = document.querySelector("#quantity")
    const adLocation = document.querySelector("#location")
    if (userId && adTitle.value && adDescription.value && adPrice.value && categoryId.value && adQuantity.value && adLocation.value && images.length > 0){
        const formData = new FormData();
        formData.append("user_Id", userId);
        formData.append("name", adTitle.value);
        formData.append("description", adDescription.value);
        formData.append("price", adPrice.value);
        formData.append("category_id", categoryId.value);
        formData.append("quantity", adQuantity.value);
        formData.append("location", adLocation.value);
        images.forEach(image => {
            formData.append("images", image);
        });

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/saveProduct`, {
            method: 'POST',
            body: formData,
        })
        console.log("sent !")
        let data = await response.json();
        if (data.success === true){
            window.location.href = `/${country}/my-ads/`
        }
    } else {
        document.querySelector(".error").textContent = "missing fields (make sure you upload an image)"
    }
}



export default function CreateAd(){
    const [images, setImages] = useState("");
    const [previews, setPreviews] = useState([]);
    const {country} = useParams();
    const [selectedValue, setSelectedValue] = useState(null);
    const [categories, setCategories] = useState(null)
    const options = [];
    
    const loginData = cookies.get("loginData");
    let userId = undefined
    if (loginData){
        const parsedLoginData = JSON.parse(loginData);
        userId = parsedLoginData.user_id;
    } else {
        window.location.href = `/${country}/login`
    }


    function HandleImageChange(e){
        const files = Array.from(e.target.files);

        if (files.length + images.length > 4) {
            alert("You can only upload up to 4 images.");
            console.log(files)
            return;
        }
        setImages((prev) => [...prev, ...files]);
        setPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
    }

    document.title = "Ads4me - Create New Ad"
    function HandleRemoveImage(index){
        setImages((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    }


    useEffect(() => {
        async function getcate(){
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getCategories`);
            let data = await response.json();
            setCategories(data)
        }
        getcate();
    },[])
    useEffect(()=>{
        if (categories){
            categories.forEach(category => {
                options.push({ label: category.name, value: category.category_id })
            });
        }
    },[options])
    return (
        <div className="h-dvh ">
            <NavBar country={country}/>    
            <div className="w-full h-[140vh] items-center flex justify-center">
                    <div className="flex flex-col bg-white rounded-lg -translate-y-14 w-[650px] h-[650px] justify-center items-center">
                        <h1 className="text-4xl py-4 font-bold">Create An Ad</h1>
                        <p className="error text-red-700"></p>
                        <div className="w-[70%] my-4">
                            <div className="flex flex-col gap-2 mb-4">
                                <div className="flex items-center justify-center gap-2">
                                    {previews.length > 0 ?  previews.map((preview, index) => (
                                    <div>
                                        <div className="relative group">
                                            <img key={index} src={preview} alt={`Preview ${index}`} className="w-24 h-24 object-cover rounded-md border" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-white/40 cursor-pointer  group-hover:opacity-100 transition-opacity">
                                                <img src="/trash.png" alt="Delete" className="w-6 h-6"  onClick={(e) => {HandleRemoveImage(index)}} />
                                            </div>

                                        </div>
                                    </div>
                                    )) :
                                    ""
                                    }
                                        <div>
                                            <input type="file" id="image" placeholder="hey" onChange={(e) => {HandleImageChange(e)}} className="hidden border w-52 px-2 rounded-md cursor-pointer" accept="image/*" multiple required/>
                                            <label htmlFor="image" className="cursor-pointer">    
                                                <img src="/Camera.png" alt="Add new Image" className="w-24 h-24 object-cover rounded-md border" />
                                            </label>
                                        </div>
                                </div>
                                
                                <input type="text" id="title" className="border-2 focus-within:border-green-600 transition-all duration-300 outline-0 p-2 rounded-lg text-xl" placeholder="Ad Title" required/>
                                <textarea  type="text" id="description" className=" resize-none h-24 border-2 focus-within:border-green-600 transition-all duration-300 outline-0 p-2 rounded-lg text-xl" placeholder="Ad Description" required/>
                                <div className="flex w-full gap-[4%]">
                                    <input type="text" id="price" className=" w-[48%] border-2 focus-within:border-green-600 transition-all duration-300 outline-0 p-2 rounded-lg text-xl" placeholder="Price in USD" required/>
                                    <input type="text" id="quantity" className="w-[48%] border-2 focus-within:border-green-600 transition-all duration-300 outline-0 p-2 rounded-lg text-xl" placeholder="Quantity" required/>
                                </div>
                                <input type="text" id="location" className="border-2 focus-within:border-green-600 transition-all duration-300 outline-0 p-2 rounded-lg text-xl" placeholder="Location" required/>
                                
                                <Select 
                                    options={options}
                                    onChange={(selectedOption) => {setSelectedValue(selectedOption)}}
                                    value={selectedValue}
                                />
                                
                            </div>
                            <div className="w-full flex flex-col items-center justify-center">
                                <button type="submit" onClick={() => {HandleCreateAd(country,selectedValue,images,userId)}} className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 text-white font-bold p-2 text-xl cursor-pointer border border-gray-700 rounded-lg">Submit</button>
                                
                            </div>
                            
                        </div>
                    </div>
            </div>
        </div>
        
    )
}