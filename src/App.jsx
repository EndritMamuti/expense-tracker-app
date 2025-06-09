import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css'

import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import CreateExpense from "./pages/CreateExpense.jsx";
import UpdateExpense from "./pages/UpdateExpense.jsx";
import Login from "./pages/Login.jsx";
import Expense from "./components/Expense.jsx";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '1.2rem',
                color: '#666'
            }}>
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const toggleSidebar = () => {
        console.log('toggleSidebar called, current state:', sidebarOpen);
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        console.log('closeSidebar called');
        setSidebarOpen(false);
    };

    console.log('Sidebar is open:', sidebarOpen);

    return (
        <>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
            {sidebarOpen && (
                <div
                    className="overlay"
                    onClick={closeSidebar}
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                ></div>
            )}
            <main className={isAuthenticated ? "content" : "content-full"}>
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />

                    <Route path="/" element={<Expense />} />

                    <Route
                        path="/create-expense"
                        element={
                            <ProtectedRoute>
                                <CreateExpense />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/update-expense"
                        element={
                            <ProtectedRoute>
                                <UpdateExpense />
                            </ProtectedRoute>
                        }
                    />

                </Routes>
            </main>
        </>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppLayout />
            </AuthProvider>
        </Router>
    )
}

export default App