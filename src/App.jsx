import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Route, Router, RouterProvider, createBrowserRouter, createRoutesFromElements, useLocation, useParams, useSearchParams } from 'react-router-dom'
import axios, { Axios } from 'axios'
import AuthLayout from './layout/AuthLayout'
import Login from './pages/auth/Login'
import Cookies from 'js-cookie'
import RootLayout from './layout/RootLayout'
import { ContextGlobal } from './context'
import { getApi, getPosts, getPostsById, getProfileById } from './apis/loader'
import MenuUtama from './pages/home/Index'
import FilePosts from './pages/home/Posts'
import Profile from './pages/home/Profile/Index'
import EditProfile from './pages/home/Profile/Edit'
import Register from './pages/auth/Register'
import ProfileLain from './pages/home/Profile/ViewOtherProfile'
import queryString from 'query-string'

function App(){
    const [login, setLogin] = useState(false);
    let token = Cookies.get('token');
    
    // Async Await
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const responseMyPost = await axios.get(`http://localhost:3000/api/posts/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const responseOtherPeople = await axios.get(`http://localhost:3000/api/anotherpeople`, {
                headers : {
                    Authorization : 'Bearer ' + token,
                    'Content-Type' : 'application/json'
                }
            });

            setLogin(true);
            
            return {
                me: response.data,
                myPost: responseMyPost.data,
                otherPeople : responseOtherPeople.data
            }
        } catch (error) {
            console.log(error);
            setLogin(false);
            // Wajib Return null karena diatas sudh return response.data
            return null;
        }
    };

    useEffect(() => {
        fetchData();
        console.log('Perubahan State Login');
    }, [login]);

    console.log(login);

    const browserRouter = createBrowserRouter(createRoutesFromElements(
        <>
            {/* Parent */}
            <Route element={login ? <Navigate to='/' />: <AuthLayout />}>
                {/* Children */}
                <Route path='/login' element={<Login />}></Route>
                <Route path='/register' element={<Register />}></Route>
            </Route>

            <Route element={ !login ? <Navigate to='/login' /> : <RootLayout />}>
                <Route path='/' element={<MenuUtama />} loader={getPosts}></Route>
                <Route path='/profile' element={<Profile />} loader={fetchData}></Route>
                <Route path='/viewProfile' element={<ProfileLain />} 
                loader={({request}) => {
                    const url = new URL(request.url);
                    const buatCariId = url.searchParams.get("idProfile");
                    return getProfileById(buatCariId);
                }}></Route>
                <Route path='/profile/edit' element={<EditProfile />} loader={fetchData}></Route>
                <Route path='/posts/:slug' element={<FilePosts />} loader={getPostsById}></Route>
            </Route>
        </>
    ));

    return (
        <>
            <RouterProvider router={browserRouter} />

            {/* <ContextGlobal.Provider value={ [login, setLogin] }>
                <RouterProvider router={browserRouter} />
            </ContextGlobal.Provider> */}
        </>
    )
}


export default App
