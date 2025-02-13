
export default function AdminSide({  page }) {
    
    
    return (
        <div className="flex flex-col h-full bg-gray-600/45 w-fit px-4">
            <div onClick={() => {window.location.href = "/admin/Dashboard"}} className={`text-white/30 hover:text-white/80 transition-all duration-500 cursor-pointer h-18 items-center font-bold text-xl flex gap-2  ${page === "Dashboard" ? "text-white/70": ""}`}>
                <i className="fa-solid fa-house"></i>Dashboard
            </div>
            <div onClick={() => {window.location.href = "/admin/Ads"}} className={`text-white/30 hover:text-white/80 transition-all duration-500 cursor-pointer h-18 items-center font-bold text-xl flex gap-2  ${page === "Ads" ? "text-white/70": ""}`}>
                <i className="fa-solid fa-bars"></i>Ads
            </div>
            <div onClick={() => {window.location.href = "/admin/Users"}} className={`text-white/30 hover:text-white/80 transition-all duration-500 cursor-pointer h-18 items-center font-bold text-xl flex gap-2  ${page === "Users" ? "text-white/70": ""}`}>
                <i className="fa-solid fa-user"></i>Users
            </div>
            <div onClick={() => {window.location.href = "/admin/Categories"}} className={`text-white/30 hover:text-white/80 transition-all duration-500 cursor-pointer h-18 items-center font-bold text-xl flex gap-2  ${page === "Categories" ? "text-white/70": ""}`}>
                <i className="fa-solid fa-list"></i>Categories
            </div>
            <div onClick={() => {window.location.href = "/admin/Plans"}} className={`text-white/30 hover:text-white/80 transition-all duration-500 cursor-pointer h-18 items-center font-bold text-xl flex gap-2  ${page === "Plans" ? "text-white/70": ""}`}>
                <i className="fa-solid fa-money-bill"></i>Plans
            </div>
            <div onClick={() => {window.location.href = "/admin/Promos"}} className={`text-white/30 hover:text-white/80 transition-all duration-500 cursor-pointer h-18 items-center font-bold text-xl flex gap-2  ${page === "Subs" ? "text-white/70": ""}`}>
                <i className="fa-solid fa-dollar-sign"></i>Promotions
            </div>
        </div>
    )
}