import { Link, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { Dropdown, Navbar } from 'flowbite-react';
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

function RootLayout() {
    const [api, setApi] = useState(null);
    const navigate = useNavigate();
    let token = Cookies.get('token');

    const fetchData = () => {
        axios.get(`http://localhost:3000/api/me`, {
            headers : {
                Authorization : 'Bearer ' + token
            }
        }).then((res) => {
            setApi(res.data);
        }).catch((err) => {
            console.log(err)
        });
    }

    useEffect(() => {
        fetchData();
    }, []);
    
    const onLogout = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/api/logout', {}, {
            headers : {
                Authorization : 'Bearer ' + token
            }
        }).then((res) => {
            console.log(res);
            Cookies.remove('token');
            window.location.href='/';

        }).catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        let btn = document.querySelector(`[data-testid="flowbite-navbar-toggle"]`);
        btn.addEventListener('click', function(){
            setHiddenDrop(false);
        });

        alert('TO DO LIST SELANJUTNYA : DetailSosmed(OK), EditComment(OK), EditProfile(OK), ProfileFeed(OK), Sistem Following, sistem Count Like & Comment (Baru Komen Selesai)');
    },[])

    const [hiddenDrop, setHiddenDrop] = useState(true);
 
    return (
        <>
            <section className="sticky top-0 z-10" onClick={fetchData}>
                <Navbar fluid rounded >
                    <Navbar.Brand href="https://flowbite-react.com">
                        <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Logo Sosmed" />
                        {/* <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React</span> */}
                    </Navbar.Brand>
                    <div className="flex md:order-2">
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <i className="fas fa-user"></i>
                            }
                        >
                            <Dropdown.Header>
                                <Link to={'/profile'} onClick={() => {
                                    document.querySelector(`[data-testid="flowbite-dropdown"]`).hidden = true;
                                }}>
                                    <span className="block text-sm mb-2" id="nama_user">{api?.name}</span>
                                    <span className="block truncate text-sm font-medium">
                                        {api?.email}
                                    </span>
                                </Link>
                            </Dropdown.Header>
                            <Dropdown.Item>Dashboard</Dropdown.Item>
                            <Dropdown.Item>Settings</Dropdown.Item>
                            <Dropdown.Item>Earnings</Dropdown.Item>
                            <Dropdown.Divider />
                            {/* Li Role dibawah sama seperti Component Dropdown.Item */}
                            <li role="menuitem"> 
                                <span className="flex items-center justify-start py-2 px-4 text-sm text-gray-700 cursor-pointer w-full hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white">
                                    <form action="" method="post" onSubmit={onLogout}>
                                        <button type="submit">Logout</button>
                                    </form>
                                </span>
                            </li>
                        </Dropdown>
                        <Navbar.Toggle />
                    </div>
                    
                    <Navbar.Collapse className={hiddenDrop && ' hidden'}>
                        <Navbar.Link>
                            <input type="text" name="search" id="search" className="rounded-lg h-7 p-2" autoComplete="off" />
                        </Navbar.Link>
                        <li>
                            <Link to={'/'} 
                            className={`block py-2 pr-4 pl-3 md:p-0 bg-cyan-700 text-white dark:text-white 
                            md:bg-transparent md:text-cyan-700`} onClick={() => {
                                setHiddenDrop(true);
                            }}>Home
                            
                            </Link>
                        </li>
                        <li>
                            <Link to={'/about'} className="block py-2 pr-4 pl-3 md:p-0 border-b border-gray-100 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-cyan-700 md:dark:hover:bg-transparent md:dark:hover:text-white">About</Link>
                        </li>

                        {/* <Navbar.Link href="#">About</Navbar.Link>
                        <Navbar.Link href="#">Services</Navbar.Link>
                        <Navbar.Link href="#">Pricing</Navbar.Link>
                        <Navbar.Link href="#">Contact</Navbar.Link> */}
                    </Navbar.Collapse>
                </Navbar>
            </section>


            {/* <Link to="/">Login</Link> | <Link to="/register">Register</Link> */}

            <Outlet></Outlet>
        </>
    )
}

export default RootLayout;