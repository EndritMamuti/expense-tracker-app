import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import CreateExpense from "./pages/CreateExpense.jsx";
import Login from "./pages/Login.jsx";
import {BrowserRouter as Router, Routes, Route,} from 'react-router-dom';
import Expense from "./components/Expense.jsx";

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <Router>
            <>
                <Header toggleSidebar={toggleSidebar} />
                <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
                {sidebarOpen && (
                    <div
                        className="overlay"
                        onClick={closeSidebar}
                    ></div>
                )}
                <main className="content">
                    <Routes>
                        <Route path="/" element={<Expense />} />
                        <Route path="/CreateExpenses" element={<CreateExpense />} />
                        <Route path="/Login" element={<Login />} />
                    </Routes>
                </main>
            </>
        </Router>
    )
}

export default App