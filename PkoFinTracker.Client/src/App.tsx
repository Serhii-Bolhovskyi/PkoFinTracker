import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Callback} from "./pages/Callback.tsx";
import {Dashboard} from "./pages/Dashboard.tsx";
import Layout from "./components/Layout.tsx";
import Transactions from "./pages/Transactions.tsx";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/callback" element={<Callback />} />
                
                <Route path="/*" element={
                    <Layout>
                        <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/transactions" element={<Transactions />} />
                        </Routes>
                    </Layout>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default App
