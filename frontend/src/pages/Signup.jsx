import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config";
import axios from "axios";
export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res =  await axios.post( `${serverEndpoint}/auth/register`,form);
    navigate("/login");
  };

  return (
    <form className="flex flex-col gap-4 max-w-sm mx-auto mt-20" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-center">Signup</h2>
      <input type="email" placeholder="Email" className="p-2 border" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" className="p-2 border" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit" className="bg-green-500 text-white p-2">Signup</button>
    </form>
  );
}
