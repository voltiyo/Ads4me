import { useParams } from "react-router-dom"
import NavBar from "./components/navbar";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"
import cookies from "js-cookie"


async function HandleRegister(country) {
    document.querySelector(".error").textContent = ""
    const email = document.querySelector("#email").value;
    const username = document.querySelector("#username").value;
    const firstName = document.querySelector("#first_name").value;
    const lastName = document.querySelector("#last_name").value;
    const address = document.querySelector("#address").value;
    const phone_number = document.querySelector("#phone_number").value;
    const password = document.querySelector("#password").value;

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email, 
          username: username,
          first_name: firstName,
          last_name: lastName,
          address: address,
          phone_number: phone_number,
          password: password
        }),
    });

    const data = await response.json();
    if (data.success === true){
        cookies.set("loginData", JSON.stringify({user_id: data.user_id}), { expires: 3 });
        window.location.href = "/" + country;
    } else {
        document.querySelector(".error").textContent = data.message
    }
}


export default function LoginPage(){
    const {country} = useParams();
    document.title = "Ads4me - Register"
    
    return (
        <div className="h-dvh overflow-y-hidden ">
            <NavBar country={country}/>    
            <div className="w-full h-full flex justify-center items-center">
                    <div className="flex flex-col bg-white rounded-lg -translate-y-14 w-[450px] h-[600px] justify-center items-center">
                        <h1 className="text-4xl py-4 font-bold">Register</h1>
                        <p className="text-red-700 error"></p>
                        <div className="w-[80%] my-4">
                            <div className="flex flex-col gap-2 mb-4">
                                <input type="email" id="email" className="border-2 focus-within:border-green-600 transition-all duration-300 outline-0 p-2 rounded-lg text-xl" placeholder="example@example.com" required/>
                                <input type="text" id="username" className="border-2 focus-within:border-green-600 transition-all duration-300 outline-0 p-2 rounded-lg text-xl" placeholder="Username" required/>
                                <div className="flex w-full gap-[4%]">
                                    <input type="text" id="first_name" className=" w-[48%] border-2 focus-within:border-green-600 transition-all duration-300 outline-0 p-2 rounded-lg text-xl" placeholder="First name" required/>
                                    <input type="text" id="last_name" className="w-[48%] border-2 focus-within:border-green-600 transition-all duration-300 outline-0 p-2 rounded-lg text-xl" placeholder="Last name" required/>
                                </div>
                                <input type="text" id="address" className="border-2 focus-within:border-green-600 transition-all duration-300 outline-0 p-2 rounded-lg text-xl" placeholder="Address" required/>
                                <input type="text" id="phone_number" className="border-2 focus-within:border-green-600 transition-all duration-300 outline-0 p-2 rounded-lg text-xl" placeholder="+1234567890" required/>
                                <input type="password" id="password" className="border-2 focus-within:border-green-600 transition-all duration-300 outline-0 p-2 rounded-lg text-xl" placeholder="Password" required/>
                            </div>
                            <div className="w-full flex flex-col items-center justify-center">
                                <button type="submit" onClick={() => {HandleRegister(country)}} className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 text-white font-bold p-2 text-xl cursor-pointer border border-gray-700 rounded-lg">Register</button>
                                <p className="font-bold">Or</p>
                                <GoogleOAuthProvider clientId="import.meta.env.VITE_GOOGLE_CLIENT_ID">
                                    <GoogleLogin
                                        onSuccess={(response) => console.log("Login Success:", response)}
                                        onError={() => console.log("Login Failed")}
                                    />
                                </GoogleOAuthProvider>
                            </div>
                            <div>
                                <p className="text-right text-sm my-2">Already Have an Account? <a className="underline hover:text-green-700 transition-all duration-300" href={`/${country}/login`}>Login</a></p>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
        
    )
}