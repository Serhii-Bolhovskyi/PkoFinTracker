import {Route, Routes} from "react-router-dom";
import {Callback} from "./pages/Callback.tsx";
import {Home} from "./pages/Home.tsx";


function App() {
    
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/callback" element={<Callback/>} />
        </Routes>
    )
}

export default App
