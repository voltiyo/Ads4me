

function Video(){
  return(
    <video src="/video.mp4" className="absolute z-0" autoPlay muted loop></video>
  )
}

function App() {
  const communities = [
    {
      name : "Brazil",
      img: "/br.png",
      url: "/Brazil"
    },
    {
      name : "Bulgaria",
      img: "/Bulgaria.png",
      url: "/Bulgaria"
    },
    {
      name : "Poland",
      img: "/Poland.png",
      url: "/Poland"
    },
    {
      name : "Portugal",
      img: "/pt.png",
      url: "/Portugal"
    },
    {
      name : "Romania",
      img: "/romania.png",
      url: "/Romania"
    },
  ]
  return (
    <div>
      <Video></Video>
      <div className="relative">
        <div className="absolute w-full">

          <div className='flex flex-col items-center z-10  w-full h-screen justify-center gap-16'>
            <div className='flex flex-col items-center'>
              <img src="/logo.png" alt="Ads4Me" className="m-8" />
              <h1 className='text-3xl w-[750px] font-bold text-white'>
              Join the millions who buy and sell from each other everyday in local communities around the world.
              </h1>
            </div>

            <div className='flex flex-col items-center justify-center mt-24 gap-4'>
              <h2 className='text-2xl font-bold my-4 text-white'>Find your community below</h2>
              <div className='flex items-center justify-center gap-4'>
                {communities.map((community,index) => {
                  return (
                    <a href={community.url} key={index}>
                      <div className='flex flex-col justify-center items-center'>
                        <img src={community.img} alt={community.name} className=" w-22" />
                        <h3 className="text-white font-bold">{community.name}</h3>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
          

          <div className="flex justify-center items-center gap-4 h-[500px] bg-gray-400">
            <div className="flex justify-center flex-col gap-8 items-center">
                <img src="/office_olx_group.png" alt="office_olx_group" className="w-[600px]" />
                <button className='border-4 transition-all duration-300 h-12 w-36 font-bold border-gray-800 bg-transparent hover:bg-gray-800 text-gray-800 hover:text-white'>More About Us</button>
            </div>
            <div className="flex justify-center flex-col gap-8 items-center ">
                <img src="/office_workflow.png" alt="office_workflow" className="w-[600px]" />
                <button className='border-4 transition-all duration-300 h-12 w-36 font-bold border-gray-800 bg-transparent hover:bg-gray-800 text-gray-800 hover:text-white'>Join Us</button>
            </div>
          </div>
          <footer className='bg-gray-800 text-white font-bold h-16 items-center flex justify-center'>Copyright © 2025 Ads4me </footer>
        </div>

      </div>
    </div>
  )
}

export default App;