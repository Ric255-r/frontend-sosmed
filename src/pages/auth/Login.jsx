import axios from "axios";
import { useContext, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { ContextGlobal } from "../../context";


function Login(){
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    // Buat ambil data di context global
    // const [login, setLogin] = useContext(ContextGlobal);
    // End
    // const navigate = useNavigate();

    const submit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/api/login', {
            email: email,
            password: password
        }, {
            headers : {
                "Content-Type" : "application/json"
            }
        }).then(function(response) {
            console.log(response); 
            Cookies.set('token', response.data.token, { expires : 1, secure : true});
            // expires itu hitungannya perhari
            // Bisa buat perjam juga
            // referensi : https://github.com/js-cookie/js-cookie

            // start. ga bisa pake cara ini, karena settoken kalah cepat dengan navigate.
            // navigate('/');  
            // lalu di APi ada middleware auth token, jadi kalo navigate, middlewareny ga kebaca.
            // end.
            // setLogin(true); // ssementara
            window.location.href='/';

        }).catch(function(error){
            console.log(error);
            alert(error.response.data.message);
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
        }); 
    }
    
    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
                    <h3 className="text-2xl font-bold text-center">Login to your account</h3>
                    <form action="" method="POST" onSubmit={submit}>
                        <div className="mt-4">
                            <div>
                                <label className="block" >Email</label>
                                <input name="email" type="text" placeholder="Email"
                                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" 
                                    onChange={(e) => setEmail(e.target.value)} id="email" />
                            </div>
                            <div className="mt-4">
                                <label className="block">Password</label>
                                <input name="password" type="password" placeholder="Password"
                                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" 
                                    onChange={(e) => setPassword(e.target.value)} id="password" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900" type="submit">Login</button>
                                
                                <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                            </div>
                            <div className="flex items-baseline justify-between mt-3">
                                <Link className="text-gray-600" to="/register">Don't Have Account? <span className="text-blue-600">Register</span></Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login;