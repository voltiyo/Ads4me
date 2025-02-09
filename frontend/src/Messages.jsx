import { useParams } from "react-router-dom"
import NavBar from "./components/navbar";
import Cookies from "js-cookie"
import io from 'socket.io-client';
import { useEffect, useState } from "react";


const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_URL;

export default function Messages(){
    const { country, convId } = useParams();
    const [conversation, setConversation] = useState([]);
    const loginData = Cookies.get("loginData");
    const [other, setOther] = useState("");
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [otherDetails, setOtherDetails] = useState("");
    
    let user_id = ""
    if (loginData) {
        const parsedData = JSON.parse(loginData);
        user_id = parsedData.user_id;
    } else {
        window.location.href = `/${country}/`
    }

    const sender_id = user_id;  // Logged-in user
    

    useEffect(() => {
        const socketConnection = io(SOCKET_SERVER_URL);
        setSocket(socketConnection)

        socketConnection.emit("join_room", user_id);


        socketConnection.on('new_message', (msg) => {
            setConversation((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socketConnection.disconnect();
        };
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message = { conversation_id: convId, sender_id, receiver_id: other, content: newMessage };
            socket.emit('send_message', message);
            setConversation((prevMessages) => [...prevMessages, message]);
            setNewMessage('');
        }
    };
    

    useEffect(() => {
        async function getConv() {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages/${convId}`)
            const data = await response.json();
            setConversation(data)
        }
        getConv();
    },[])
    useEffect(() => {
        async function getOther() {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/conversation/${convId}`)
            const data = await response.json();
            const both = [data[0].person1_id, data[0].person2_id]
            const other = both.filter(person => person !== user_id)[0]
            setOther(other)
        }
        getOther();
    },[])
    

    useEffect(() => {
        async function getOtherDetails() {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getOwner/${other}`)
            const data = await response.json();
            setOtherDetails(data)
        }
        getOtherDetails()
    },[other])
    document.title = "Ads4me - message " + otherDetails.username
    return (
        <div className="">
            <NavBar country={country}/>
            <div className="flex flex-col items-center  justify-center h-screen w-full mb-20 ">
                <div className="h-[80%]  w-[80%] bg-white/20 justify-end flex flex-col rounded-lg">
                    <div className="bg-white/20 flex items-center rounded-t-lg p-4">
                        <img src="/user.png" alt={otherDetails.username} className="size-16" />
                        <p className="font-semibold">{otherDetails.username}</p>
                    </div>
                    <div className="chatContainerRef h-[500px] w-full grid p-8 gap-1 overflow-y-scroll">
                        {
                            conversation.length > 0 ? conversation.map((conv, index) => {
                                document.querySelector(".chatContainerRef").scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                                return (
                                    <div 
                                        key={index} 
                                        className={`${
                                            conv.sender_id === user_id 
                                                ? "justify-self-end bg-green-600" // Messages by you on the right
                                                : "justify-self-start bg-white" // Messages by the other on the left
                                        } rounded-lg w-fit px-4 py-2 h-fit`}
                                    >
                                        <p className="font-semibold text-xl">{conv.content}</p>
                                    </div>
                                )
                            })
                            :
                            ""
                        }
                    </div>
                    <div className="flex gap-1  p-8">
                        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Send Message" className="w-full outline-0 border focus-within:border-green-500 px-4 py-2 transition-all duration-500 text-white rounded-lg" onKeyDown={(e) => { if (e.key === "Enter") {handleSendMessage();}}}/>
                        <button onClick={handleSendMessage} className="w-24 border-2 rounded-lg text-green-500 hover:text-white hover:bg-green-500 transition-all duration-500 cursor-pointer font-semibold border-green-500">Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}