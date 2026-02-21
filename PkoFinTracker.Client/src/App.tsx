import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Callback} from "./pages/Callback.tsx";
import {Dashboard} from "./pages/Dashboard.tsx";
import Layout from "./components/Layout.tsx";
import Transactions from "./pages/Transactions.tsx";
import {TransactionProvider} from "./context/TransactionContext.tsx";
import {SkeletonTheme} from "react-loading-skeleton";


function App() {
    return (
        <SkeletonTheme baseColor="#252231" highlightColor="#312d41">
        <BrowserRouter>
            <TransactionProvider>
                <Routes>
                    <Route path="/callback" element={<Callback />} />

                    <Route path="/*" element={

                        <Layout>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/transactions" element={<Transactions />} />
                            </Routes>
                        </Layout>
                    } />
                </Routes>
            </TransactionProvider>
        </BrowserRouter>
        </SkeletonTheme>
    )
}

export default App
