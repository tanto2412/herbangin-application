import LoginLayout from "./pages/LoginLayout";
import HomeLayout from "./pages/HomeLayout";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./components/UserContext";

function App() {
  return (
    <>
      <div className="app">
        <UserProvider>
          <Routes>
            <Route path="/" element={<LoginLayout />}></Route>
            <Route path="/home" element={<HomeLayout />}></Route>
          </Routes>
        </UserProvider>
      </div>
    </>
  );
}

export default App;
