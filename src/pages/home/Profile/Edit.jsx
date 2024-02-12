import axios from "axios"
import Cookies from "js-cookie"
import { useContext, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom"
import { ContextGlobal } from "../../../context";
import profileAbuAbu from '../../../assets/blankPic.png';
function EditProfile() {
    const dataApi = useLoaderData();
    const navigate = useNavigate();
    const [api, setApi] = useState(dataApi.me);
    const [file, setFile] = useState(api.photo ? `http://localhost:3000/`+api.photo : '');
    let token = Cookies.get('token');

    const handleChange = (e) => {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    const submit = (e) => {
        e.preventDefault();

        let formData = new FormData();

        if(e.target.photo.files.length === 0){
            formData.append('name', e.target.name.value);
            formData.append('desc', e.target.desc.value);
        }else{
            formData.append('photo', e.target.photo.files[0]);
            formData.append('name', e.target.name.value);
            formData.append('desc', e.target.desc.value);
        }

        axios.put('http://localhost:3000/api/updateprofile', formData, {
            headers : {
                Authorization : 'Bearer ' + token,
                "Content-Type" : "multipart/form-data"
            }
        }).then((res) => {
            setFile(`http://localhost:3000/`+res.data.photo);
            alert('Sukses');
            console.log(res.data);
            navigate('/profile');
        }).catch((err) => {
            console.log(err);
        });

    }

    return (
        <>
            <section>
                <div className="container mx-auto">
                    <div className="flex flex-wrap">
                        <div className="w-1/4">

                        </div>
                        <div className="w-2/4">
                            <h3 className="mt-3">Edit Profile Anda</h3>
                            <form action="" method="post" onSubmit={submit}>
                                <div className="mt-3 text-center">
                                    <div className="flex justify-center items-center">
                                        <img src={file ? file : profileAbuAbu} alt="" className="rounded-full w-32 h-32" />
                                    </div>
                                    Photo
                                    <br />
                                    <input type="file" name="photo" id="photo" 
                                    onChange={handleChange} />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" id="name" name="name" className="w-full" defaultValue={api?.name} />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" className="w-full" defaultValue={api?.email} readOnly />
                                </div>
                                <div className="mt-3" hidden>
                                    <label htmlFor="password">Password</label>
                                    <input type="password" id="password" className="w-full" name="password" />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="password">Desc</label>
                                    <textarea name="desc" id="" cols="30" rows="10" placeholder="Tuliskan Deskripsi" defaultValue={api?.desc} className="w-full"></textarea>
                                </div>
                                <div className="mt-3">
                                    <input type="submit" value="SIMPAN" className="cursor-pointer w-full bg-blue-500 text-white p-2" />
                                </div>
                            </form>
                        </div>
                        <div className="w-1/4">

                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default EditProfile