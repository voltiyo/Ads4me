import { useEffect, useState } from "react";
import NavBar from "./components/navbar"
import { useParams } from "react-router-dom"
import Select from "react-select"
import cookies from "js-cookie"


async function SaveAd(data,country,prodId){
    const categoryId = data.category.value;
    const adTitle = data.title;
    const adDescription = data.description;
    const adPrice = data.price;
    const adQuantity = data.quantity;
    const adLocation = data.location;
    const images = data.images;
    if (adTitle && adDescription && adPrice && categoryId && adQuantity && adLocation && images.length > 0){
        const formData = new FormData();
        formData.append("name", adTitle);
        formData.append("product_id", prodId);
        formData.append("description", adDescription);
        formData.append("price", adPrice);
        formData.append("category_id", categoryId);
        formData.append("quantity", adQuantity);
        formData.append("location", adLocation);
        images.forEach(image => {
            formData.append("images", image);
        });

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/EditAd`, {
            method: 'POST',
            body: formData,
        })
        let data = await response.json();
        if (data.success === true){
            window.location.href = `/${country}/product/${prodId}`
        }
    } else {
        console.log("missing element !")
    }
}



export default function EditProduct(){
    const {country, productId} = useParams();
    const [ad, setAd] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price,setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState("");
    const [categoryid, setCategoryid] = useState("");
    const [userid, setUserid] = useState("");
    const [image, setImage] = useState("");
    const [previews, setPreviews] = useState("");
    document.title = "Ads4me - Edit Ad"
    let user_id = undefined;
    const cookie = cookies.get("loginData");
    if (cookie){
        let data = JSON.parse(cookie);
        user_id = data.user_id;
    } else {
        window.location.href = `/${country}`
    }
    

    useEffect(() => {
        async function getData(){
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getProduct/` + productId);
            const data = await response.json();
            setAd(data);
            setTitle(data.name)
            setDescription(data.description)
            setPrice(data.price)
            setQuantity(data.quantity)
            setLocation(data.location)
            setCategoryid(data.category_id)
            setUserid(data.user_id)
        }
        getData();
    },[])
    useEffect(()=>{
        if (userid !== "" && user_id !== ""){
            if (userid !== user_id){
                window.location.href = `/${country}`
            }
        }
    },[userid])
    useEffect(() => {
        async function getCategory(){
            if (categoryid){
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getCategories/`);
                const data = await response.json();
                let values = []
                data.map(category => {
                    values.push({ value: category.category_id, label: category.name})
                })
                setCategories(values);
                let selectedcategory = data.find(category => category.category_id === categoryid)
                setCategory({value: selectedcategory.category_id, label: selectedcategory.name,})
            }
        }
        getCategory();
    },[categoryid])

    useEffect(() => {
        async function getImage() {
            if (productId) {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getImages/` + productId);
                const data = await response.json();
    
                const files = [];
                for (const [index, img] of data.entries()) {
                    const secondResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${img.path}`);
                    const blob = await secondResponse.blob();
                    const file = new File([blob], `${index}.jpg`);
                    files.push(file);
                }
                const newPreviews = files.map(file => URL.createObjectURL(file));
                setPreviews(prevs => [...prevs, ...newPreviews]);
                setImage(imgs => [...imgs, ...files])
            }
        }
        getImage();
    }, [productId]);
    
    function AddImage(e){
        const files = [...e.target.files];

        if (files.length + image.length > 4){
            alert("You can only add 4 images")
            return;
        }

        for (const [_,file] of files.entries()) {
            setImage(imgs => [...imgs, file])
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prevs => [...prevs, ...newPreviews])
        }
    }
    function HandleRemoveImage(index){
        setImage((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
        console.log(image)
    }
    
    return(
        <div>
            <NavBar country={country} />
            <div className="w-full  relative flex justify-center">
                <div className="bg-gray-600 w-[70%] my-20 absolute h-fit rounded-xl">
                    <h1 className="text-4xl text-center font-bold text-white my-8">Edit Ad</h1>
                    <div className="flex flex-col gap-2 justify-center items-center">
                        <div className=" overflow-hidden mb-8 rounded-lg flex items-center  justify-center gap-2">
                            {
                                Array.isArray(previews) ? previews.map((img, index) => {
                                    return (
                                        <div key={index} className="relative group">
                                            <img src={`${img}`} alt={`Preview ${index}`} className="w-24 h-24 object-cover rounded-md border" />
                                            <div className="absolute rounded-lg inset-0 flex items-center justify-center opacity-0 bg-white/40 cursor-pointer  group-hover:opacity-100 transition-opacity">
                                                <img src="/trash.png" alt="Delete" className="w-6 h-6"  onClick={(e) => {HandleRemoveImage(index)}} />
                                            </div>
                                            
                                        </div>
                                    )
                                })
                                : ""
                            }
                            <div>
                                <label htmlFor="file">
                                    <img src="/more.png" alt="Add new image" className="size-16 cursor-pointer" />
                                </label>
                                <input type="file" id="file" className="cursor-pointer hidden" onChange={(e) => {AddImage(e)}}  multiple required/>
                            </div>
                        </div>
                        <table className="w-[70%]">
                            <tbody>
                                <tr>
                                    <td className="w-1/8"><p className="text-nowrap text-white font-semibold text-xl">Title :</p></td>
                                    <td className="w-3/4"><input type="text" placeholder="Title" value={title} onChange={(e) => {setTitle(e.target.value)}} className="border-b-2 w-full outline-0 focus-within:border-green-600 transition-all duration-300 px-4 py-1 text-white text-xl" /></td>
                                </tr>
                                <tr>
                                    <td className="w-1/8"><p className="text-nowrap  text-white font-semibold text-xl">Description :</p></td>
                                    <td className="w-3/4"><textarea type="text" placeholder="Title" value={description} onChange={(e) => {setDescription(e.target.value)}} className=" my-4 resize-none border-2 rounded-lg w-full outline-0 focus-within:border-green-600 transition-all duration-300 px-4 h-24 py-1 text-white text-xl" /></td>
                                </tr>
                                <tr>
                                    <td className="w-1/8"><p className="text-nowrap text-white font-semibold text-xl">Category :</p></td>
                                    <td className="w-3/4">
                                    <Select
                                        options={categories}
                                        onChange={(selectedOption) => {setCategory(selectedOption)}}
                                        value={category}
                                    />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="w-1/4"><p className="text-nowrap text-white font-semibold text-xl">Price :</p></td>
                                    <td className="w-1/4"><input type="text" placeholder="Title" value={price} onChange={(e) => {setPrice(e.target.value)}} className="border-b-2 w-2/8 outline-0 focus-within:border-green-600 transition-all duration-300 px-4 py-1 text-white text-xl" /></td>
                                </tr>
                                <tr>
                                    <td className="w-1/4"><p className="text-nowrap text-white font-semibold text-xl">Quantity :</p></td>
                                    <td className="w-1/4"><input type="text" placeholder="Title" value={quantity} onChange={(e) => {setQuantity(e.target.value)}} className="border-b-2 w-2/8 outline-0 focus-within:border-green-600 transition-all duration-300 px-4 py-1 text-white text-xl" /></td>
                                </tr>
                                <tr>
                                    <td className="w-1/4"><p className="text-nowrap text-white font-semibold text-xl">Location :</p></td>
                                    <td className="w-1/4"><input type="text" placeholder="Title" value={location} onChange={(e) => {setLocation(e.target.value)}} className="border-b-2 w-2/8 outline-0 focus-within:border-green-600 transition-all duration-300 px-4 py-1 text-white text-xl" /></td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="w-full flex items-center my-8 justify-center">
                            <button className="bg-green-600 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 cursor-pointer font-bold text-white w-1/4" onClick={() => {SaveAd({images: image, title: title, description: description, category: category, price: price, quantity: quantity, location: location}, country, productId)}}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}