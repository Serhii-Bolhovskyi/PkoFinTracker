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
                    navigate('/')
                });   
        }
    }, [code])
    return (
        <>
        <p>Callback</p>
        </>
    )
}