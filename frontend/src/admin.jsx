import cookies from "js-cookie"
import AdminSide from "./components/AdminSidebar";
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ListingsStatsChart = ({ ActiveListings, InactiveListings }) => {
    // Function to format date as "Feb 11"
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleString("en-US", { month: "short", day: "2-digit" });
    };
  
    // Function to process data
    const processData = () => {
      const groupedData = {};
  
      // Process Active Listings
      ActiveListings.forEach((listing) => {
        const date = formatDate(listing.created_at);
        if (!groupedData[date]) groupedData[date] = { date, activated: 0, unactivated: 0 };
        groupedData[date].activated += 1;
      });
  
      // Process Inactive Listings
      InactiveListings.forEach((listing) => {
        const date = formatDate(listing.created_at);
        if (!groupedData[date]) groupedData[date] = { date, activated: 0, unactivated: 0 };
        groupedData[date].unactivated += 1;
      });
  
      return Object.values(groupedData);
    };
  
    const data = processData();
  
    return (
      <div className="p-4 bg-white rounded-xl shadow-md">
        <h2 className="font-semibold text-lg mb-2">Listings Stats</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="activated" fill="#007bff" name="Activated" />
            <Bar dataKey="unactivated" fill="#ccc" name="Unactivated" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };


function Ad({data}) {
    const [image, setImage] = useState([])
    useEffect(() => {
        async function getImage() {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getImages/${data.product_id}`);
            const images = await response.json();
            setImage(images[0])
        }
        getImage();
    },[])
    return (
        <div className="relative flex items-center gap-4 bg-white/15 rounded-lg h-34">
            <div className="h-full w-52 rounded-l-lg overflow-hidden flex items-center justify-center">
                <img src={`${import.meta.env.VITE_BACKEND_URL}/${image.path}`} className="h-full w-full object-cover" />
            </div>
            <div className="w-[60%]">
                <p className="text-white font-semibold w-full text-xl line-clamp-1">{data.name}</p>
                <p className="text-white font-semibold w-full line-clamp-1">{data.description}</p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <div className="text-white font-semibold" title={`${data.active ? "listed in the market" : "this listing is under admin review"}`}>Status: <span className={`${data.active ? "text-green-600" : "text-red-600"}`}>{data.active ? "active" : "inactive"}</span></div>
                <button onClick={() => {Delete(data.product_id)}} className="cursor-pointer  rounded-lg px-4 py-2 text-white font-semibold bg-red-600">Delete</button>
                <button onClick={() => { if (data.active === true) Inactivate(data.product_id); else Activate(data.product_id) }} className="cursor-pointer  rounded-lg px-4 py-2 text-white font-semibold bg-blue-600">{data.active ? "Inactivate" : "Activate"}</button>
            </div>
        </div>
    )
}
  
async function Activate(Id) {
    document.querySelector(".error").textContent = ""
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/Activate/${Id}`);
    const data = await response.json()
    if (data.success){
        window.location.reload();
    } else {
        document.querySelector(".error").textContent = "Error Activating the Ad"
    }
}
async function Inactivate(Id) {
    document.querySelector(".error").textContent = ""
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/Inactivate/${Id}`);
    const data = await response.json()
    if (data.success){
        window.location.reload();
    } else {
        document.querySelector(".error").textContent = "Error Activating the Ad"
    }
}

async function Delete(Id) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/deleteAdByProductId/${Id}`);
    const data = await response.json()
    if (data.success){
        window.location.reload();
    } else {
        document.querySelector(".error").textContent = "Error deleting the Ad"
    }
}

async function DeleteUser(id) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/DeleteUser/${id}`);
    const data = await response.json()
    if (data.success){
        window.location.reload();
    } else {
        document.querySelector(".error").textContent = "Error deleting the User"
    }
}



async function SaveCategories(){
    document.querySelector(".error").textContent = ""
    const names = document.querySelectorAll(".name")
    const descriptions = document.querySelectorAll(".description")
    if (names.length > 0 && descriptions.length > 0) {
        for (let i = 0; i < names.length; i++) {
            const name = names[i].value
            const description = descriptions[i].value
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/saveCategory`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name, description: description
                })
            })
            const data = await response.json();
            if (data.success) {
                window.location.reload();
            } else {
                document.querySelector(".error").textContent = "Error Saving Categories"
            }
        }
    }
}
async function SavePlan(){
    document.querySelector(".error").textContent = ""
    const names = document.querySelectorAll(".plan-name")
    const descriptions = document.querySelectorAll(".plan-description")
    const prices = document.querySelectorAll(".plan-price")
    const AllFeatures = document.querySelectorAll(".plan-Features")
    const Expirings = document.querySelectorAll(".plan-Expiring")
    for (let i = 0; i < names.length; i++) {
        const name = names[i].value;
        const description = descriptions[i].value;
        const price = prices[i].value;
        const Features = AllFeatures[i].value;
        const Expiring = Expirings[i].value;
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/savePlan`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name, description: description, price: price, Features: Features, active_days: Expiring
            })
        })
        const data = await response.json();
        if (data.success) {
            window.location.reload();
        } else {
            document.querySelector(".error").textContent = "Error Saving Categories"
        }
    }
}
async function DeletePlan(e) {
    document.querySelector(".error").textContent = ""
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/DeletePlan/${parseInt(e.target.parentElement.parentElement.id)}`)
    const data = await response.json();
    
    if (data.success === true) {
        window.location.reload()
    } else {
        document.querySelector(".error").textContent = "Error deleting the Plan"
    }
    
}



