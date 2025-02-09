export default function Categories(){
    const Categories = [
        {
            img: '/coupon.png',
            title: 'Coupons'
        },
        {
            img: '/car.png',
            title: 'Autos'
        },
        {
            img: '/phone.png',
            title: 'Mobile Phones'
        },
        {
            img: '/house.png',
            title: 'Real Estate Enclosures to size'
        },
        {
            img: '/garland.png',
            title: 'Decorations'
        },
        {
            img: '/washing-machine.png',
            title: 'Eleatt-linear'
        },
        {
            img: '/sofa.png',
            title: 'Furniture'
        },
        {
            img: '/football.png',
            title: 'Sports'
        },
        {
            img: '/guitar.png',
            title: 'Hobbies'
        },
    ]
    return(
        
        <div className="flex items-center justify-center">
            <div className="flex w-[80%] justify-center pl-96 py-4 items-center gap-4 my-4 overflow-x-scroll flex-nowrap">
                
                {Categories.map((category,index) => {
                    return(
                        <a key={index}>
                            <div  className="flex justify-center items-center gap-2 transition-all duration-300 flex-initial hover:scale-105 px-8 w- text-nowrap bg-white/30 text-white rounded-lg">
                                <img src={category.img} className="size-8" />
                                <p>{category.title}</p>
                            </div>
                        </a>
                    )
                })}
            </div>
        </div>
    )
}