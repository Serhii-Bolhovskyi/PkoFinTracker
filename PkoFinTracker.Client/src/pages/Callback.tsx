import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import circlesAnimated from "../assets/circles-animated.b14dbffd.svg"

import axios from "axios";


export const Callback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get('code');
    
    useEffect(() => {
        if(code){
            axios.post('http://localhost:5093/api/Bank/sessions', {code})
                .then(() => {
                    navigate('/dashboard')
                });   
        }
    }, [code])
    return (
        <div className="relative h-screen w-full bg-bank-main overflow-hidden flex items-center justify-center">
            <img
                src={circlesAnimated}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            
            <div className="flex flex-col items-center justify-between w-full h-screen z-10 text-center p-16 space-y-5">
                
                <h1 className="text-4xl text-white opacity-60 animate-slide-up mt-20">
                    Track your balance, spending, 
                    and progress with ease
                </h1>
                
                {/* Title */}
                <h2 className="text-white text-3xl font-semibold mb-2 tracking-wider animate-shimmer">
                    Loading...
                </h2>
            </div>
        </div>
    );
}