function HandleCreatePlan() {
    const newLine = document.createElement("tr");

    const nameTd = document.createElement("td");
    const nameInput = document.createElement("input");
    nameInput.placeholder = "Plan Name";
    nameInput.classList.add("plan-name")
    nameInput.style.textAlign = "center";
    nameInput.style.width = "100%";
    nameInput.style.height = "100%";
    nameInput.style.outline = "none";
    nameTd.appendChild(nameInput);
    
    const descTd = document.createElement("td");
    const descInput = document.createElement("input");
    descInput.classList.add("plan-description")
    descInput.placeholder = "Plan Description";
    descInput.style.textAlign = "center";
    descInput.style.width = "100%";
    descInput.style.height = "100%";
    descInput.style.outline = "none";
    descTd.appendChild(descInput);

    const deleteTd = document.createElement("td");
    deleteTd.className = "cursor-pointer flex items-center justify-center";
    const trashIcon = document.createElement("img");
    trashIcon.src = "/trash.png";
    trashIcon.className = "size-8";
    deleteTd.appendChild(trashIcon);

    const PriceTd = document.createElement("td");
    const PriceInput = document.createElement("input");
    PriceInput.classList.add("plan-price")
    PriceInput.placeholder = "Plan price";
    PriceInput.style.textAlign = "center";
    PriceInput.style.width = "100%";
    PriceInput.style.height = "100%";
    PriceInput.style.outline = "none";
    PriceTd.appendChild(PriceInput);
    
    const FeaturesTd = document.createElement("td");
    const FeaturesInput = document.createElement("input");
    FeaturesInput.classList.add("plan-Features")
    FeaturesInput.placeholder = "Plan Features";
    FeaturesInput.style.textAlign = "center";
    FeaturesInput.style.width = "100%";
    FeaturesInput.style.height = "100%";
    FeaturesInput.style.outline = "none";
    FeaturesTd.appendChild(FeaturesInput);

    const ExpiringTd = document.createElement("td");
    const ExpiringInput = document.createElement("input");
    ExpiringInput.placeholder = "Active Days"
    ExpiringInput.classList.add("plan-Expiring")
    ExpiringInput.style.textAlign = "center";
    ExpiringInput.style.width = "100%";
    ExpiringInput.style.height = "100%";
    ExpiringInput.style.outline = "none";
    ExpiringTd.appendChild(ExpiringInput);

    deleteTd.onclick = () => newLine.remove();

    newLine.appendChild(nameTd);
    newLine.appendChild(descTd);
    newLine.appendChild(PriceTd);
    newLine.appendChild(FeaturesTd);
    newLine.appendChild(ExpiringTd);
    newLine.appendChild(deleteTd);

    document.querySelector(".plans")?.appendChild(newLine);
}


