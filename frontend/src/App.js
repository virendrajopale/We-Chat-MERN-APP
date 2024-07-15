import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Home } from './Pages/Home';
import { Chats } from './Pages/Chats';

function App() {
  return (
    <div className="min-h-[100vh] flex bg-red-300 bg-[url('https://img.freepik.com/premium-vector/seamless-pattern-with-different-social-media-icons_405287-75.jpg?size=626&ext=jpg&ga=GA1.1.2113030492.1720224000&semt=ais_user')] object-cover bg-center">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;
