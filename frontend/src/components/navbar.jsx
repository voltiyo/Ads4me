import DropdownMenu from "./dropDown"
import SearchBox from 'react-search-box';
import Cookies from "js-cookie"

const handleSearch = (query, country) => {
    if (query.trim() !== "") {
        let searchTerm = query.replaceAll(" ","-")
        window.location.href = `/${country}/search/${searchTerm}`;
    }
};


export default function NavBar(country){
    let user_id = undefined
    const loginData = Cookies.get("loginData");
    
    if (loginData) {
        const parsedLoginData = JSON.parse(loginData);
        user_id = parsedLoginData.user_id
    }
    return(
        <div className="flex items-center justify-center w-full gap-14 h-16 z-50 border-b border-white">
            <div className="cursor-pointer" onClick={() => {
                window.location.href = `/${country.country}`
            }}>
                <img src="/logo.png" className="w-56"/>
            </div>
            <div className="flex gap-2 items-center justify-center w-[40%] ">
                <div 
                className="[&_*]:transition-all w-[80%]  [&_*]:focus:placeholder:text-green-700 "
                onFocus={(e) => {
                    e.target.style = "border: 1px solid oklch(0.527 0.154 150.069);"
                }}
                onBlur={(e) => {
                    e.target.style = "border: 1px solid #d1d5dc;"
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch(e.target.value,country.country);
                    }
                }}
                >
                
                    <SearchBox  
                        placeholder="Search..."
                    />
                </div>
                <DropdownMenu defaultOption={country}/>
            </div>
            <div className="flex items-center justify-center gap-4">
                

                <div onClick={() => {window.location.href = `/${country.country}/my-ads`}} className="flex items-center justify-center gap-2 text-white hover:text-green-500 transition-all duration-300 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fillRule="evenodd" d="M3,2.25 L10,2.25 C10.4142136,2.25 10.75,2.58578644 10.75,3 L10.75,10 C10.75,10.4142136 10.4142136,10.75 10,10.75 L3,10.75 C2.58578644,10.75 2.25,10.4142136 2.25,10 L2.25,3 C2.25,2.58578644 2.58578644,2.25 3,2.25 Z M3.75,9.25 L9.25,9.25 L9.25,3.75 L3.75,3.75 L3.75,9.25 Z M14,2.25 L21,2.25 C21.4142136,2.25 21.75,2.58578644 21.75,3 L21.75,10 C21.75,10.4142136 21.4142136,10.75 21,10.75 L14,10.75 C13.5857864,10.75 13.25,10.4142136 13.25,10 L13.25,3 C13.25,2.58578644 13.5857864,2.25 14,2.25 Z M14.75,9.25 L20.25,9.25 L20.25,3.75 L14.75,3.75 L14.75,9.25 Z M14,13.25 L21,13.25 C21.4142136,13.25 21.75,13.5857864 21.75,14 L21.75,21 C21.75,21.4142136 21.4142136,21.75 21,21.75 L14,21.75 C13.5857864,21.75 13.25,21.4142136 13.25,21 L13.25,14 C13.25,13.5857864 13.5857864,13.25 14,13.25 Z M14.75,20.25 L20.25,20.25 L20.25,14.75 L14.75,14.75 L14.75,20.25 Z M3,13.25 L10,13.25 C10.4142136,13.25 10.75,13.5857864 10.75,14 L10.75,21 C10.75,21.4142136 10.4142136,21.75 10,21.75 L3,21.75 C2.58578644,21.75 2.25,21.4142136 2.25,21 L2.25,14 C2.25,13.5857864 2.58578644,13.25 3,13.25 Z M3.75,20.25 L9.25,20.25 L9.25,14.75 L3.75,14.75 L3.75,20.25 Z"></path></svg>
                    My Ads
                </div>

                <div onClick={() => { window.location.href = `/${country.country}/messages/`}} className="flex items-center justify-center gap-2 text-white hover:text-green-500 transition-all duration-300 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fillRule="evenodd" d="M20.7708784,15.6353225 C19.2048634,18.7687087 16.003219,20.748673 12.5019554,20.7500259 C11.170068,20.7534985 9.85486501,20.4655356 8.64815212,19.9078805 L3.23717082,21.711541 C2.6508523,21.9069805 2.09304802,21.3491762 2.28848753,20.7628577 L4.09214783,15.3518768 C3.53449285,14.1451723 3.24652977,12.8300832 3.25000006,11.4997383 C3.25135552,7.99680952 5.23131982,4.79516511 8.36185998,3.23057996 C9.64541532,2.58225315 11.063961,2.2462818 12.5,2.24999749 L13.0413141,2.25116725 C17.7388283,2.51032529 21.4897032,6.26120016 21.7500285,11.0000285 L21.7500285,11.4990722 C21.7535911,12.9367242 21.4176256,14.3549096 20.7708784,15.6353225 Z M8.46282918,18.388516 C8.65253857,18.3252795 8.85964607,18.3404222 9.03814002,18.43058 C10.1108155,18.9723909 11.2963033,19.2531643 12.4997098,19.2500285 C15.434596,19.2488929 18.1170549,17.5900039 19.4305515,14.9618885 C19.9723624,13.889213 20.2531358,12.7037252 20.2500025,11.5019839 L20.2511388,11.0413426 C20.0340974,7.10723797 16.8927905,3.96593107 13,3.75 L12.4980446,3.75 C11.2963033,3.74689267 10.1108155,4.02766611 9.03529406,4.57090694 C6.41002461,5.88297361 4.7511356,8.56543244 4.74999745,11.5019839 C4.74686419,12.7037252 5.02763762,13.889213 5.56944852,14.9618885 C5.65960624,15.1403824 5.67474894,15.3474899 5.61151247,15.5371993 L4.18585412,19.8141744 L8.46282918,18.388516 Z"></path></svg>
                    Chat
                </div>
            </div>

            {
                user_id ? (
                    <div className="flex gap-2">
                        <div onClick={() => {window.location.href = `/${country.country}/create-ad`}}>
                                <button className="border-2 w-24 h-10 hover:bg-green-600 rounded-lg cursor-pointer border-green-600 text-green-600 hover:text-white transition-all duration-500 font-semibold">Create Ad</button>
                            </div>
                            <div onClick={() => {window.location.href = `/${country.country}/logout`}}>
                                <button className="border-2 w-24 h-10 hover:bg-green-600 rounded-lg cursor-pointer border-green-600 text-green-600 hover:text-white transition-all duration-500 font-semibold">Logout</button>
                        </div>
                    </div>
                ) 
                
                :

                
                (
                    <div className="flex gap-2">
                        <div onClick={() => {window.location.href = `/${country.country}/register`}}>
                            <button className="border-2 w-24 h-10 hover:bg-green-600 rounded-lg cursor-pointer border-green-600 text-green-600 hover:text-white transition-all duration-500 font-semibold">Register</button>
                        </div>
                        <div onClick={() => {window.location.href = `/${country.country}/login`}}>
                            <button className="border-2 w-24 h-10 hover:bg-green-600 rounded-lg cursor-pointer border-green-600 text-green-600 hover:text-white transition-all duration-500 font-semibold">Login</button>
                        </div>
                    </div>
                )
            }

        </div>    
    )
}