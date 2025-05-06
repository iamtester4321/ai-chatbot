
const Input = () => {
  return (

    <section className="pt-[200px] h-100vh">
      <div className="container">
        <div className="max-w-[640px] w-full items-center mx-auto flex flex-col gap-24 sm:gap-6 ">
            <h3 className="text-[48px] text-[#ffffffd6] font-light text-center font-inter hidden md:block">perplexity</h3>
            <h3 className="text-3xl sm:text-4xl md:text-[48px] text-[#ffffffd6] font-light text-center font-inter block md:hidden">What do you want to konw?</h3>

            <div className="bg-[#202222] border border-[#e8e8e61a] flex flex-col rounded-2xl py-3 px-4 w-full"> 
                 <input type="text" className="outline-none w-full h-12 text-lg text-gray-200 pb-1.5 pl-1.5 text-start items-start" placeholder="Ask anything..." />    

                   <div className="max-w-[640px]  w-full flex flex-row gap-10 items-center justify-between pt-1">
                       <div className="bg-[#1e1c1c] rounded-lg max-w-[88px] w-full flex flex-row items-center">
                          <button className="group bg-transparent hover:bg-[#20b8cd1a] hover:border border-[#20b8cd1a] rounded-lg transition-all duration-200 flex flex-row gap-1 items-center  cursor-pointer py-1.5 px-2.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" color="currentColor" className="max-w-4 w-full h-4 group-hover:fill-[#20b8cd] transition-all duration-200" fill="#e8e8e6b3" fillRule="evenodd">
                            <path d="M3.752 9.895a6.145 6.145 0 0 1 6.143-6.143 6.145 6.145 0 0 1 6.142 6.143c0 .568-.074 1.105-.219 1.612a.875.875 0 0 0 1.683.48c.192-.67.286-1.37.286-2.092a7.895 7.895 0 0 0-7.892-7.893 7.895 7.895 0 0 0-7.893 7.893 7.895 7.895 0 0 0 7.893 7.892c1.902 0 3.654-.68 5.018-1.802l5.582 5.748a.875.875 0 0 0 1.255-1.22l-6.175-6.358a.875.875 0 0 0-1.256.001 6.151 6.151 0 0 1-4.424 1.881 6.145 6.145 0 0 1-6.143-6.142ZM9.895 8.49a1.403 1.403 0 1 1 0 2.807 1.403 1.403 0 0 1 0-2.807Z"></path>
                            </svg> 
                            <a href="#" className="text-[#e8e8e6b3] group-hover:text-[#20b8cd] transition-all duration-200 text-sm font-medium">Search</a> 
                          </button>
                       </div>

                       <div className="max-w-[188px] w-full flex flex-row items-center justify-end">
                           <div className="group bg-none hover:bg-[#2d2f2f] transition-all duration-200 rounded-lg flex justify-center items-center max-w-[36px] w-full h-[32px] cursor-pointer">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8d9191" stroke-width="1.7999999999999998" stroke-linecap="round" stroke-linejoin="round" className="w-4 h-4 group-hover:stroke-white">
                               <path d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5"></path>
                             </svg>
                           </div>

                           <div className="bg-[#20b8cd] max-w-[36px] w-full h-[32px] cursor-pointer rounded-lg flex justify-center items-center ml-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7999999999999998" stroke-linecap="round" stroke-linejoin="round" className="w-4 h-4">
                                 <path d="M5 12l14 0"></path><path d="M13 18l6 -6"></path><path d="M13 6l6 6"></path>
                              </svg>
                           </div>
                       </div>
                   </div>
            </div>  
        </div>
      </div> 
    </section>  
  )
}

export default Input;
