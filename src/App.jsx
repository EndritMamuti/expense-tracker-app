import './App.css'
import Header from './components/Header'

function App() {
    return (
        <>
            <Header />
            <main className="content">
                <div className="container">
                    <h2>Welcome to Expense Tracker</h2>
                    <p>Manage your expenses efficiently</p>
                </div>
            </main>
        </>
    )
}

export default App