export default function AdminPage() {
    const { page } = useParams()
    const [ads, setAds] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [plans, setPlans] = useState([]);
    const [promos, setPromos] = useState([]);

    document.title = "Ads4me - admin"

    const loginData = cookies.get("AdminLogin");
    if (!loginData) {
        window.location.href = `/admin/login`
    }
    
    function HandleCreateCategory() {
        const newLine = document.createElement("tr");
    
        const nameTd = document.createElement("td");
        const nameInput = document.createElement("input");
        nameInput.placeholder = "Category Name";
        nameInput.classList.add("name")
        nameInput.style.textAlign = "center";
        nameInput.style.width = "100%";
        nameInput.style.height = "100%";
        nameInput.style.outline = "none";
        nameTd.appendChild(nameInput);
        
        const descTd = document.createElement("td");
        const descInput = document.createElement("input");
        descInput.classList.add("description")
        descInput.placeholder = "Category Description";
        descInput.style.textAlign = "center";
        descInput.style.width = "100%";
        descInput.style.height = "100%";
        descInput.style.outline = "none";
        descTd.appendChild(descInput);
    
        const deleteTd = document.createElement("td");
        deleteTd.className = "cursor-pointer flex items-center justify-center";
        const trashIcon = document.createElement("img");
        trashIcon.src = "/trash.png";
        trashIcon.className = "size-8";
        deleteTd.appendChild(trashIcon);
    
        deleteTd.onclick = () => newLine.remove();
    
        newLine.appendChild(nameTd);
        newLine.appendChild(descTd);
        newLine.appendChild(deleteTd);
    
        document.querySelector(".categs")?.appendChild(newLine);
    }
    
    
    async function DeleteRow(e) {
        document.querySelector(".error").textContent = ""
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/DeleteCategory/${parseInt(e.target.parentElement.parentElement.id)}`)
        const data = await response.json();
        
        if (data.success === true) {
            window.location.reload()
        } else {
            document.querySelector(".error").textContent = "Error deleting the Category"
        }
    }

    useEffect(() => {
        async function GetAds() {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/Ads`);
            const data = await response.json();
            setAds(data)
        }
        GetAds();
    },[]);

    useEffect(() => {
        async function GetUsers() {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/AllUsers`);
            const data = await response.json();
            setUsers(data)
        }
        GetUsers();
    }, [])
    useEffect(() => {
        async function GetPlans() {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getPlans`);
            const data = await response.json();
            setPlans(data)
        }
        GetPlans();
    }, [])


    useEffect(() => {
        async function getCategs() {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getCategories`);
            const data = await response.json();
            setCategories(data)
        }
        getCategs();
    }, [])
    
    useEffect(() => {
        async function getPromos() {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getPromos`);
            const data = await response.json();
            setPromos(data)
        }
        getPromos();
    }, [])


    const ActiveListings = ads.filter(ad => ad.active === true)
    const InactiveListings = ads.filter(ad => ad.active === false)
    return (
        <div className="h-screen flex overflow-hidden">
            <AdminSide  page={page}/>
            <div className="flex flex-col mx-30 gap-4 my-10 h-[90%] w-[80%] overflow-y-scroll">
                <p className="error text-red-700"></p>
                {
                    page === "Dashboard" && (
                        <div className="">
                            <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>
                            <div className="mb-15 flex items-center justify-around">
                                <div className="text-xl text-white font-semibold flex items-center rounded-lg justify-between bg-yellow-500 w-[30%] px-12 py-8">
                                    <div>
                                        <p className="text-4xl">{InactiveListings.length}</p>
                                        <p className="text-nowrap">Inactive Listings</p>
                                    </div>
                                    <i className="fa-solid fa-pen-to-square text-4xl"></i>
                                </div>
                                <div className="text-xl text-white font-semibold flex items-center rounded-lg justify-between bg-green-600 w-[30%] px-12 py-8">
                                    <div>
                                        <p className="text-4xl">{ActiveListings.length}</p>
                                        <p>Active Listings</p>
                                    </div>
                                    <i className="fa-solid fa-check text-4xl"></i>
                                </div>
                                <div className="text-xl text-white font-semibold flex items-center rounded-lg justify-between bg-blue-600 w-[30%] px-12 py-8">
                                    <div>
                                        <p className="text-4xl">{users.length}</p>
                                        <p>Users</p>
                                    </div>
                                    <i className="fa-solid fa-user text-4xl"></i>
                                </div>
                            </div>
                            <ListingsStatsChart ActiveListings={ActiveListings} InactiveListings={InactiveListings}/>
                        </div>
                    )
                }
                {page === "Ads" && (ads.length > 0 ? 
                (
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-8">Ads</h1>
                        <div className="flex flex-col gap-2">
                            {ads.map((ad, index) => {
                                return (
                                    <div key={index}>
                                        <Ad data={ad} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                )
                : 
                <div className="text-2xl text-center text-white font-black">No Ad Found !</div>)
                }
                {
                    page === "Users" &&( users.length > 0 ? (
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-8">Users</h1>
                        {users.map((user,index) => {
                            return (
                                
                                <div key={index} className="relative flex items-center rounded-lg h-24 p-4 bg-white/15 justify-start gap-12 w-full">
                                    <img src="/user.png" className="w-16" />
                                    <div>
                                        <p className="font-semibold text-xl text-white">{user.username}</p>
                                        <p className="font-semibold text-sm text-white">email: {user.email}</p>
                                        <p className="font-semibold text-sm text-white">Phone number: {user.phone_number}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-white">First name: {user.first_name}</p>
                                        <p className="font-semibold text-sm text-white">Last name: {user.last_name}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-white">Created: {new Date(user.created_at).toLocaleDateString()}</p>
                                        <p className="font-semibold text-sm text-white">Address: {user.address}</p>
                                    </div>
                                    <button onClick={() => { DeleteUser(user.user_id) }} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer">Delete</button>
                                </div>
                            )
                        })} 
                    </div>

                    )
                    :
                    <div className="text-2xl text-center text-white font-black">No user Found !</div>
                    )
                }
                {
                    page === "Categories" && (
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-8">Categories</h1>
                            <div className="w-full flex flex-col items-center justify-center gap-4">
                                <table className="relative w-full text-white [&_td]:p-3 [&_th]:p-2 text-center border [&_td]:border">
                                    <thead>
                                        <tr>
                                            <th className="w-[20%]">
                                                name
                                            </th>
                                            <th className="w-[60%]">
                                                description
                                            </th>
                                            <th className="w-[10%]">
                                                Delete ?
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="categs">
                                        {
                                            categories.length > 0 && categories.map((category, index) => {
                                                return (
                                                    <tr key={index} id={category.category_id}>
                                                        <td>
                                                            {category.name}
                                                        </td>
                                                        <td>
                                                            {category.description}
                                                        </td>
                                                        <td>
                                                            <div  className="flex items-center justify-center">
                                                                <img src="/trash.png" className="size-8 cursor-pointer" onClick={(e) => DeleteRow(e)} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                <div className="flex items-center justify-center gap-2 w-[99%]">
                                    <div className="cursor-pointer font-bold flex items-center px-4 justify-center  bg-green-600 rounded-lg py-2" onClick={HandleCreateCategory}>
                                        Add New Category
                                    </div>
                                    <div onClick={SaveCategories} className="cursor-pointer font-bold flex items-center px-4 justify-center  bg-green-600 rounded-lg py-2">
                                        Save
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    page === "Plans" && 
                    (
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-8">Plans</h1>
                            <div className="w-full flex flex-col items-center justify-center gap-4">
                                <table className="relative w-full text-white [&_td]:p-3 [&_th]:p-2 text-center border [&_td]:border">
                                    <thead>
                                        <tr>
                                            <th className="w-[20%]">
                                                name
                                            </th>
                                            <th className="w-[30%]">
                                                description
                                            </th>
                                            <th className="w-[10%]">Price (USD)</th>
                                            <th className="w-[20%]">Features</th>
                                            <th className="w-[10%]">Days of promotion</th>
                                            <th className="w-[10%]">
                                                Delete ?
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="plans">
                                        {
                                            plans.length > 0 && plans.map((plan, index) => {
                                                return (
                                                    <tr key={index} id={plan.plan_id}>
                                                        <td>{plan.name}</td>
                                                        <td>{plan.description}</td>
                                                        <td>{plan.price}</td>
                                                        <td>{plan.features}</td>
                                                        <td>{plan.active_days}</td>
                                                        <td>
                                                            <div className="flex items-center justify-center">
                                                                <img src="/trash.png" className="size-8 cursor-pointer" onClick={(e) => DeletePlan(e)} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                <div  className="flex items-center justify-center gap-2 w-[99%]">
                                    <div onClick={() => {HandleCreatePlan()}} className="cursor-pointer font-bold flex items-center px-4 justify-center  bg-green-600 rounded-lg py-2">
                                        Add New Plan
                                    </div>
                                    <div onClick={() => { SavePlan() }} className="cursor-pointer font-bold flex items-center px-4 justify-center  bg-green-600 rounded-lg py-2">
                                        Save
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    page === "Promos" && (
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-8">Promotions</h1>
                            <div className="w-full flex flex-col items-center justify-center gap-4">
                                <table className="relative w-full text-white [&_td]:p-3 [&_th]:p-2 text-center border [&_td]:border">
                                    <thead>
                                        <tr>
                                            <th className="w-[20%]">
                                                ad_id
                                            </th>
                                            <th className="w-[30%]">
                                                amount
                                            </th>
                                            <th className="w-[10%]">buying date</th>
                                            <th className="w-[20%]">expiring data</th>
                                            <th className="w-[10%]">package</th>
                                            <th className="w-[10%]">
                                                Method
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="plans">
                                        {
                                            promos.length > 0 && promos.map((promo, index) => {
                                                return (
                                                    <tr key={index} id={promo.ad_id}>
                                                        <td>{promo.ad_id}</td>
                                                        <td>{promo.amount / 1000} USD</td>
                                                        <td>{new Date(promo.bought_at).toLocaleDateString()}</td>
                                                        <td>{new Date(promo.expiring_at).toLocaleDateString()}</td>
                                                        <td>{promo.package}</td>
                                                        <td>{promo.pay_method}</td>	
                                                        
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}