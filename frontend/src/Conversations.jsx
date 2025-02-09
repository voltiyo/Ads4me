import { useParams } from "react-router-dom";
import NavBar from "./components/navbar";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";


function Conversation({data, user_id}){
    const [other, setOther] = useState("")
    const persons = [data.person1_id, data.person2_id];
    const otherId = persons.filter(person => person !== user_id)[0]
    
    const { country } = useParams();

    useEffect(() => {
        async function getOther() {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getOwner/${otherId}`)
            const data = await response.json();
            console.log(data)
            setOther(data)
        }
        getOther();
    },[])
    document.title = "Ads4me - Chat"
    return (
        <div className="flex bg-white/30 hover:bg-white/40 transition-all duration-300 gap-4 items-center cursor-pointer p-4 w-[80%]" onClick={() => { window.location.href = `/${country}/messages/${data.id}`}}>
            <img alt={other.username} src="/user.png" className="size-24" />
            <div>
                <p className="text-2xl font-bold">{other.username}</p>
            </div>
        </div>
    )
}


export default function Conversations(){
    const { country } = useParams();
    const [conversations, setConversations] = useState([])

    let user_id = "";
    const loginData = Cookies.get("loginData");
    
    if (loginData) {
        const parsedLoginData = JSON.parse(loginData);
        user_id = parsedLoginData.user_id
    } else {
        window.location.href = `/${country}/login`
    }

    useEffect(() => {
        async function getConvs(){
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/conversations/${user_id}`)
            const data = await response.json();
            setConversations(data)
        }
        getConvs();
    },[])
    return (
        <div>
            <NavBar country={country} />
            <div className="py-20">
                {
                    conversations.length > 0 && 
                    conversations.map((conversation, index)=> {
                        return (
                            <div key={index} className="w-full flex items-center justify-center flex-col">
                                <Conversation data={conversation} user_id={user_id}/>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}