import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Callback} from "./pages/Callback.tsx";
import {Dashboard} from "./pages/Dashboard.tsx";
import Layout from "./components/Layout.tsx";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/callback" element={<Callback />} />
                
                <Route path="/*" element={
                    <Layout>
                        <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Routes>
                    </Layout>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default App
