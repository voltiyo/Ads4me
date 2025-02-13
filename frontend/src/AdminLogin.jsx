import cookies from "js-cookie"


async function HandleLogin() {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#pass").value;
    document.querySelector(".error").textContent = "";
    if (password && username) {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        })
        const data = await response.json();
        console.log(data)
        if (data.success === true) {
            cookies.set("AdminLogin", { logged: true})
            window.location.href = "/admin/Dashboard"
        } else {
            document.querySelector(".error").textContent = data.message;
        }
    } else {
        document.querySelector(".error").textContent = "missing fields";
    }

}


export default function AdminLogin() {
    return (
        <div className="flex items-center justify-center w-full h-screen bg-[url(/AdminBg.jpg)]">
            <div className="w-1/2 h-1/2 rounded-xl bg-white/40 flex items-center justify-center flex-col gap-2 overflow-auto">
                <h1 className="text-3xl mb-8 font-bold text-black">Welcome back Admin !</h1>
                <p className="error text-red-700"></p>
                <input type="text" placeholder="username" id="username" className="focus-within:border-red-600 border-2 transition-all duration-500 w-1/2 py-2 px-4 text-xl font-semibold rounded-lg text-black outline-0" />
                <input type="password" placeholder="password" id="pass" className="focus-within:border-red-600 border-2 w-1/2 py-2 px-4 transition-all duration-500 text-xl font-semibold rounded-lg text-black outline-0" />
                <button onClick={HandleLogin} className="border-2 cursor-pointer bg-green-700 w-1/2 py-2 font-bold rounded-lg text-black ">Login</button>
            </div>
        </div>
    )
}