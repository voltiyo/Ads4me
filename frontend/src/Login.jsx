import { useParams } from "react-router-dom"
import NavBar from "./components/navbar";
import Cookies from "js-cookie";
import { useState } from "react";


export default function LoginPage(){
    const [errorMessage, setErrorMessage] = useState("")
    const { country } = useParams();
    document.title = "Ads4me - Login"
    async function HandleLogin(country){
        setErrorMessage("")
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email, 
              password: password,
            }),
        });
        let data = await response.json();
        if (data.success === true){
            Cookies.set("loginData", JSON.stringify({user_id:data.user_id}), { expires: 3 });
            window.location.href = "/" + country;
        } else {
            setErrorMessage(data.message)
        }
    }
    return (
        <div className="h-dvh overflow-y-hidden ">
            <NavBar country={country}/>    
            <div className="w-full h-full flex justify-center items-center">
                
                <div className="flex flex-col bg-white rounded-lg -translate-y-14 w-[450px] h-[400px] justify-center items-center">
                    <h1 className="text-4xl py-4 font-bold">Login</h1>
                    <p className="text-red-700">{errorMessage}</p>
                    <div className="w-[80%] my-4">
                        <div className="flex flex-col gap-2 mb-4">
                            <input name="email" id="email" type="email" className="border-2 focus-within:border-green-600 transition-all duration-300 outline-0 p-2 rounded-lg text-xl" placeholder="Enter Email ..."/>
                            <input name="password" id="password" type="password" className="border-2 focus-within:border-green-600 transition-all duration-300 outline-0 p-2 rounded-lg text-xl" placeholder="Enter Password ..."/>
                        </div>
                        <div className="w-full flex flex-col items-center justify-center">
                            <button type="submit" onClick={() => {HandleLogin(country)}} className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 text-white font-bold p-2 text-xl cursor-pointer border border-gray-700 rounded-lg">Login</button>
                        </div>
                        <div>
                            <p className="text-right text-sm my-2">don't have an account? <a className="underline hover:text-green-700 transition-all duration-300" href={`/${country}/register`}>Register</a></p>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        
    )
}