import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Expenses from "./pages/Expenses.jsx";
import CreateExpense from "./pages/CreateExpense.jsx";
import Login from "./pages/Login.jsx";
import {BrowserRouter as Router, Routes, Route,} from 'react-router-dom';

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
                        <Route path="/" element={
                            <div className="container">
                                <h2>Welcome to Expense Tracker</h2>
                            </div>
                        } />
                        <Route path="/Expenses" element={<Expenses />} />
                        <Route path="/CreateExpenses" element={<CreateExpense />} />
                        <Route path="/Login" element={<Login />} />
                    </Routes>
                </main>
            </>
        </Router>
    )
}

export default App