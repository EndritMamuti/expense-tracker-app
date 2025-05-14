import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={sidebarOpen} />
            {sidebarOpen && (
                <div
                    className="overlay"
                    onClick={closeSidebar}
                ></div>
            )}
            <main className="content">
                <div className="container">
                    <h2>Welcome to Expense Tracker</h2>
                </div>
            </main>
        </>
    )
}

export default App



