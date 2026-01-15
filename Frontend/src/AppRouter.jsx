import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/login" element={<Login />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
