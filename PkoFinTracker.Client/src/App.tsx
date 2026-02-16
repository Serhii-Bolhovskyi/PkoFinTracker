import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Callback} from "./pages/Callback.tsx";
import {Dashboard} from "./pages/Dashboard.tsx";
import Layout from "./components/Layout.tsx";
import Transactions from "./pages/Transactions.tsx";
import {TransactionProvider} from "./context/TransactionContext.tsx";


function App() {
    return (
        <BrowserRouter>
            <TransactionProvider>
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
            </TransactionProvider>
        </BrowserRouter>
    )
}

export default App
