import { useParams } from "react-router-dom"
import Cookies from "js-cookie"
import { useEffect } from "react";

export default function NewConversation() {
    const { country, user_id } = useParams();
    
    const LoginData = Cookies.get("loginData");
    let  myId = "";
    if (LoginData) {
        const parsedData = JSON.parse(LoginData);
        myId = parsedData.user_id;
    } else {
        window.location.href = `/${country}`
    }

    useEffect(() => {
        async function SearchConv() {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/searchConversation/${myId}/${user_id}`)
            const data = await response.json();
            if (data.length > 0){
                window.location.href = `/${country}/messages/${data[0].id}`
            } else {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/createNewConv/${myId}/${user_id}`)
                const data = await response.json();
                window.location.href = `/${country}/messages/${data.conversation_id}`
            }
        }
        SearchConv();
    })

    return (
        <div>
            sdqsd
        </div>
    )
}