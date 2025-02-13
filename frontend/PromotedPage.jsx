import { useParams } from "react-router-dom"

export default function Promoted() {
    const { product_id } = useParams();
    
    return (
        <div>
            Promoted : {product_id}
        </div>
    )
}