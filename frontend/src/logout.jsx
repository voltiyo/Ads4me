import cookies from "js-cookie"
import { useParams } from "react-router-dom";

export default function Logout(){
    cookies.remove("loginData");
    const { country } = useParams();
    window.location.href = "/" + country;
    return "";
}