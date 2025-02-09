import { useParams } from "react-router-dom";
import ImageCarousel from "./components/imageCaroussel";
import NavBar from "./components/navbar";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";


export default function Marketplace(){
    document.title = "Ads4me - Marketplace"
    const { country } = useParams();
    return(
        <div>
            <NavBar country={country}/>
            <Categories />
            <ImageCarousel />
            <FeaturedProducts />
        </div>
    )
}