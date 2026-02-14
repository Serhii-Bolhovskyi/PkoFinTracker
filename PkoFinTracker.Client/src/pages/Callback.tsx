import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect} from "react";
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
        <div className="fixed inset-0 bg-bank-main flex items-center justify-center">
            <video
                src="/src/assets/callback_animation.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full"
            />
        </div>
    )
}