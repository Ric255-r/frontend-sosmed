import axios from "axios";
import Cookies from "js-cookie";
import { Navigate, useLoaderData, useNavigate, Link } from "react-router-dom"
import { useEffect, useState } from "react";
import { Button, Modal, Carousel, Dropdown } from "flowbite-react";
import moment from "moment-timezone";
import profileAbuAbu from '../../assets/blankPic.png';

function MenuUtama() {
    const dataApi = () => {
        const apinya = useLoaderData();
        return apinya;
    }

    const [api, setApi] = useState(dataApi()?.dataPosts);
    const [otherPeople, setOtherPeople] = useState(dataApi()?.otherPeople);
    const [profile, setProfile] = useState(dataApi()?.Me);
    const [users, setUsers] = useState(dataApi()?.users);

    let token = Cookies.get('token');
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [tags, setTags] = useState('');
    const [photo, setPhoto] = useState([]);
    const [slugPost, setSlugPost] = useState('');

    const [comment, setComment] = useState([]);
    const [openComment, setOpenComment] = useState(false);
    const [inputComment, setInputComment] = useState('');
    const [isEditComment, setIsEditComment] = useState(false);
    const [commentId, setCommentId] = useState('');

    // Atur Fungsi Like
    const [openLiked, setOpenLiked] = useState(false);
    const [liked, setLiked] = useState([]);

    const fnOpenLike = (slug) => {
        axios.get(`http://localhost:3000/api/posts/${slug}`, {
            headers : {
                Authorization : 'Bearer ' + token,
                "Content-Type" : "application/json"
            }
        }).then((res) => {
            setLiked(res.data.liked);
        }).catch((err) => {
            console.log(err);
        });

        setOpenLiked(true);
    }

    const onClickLike = (event, slug, paramsLike) => {
        event.preventDefault();

        if(paramsLike === 'liked'){
            axios.put(`http://localhost:3000/api/updatelike/${slug}`, {
                liked : false
            }, {
                headers : {
                    Authorization : 'Bearer ' + token,
                }
            })
            .then((res) => {
                console.log(res.data);
                setApi(res.data.menu);
                // alert('Bisa Unlike');
            }).catch((err) => {
                console.log(err);
            });
        }else{
            axios.put(`http://localhost:3000/api/updatelike/${slug}`, {
                liked : true
            }, {
                headers : {
                    Authorization : 'Bearer ' + token,
                }
            })
            .then((res) => {
                setApi(res.data.menu);
                // alert('Bisa Like');
                console.log(res.data);
            }).catch((err) => {
                console.log(err);
            });

        }
        
        // if(!btnlike){
        //     axios.put(`http://localhost:3000/api/updatelike/${slug}`, {
        //         liked : true
        //     }, {
        //         headers : {
        //             Authorization : 'Bearer ' + token,
        //         }
        //     })
        //     .then((res) => {
        //         setApi(res.data.menu);
        //         alert('Bisa Like');
        //         console.log(res.data);
        //     }).catch((err) => {
        //         console.log(err);
        //     })

        // }else{
        //     axios.put(`http://localhost:3000/api/updatelike/${slug}`, {
        //         liked : false
        //     }, {
        //         headers : {
        //             Authorization : 'Bearer ' + token,
        //         }
        //     })
        //     .then((res) => {
        //         console.log(res.data);
        //         setApi(res.data.menu);
        //         alert('Bisa Unlike');
        //     }).catch((err) => {
        //         console.log(err);
        //     })
        // }

        // setBtnLike(!btnlike);
    }


    const buatPosts = () => {
        setOpenModal(true);
    }

    const onCloseModal = () => {
        setOpenModal(false);
    }

    const submitPosts = (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);

        for(let i = 0 ; i < photo.length; i++){
            formData.append('image', photo[i]);
        }

        formData.append('tags', tags);

        // const data = {
        //     title : title,
        //     body : body,
        //     tags : tags
        // };

        const header = {
            headers : {
                Authorization : 'Bearer ' + token,
                "Content-Type" : "multipart/form-data"
            }
        };

        axios.post(`http://localhost:3000/api/posts`, formData , header)
            .then((res) => {
                console.log(res);
                setApi(res.data);
                setOpenModal(false);
                alert('Bisa')
            }).catch((err) => {
                console.log(err);
            });
    }

    const fnOpenComment = (slug) => {
        axios.get(`http://localhost:3000/api/posts/${slug}`, {
            headers : {
                Authorization : 'Bearer ' + token,
                "Content-Type" : "application/json"
            }
        }).then((res) => {
            setComment(res.data.comment);
        }).catch((err) => {
            console.log(err);
        });

        setSlugPost(slug);
        setOpenComment(true);
    }

    const submitComment = (e) => {
        e.preventDefault();

        let urlnya = '';
        let data = null;

        if(isEditComment){
            urlnya = `http://localhost:3000/api/updateComment/${slugPost}`;

            data = {
                isicomment : inputComment,
                id : commentId
            };
        }else{
            urlnya = `http://localhost:3000/api/comment/${slugPost}`;

            data = {
                isicomment : inputComment,
            };
        }

        axios.put(urlnya, data, {
            headers : {
                Authorization : 'Bearer ' + token,
            }
        }).then((res) => {
            setComment(res.data.sosmed.comment);
            setApi(res.data.menu);
            console.log(res.data);

            if(isEditComment){
                cancelComment();
            }
        }).catch((err) => {
            console.log(err);
        });


        e.currentTarget.reset();
    }

    const editComment = (komen, idkomen) => {
        document.getElementById('comment').value = komen;
        setIsEditComment(true);
        setCommentId(idkomen);
    }   

    const cancelComment = () => {
        document.getElementById('comment').value = '';
        setIsEditComment(false);
        setCommentId('');
    }

    const deleteComment = (e) => {
        e.preventDefault();

        axios.put(`http://localhost:3000/api/deleteComment/${slugPost}`,{
            id : e.target.idkomen.value
        }, {
            headers : {
                Authorization : 'Bearer ' + token,
                "Content-Type" : "application/json"
            }
        }).then((res) => {
            setComment(res.data.sosmed.comment);
            setApi(res.data.menu);
            alert('Sukses Delete');
            console.log(res);
        }).catch((err) => {
            alert('Error');
            console.log(err);
        })
    }

    const deletePosts = (slug) => {
        axios.delete(`http://localhost:3000/api/posts/${slug}`, {
            headers : {
                Authorization : 'Bearer ' + token
            }
        }).then((res) => {
            alert('Bisa');
            setApi(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }

    const fnCloseComment = () => {
        setOpenComment(false);
        cancelComment();
        setSlugPost(null);
    }

    const follow = (email) => {
        axios.post('http://localhost:3000/api/addFriend', {
            emailFriends : email
        }, {
            headers : {
                Authorization : 'Bearer ' + token
            }
        }).then((res) => {
            console.log(res.data);
            setOtherPeople(res.data);
        }).catch((err) => {
            alert('Error');
            console.warn(err);
        });
    }
    
    return (
        <>
            <section className="mt-[1px]">
                <div className="container mx-auto">
                    <div className="flex flex-wrap">
                        <div className="w-full lg:rounded lg:w-1/4 hidden lg:block">
                            {/* Code Kiri */}
                            <div className="flex flex-wrap sticky top-14">
                                <div className="w-1/4">

                                </div>
                                <div className="w-3/4 border rounded pt-4 pb-4 pl-4">
                                    <div className="flex flex-wrap">
                                        <div className="lg:w-full mb-3">
                                            <h3 className="font-bold pl-2">Tags</h3>
                                        </div>
                                        <div className="lg:w-full">
                                            {api.filter((data, index) => api.findIndex(item => item.tags === data.tags) === index).map((data, index) => {
                                                return (
                                                    <div key={index} className="mt-[0.5px] pl-2">
                                                        <p>{data.tags}</p>
                                                        
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="w-full lg:rounded lg:w-2/4 lg:pl-10 lg:pr-10 pl-10 pr-10">
                            {/* Code Tengah */}
                            <div className="flex flex-wrap mb-6">
                                <div className="w-1/12">
                                    <img src={profile.photo ? `http://localhost:3000/${profile.photo}` : profileAbuAbu} 
                                        className="rounded-full h-12 w-12" alt="Foto Profil" />
                                </div>
                                <div className="w-11/12 pl-2">
                                    <input type="text" name="" id="" className="w-full rounded-br-lg rounded-tl-lg py-4 pl-5 border-gray-200 text-[0.900rem]" placeholder="Mau Post Apa Hari Ini?" readOnly onClick={buatPosts} />
                                </div>
                            </div>

                            <hr />

                            {
                                api.map((data, index) => {
                                    return (
                                        <div className="flex flex-wrap mb-8 mt-6" key={index}>
                                            {
                                                users.map((dt2, ind2) => {
                                                    if(data.author.email === dt2.email){
                                                        const isoDate = data.date;
                                                        const convertedDate = moment(isoDate).tz('Asia/Jakarta').format('DD-MM-YYYY HH:mm');

                                                        return (
                                                            <div className="w-full" key={ind2}>
                                                                <div className="flex flex-wrap">
                                                                    <div className="w-1/12">
                                                                        <img src={dt2.photo ? `http://localhost:3000/${dt2.photo}` : profileAbuAbu} alt="Foto Profil" className="rounded-full h-12 w-12" />
                                                                    </div>
                                                                    <div className="w-10/12 pl-3">
                                                                        <div>
                                                                            <Link to={{ pathname: '/viewProfile', search: `?idProfile=${dt2._id}`}}><b>{dt2.name}</b></Link>
                                                                        </div>
                                                                        <div className="-mt-1">
                                                                            <span className="text-gray-400 text-[0.694rem]">{convertedDate}</span>
                                                                        </div>

                                                                    </div>  
                                                                    {
                                                                        data.author.email === profile.email && (
                                                                            <div className="w-1/12 text-center">
                                                                                <Dropdown label="" dismissOnClick={false} 
                                                                                    style={{ width: '22px', height: '22px', 
                                                                                    marginTop: '15px', marginLeft: '10px', paddingRight: '10px'}}>
                                                                                    <li role="menuitem" className="">
                                                                                        <button type="button" 
                                                                                            className="flex items-center justify-start py-2 px-4 
                                                                                            text-sm text-gray-700 cursor-pointer w-full 
                                                                                            hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-200 
                                                                                            dark:hover:bg-gray-600 focus:outline-none dark:hover:text-white 
                                                                                            dark:focus:bg-gray-600 dark:focus:text-white" 
                                                                                            tabIndex={`-1`} onClick={() => deletePosts(data.slug)}>
                                                                                            Remove Posts?
                                                                                        </button>
                                                                                    </li>
                                                                                </Dropdown>
                                                                            </div>  
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }

                                            <div className="w-full mt-3">
                                                <Link to={`/posts/${data.slug}`}>
                                                    {data.title}
                                                </Link>
                                            </div>
                                            {/* Code mau buat Petak Spt FB, Tp Gagal */}
                                            {/* {(() => {
                                                let pjg = data.image.length;
                                                
                                                return data.image.slice(0, 4).map((img, i) => (
                                                    <div className={
                                                        pjg >= 4 ? (i === 0 ? 'w-full' : 'w-1/3') : (pjg === 3 ? (i === 0 ? 'w-full' : 'w-1/2') : 'w-full')} 
                                                        key={i}>

                                                        {i >= 3 ? (
                                                            <span>Click More To Show</span>
                                                        ) : (
                                                            <img src={`http://localhost:3000/${img}`} alt="image" className={`border`} />
                                                        )}
                                                    </div>
                                                ))
                                            })()} */}
                                            <div className="w-full lg:h-96 h-80 lg:-mt-8 md:mt-2 sm:mt-2 -mt-8">
                                                <Carousel>
                                                    {
                                                        data.image.map((img, i) => {
                                                            return <Link to={`/posts/${data.slug}`} key={i}><img src={`http://localhost:3000/${img}`}  alt="image" className={`border w-full lg:h-72 h-60 object-cover`} /></Link>
                                                        }) 
                                                    }
                                                </Carousel>
                                            </div>

                                            <div className="w-full text-justify mb-4 lg:-mt-8 md:mt-2 sm:mt-2 -mt-8">
                                                {data.body}
                                            </div>

                                            <div className="w-full">
                                                {data.liked.length === 0 ? 'Be The First One Who Liked It' : 'Liked By :'}
                                                
                                                {data.liked.slice(0,2).map((items, ind) => (
                                                    <span key={ind}>
                                                        {items.name === profile.name ? 'You' : items.name }{ind !== data.liked.length - 1 ? ', ' : ''}
                                                    </span>
                                                ))}
                                                {
                                                    data.liked.length > 2 && (
                                                        <button onClick={() => fnOpenLike(data.slug)}>
                                                            And Others
                                                        </button>
                                                    )
                                                }

                                            </div>
                                            <hr className="w-full mb-3"/>

                                            <div className="w-1/3 text-center">
                                                <span className="pl-3">
                                                {
                                                    data.liked.filter(items => items.email === profile.email).length > 0 ? (
                                                        <button className="text-blue-600 hover:text-gray-600" onClick={() => onClickLike(event, data.slug, 'liked')}>
                                                            <span className="">
                                                                <i className="fas fa-thumbs-up"></i> 
                                                                
                                                            </span>
                                                            <span className="pl-2">
                                                                Liked ({data.liked.filter(items => items.email).length}) 
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <button className="hover:text-blue-600" onClick={() => onClickLike(event, data.slug, 'like')}>
                                                            <span className="">
                                                                <i className="fas fa-thumbs-up"></i> 
                                                                
                                                            </span>
                                                            <span className="pl-2">
                                                                Like ({data.liked.filter(items => items.email).length})
                                                            </span>
                                                        </button>
                                                    )
                                                }
                                                </span>
                                            </div>
                                            

                                            <div className="w-1/3 text-center">
                                                <i className="fas fa-comment"></i>
                                                <span className="pl-3">
                                                    <button onClick={() => fnOpenComment(`${data.slug}`)}>
                                                        Koment {`(${data.comment.length})`}
                                                    </button>
                                                </span>
                                            </div>
                                            <div className="w-1/3 text-center">
                                                <i className="fas fa-share"></i>
                                                <span className="pl-3">Share</span>
                                            </div>
                                            <hr className="w-full mt-3"/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="w-full border lg:w-1/4 lg:pl-4 h-72 rounded-tl-lg rounded-br-lg lg:pt-4 hidden lg:block">
                            {/* Code Kanan bisa saja tambah sticky top-15 dibawah div ini*/}
                            <div className="flex flex-wrap">
                                <div className="lg:w-full lg:pl-3 mb-3">
                                    <h3 className="font-bold">People You May Know : </h3>
                                </div>
                            </div>
                                
                            {
                                otherPeople.userlain.map((data, index) => {
                                    let cekFollow = false;
                                    let isFollowBack = false;

                                    // Key relasi = user yang login
                                    // Key userlain = targetuser
                                    // Ngecek kalo di user login tu ad ga emailfriendsnya
                                    const userLainFollBack = data.following.some((items) => items.emailFriends === profile?.email);
                                    isFollowBack = userLainFollBack;

                                    {otherPeople.relasi.following.map((items2, ii) => {
                                        if(items2.emailFriends === data.email){
                                            cekFollow = true;
                                        }
                                        // Cara Array 
                                        // items.emailFriends.map((items2, ii) => {
                                        //     if(items2 === data.email){
                                        //         cekFollow = true
                                        //     }
                                        // })

                                    })}

                                    return (
                                        <div className="flex flex-wrap mb-3 pl-2" key={index}>
                                            <div className="lg:w-1/5">
                                                <img src={data.photo ? `http://localhost:3000/${data.photo}` : profileAbuAbu}  alt="Foto Orng Lain" className="rounded-full h-12 w-12" />
                                            </div>
                                            
                                            <div className="lg:w-4/5 mt-1">
                                                <Link to={{ pathname: '/viewProfile', search: `?idProfile=${data._id}`}}><b>{data.name}</b></Link>

                                                <form method="post" className="-mt-1" onSubmit={(e) => {
                                                    e.preventDefault();
                                                    follow(data.email);
                                                }}>
                                                    
                                                    <button type="submit" className="text-gray-400 text-[0.694rem]">{cekFollow ? 'Following' :  isFollowBack ? 'Follow Back' : 'Follow'}</button>
                                                </form>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                {/* Equivalent To Bootstrap : */}
                {/* <div className="container">
                    <div className="row">
                        <div className="col-sm-3">
                            kiri
                        </div>
                        <div className="col-sm-6">
                            Tengah
                        </div>
                        <div className="col-sm-3">
                            Kanan
                        </div>
                    </div>
                </div> */}

                <Modal show={openModal} onClose={onCloseModal} className="animate-fade-in">
                    <Modal.Header>Post Something New</Modal.Header>
                    <Modal.Body>
                        <form action="" method="post" onSubmit={submitPosts}>
                            <input type="text" name="" id="" 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="w-full rounded-br-lg rounded-tl-lg py-1" 
                            placeholder="Title" />

                            <textarea name="" id="" cols="30" rows="10" 
                            onChange={(e) => setBody(e.target.value)} className="w-full mt-2" placeholder="Isi Postingan Anda"></textarea>

                            <input type="text" name="" id="" onChange={(e) => setTags(e.target.value)} className="w-full rounded-br-lg rounded-tl-lg py-1 mt-2" 
                            placeholder="Tags" />

                            <input type="file" name="" id="" onChange={(e) => setPhoto(e.target.files)} multiple />

                            <button type="submit" className=" mt-2 bg-gray-800 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 cursor-pointer">Simpan</button>

                        </form>
                    </Modal.Body>
                    {/* <Modal.Footer>
                        <input type="button" value="Close" onClick={onCloseModal} className=" bg-red-800 text-white active:bg-red-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 cursor-pointer" />
                    </Modal.Footer> */}
                </Modal>

                <Modal show={openComment} onClose={fnCloseComment}>
                    <Modal.Header>Isi Komentar</Modal.Header>
                    <Modal.Body>
                        {
                            comment.length === 0 ? (
                                <div>'Be The First One to Comment'</div>
                            ) : (
                                comment.map((dataComment, indexCom) => {
                                    return (
                                        <div className="flex flex-wrap" key={indexCom}>
                                            {
                                                users.map((dt2, ind2) => {
                                                    if(dataComment.email === dt2.email){
                                                        return (
                                                            <div className="w-full" key={ind2}>
                                                                <div className="flex flex-wrap">
                                                                    <div className="w-2/12 pb-3">
                                                                        <div className="flex items-center justify-center">
                                                                        <img src={`http://localhost:3000/${dt2.photo}`} className="rounded-full h-[60px] w-[60px]" alt="Foto Profil" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="w-8/12">
                                                                        {dt2.name}
                                                                        <hr />
                                                                        <p>{dataComment.isicomment}</p>
                                                                    </div>
                                                                    {
                                                                        dataComment.email === profile.email && (
                                                                            <>
                                                                                <div className="w-1/12">
                                                                                    <button type="button" 
                                                                                    onClick={() => editComment(dataComment.isicomment, dataComment.id)}>
                                                                                        <i className="fas fa-pencil"></i>
                                                                                    </button>
                                                                                </div>
                                                                                <div className="w-1/12">
                                                                                    <form action="" method="post" onSubmit={deleteComment}>
                                                                                        <input type="hidden" 
                                                                                        name="idkomen" value={dataComment.id} />
                                                                                        <button type="submit">
                                                                                            <i className="fas fa-trash"></i>
                                                                                        </button>
                                                                                    </form>
                                                                                </div>
                                                                            </>
                                                                        ) 
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                                    )
                                })
                            )

                        }
                    </Modal.Body>

                    <form action="" method="post" onSubmit={submitComment}>
                        <Modal.Footer>
                            <textarea name="comment" id="comment" cols="30" rows="2" className="w-full mt-2" placeholder="Isi Komentar Anda" onChange={(e) => setInputComment(e.target.value)}></textarea>

                            {
                                isEditComment ? (
                                    <>
                                        <button type="submit" className=" mt-2 bg-gray-800 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 cursor-pointer">Edit</button>

                                        <button type="button" className=" mt-2 bg-gray-800 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 cursor-pointer" 
                                        onClick={cancelComment}>Cancel</button>
                                    </>

                                ) : (
                                    <button type="submit" className=" mt-2 bg-gray-800 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 cursor-pointer">Simpan</button>
                                )
                            }
                        </Modal.Footer>
                    </form>

                </Modal>

                <Modal show={openLiked} onClose={() => setOpenLiked(false)}>
                    <Modal.Header>Liked By : </Modal.Header>
                    <Modal.Body>
                        {
                            liked.map((data, index) => (
                                <div className="flex flex-wrap" key={index}>
                                    {
                                        users.map((dt2, ind2) => {
                                            if(dt2.email === data.email){
                                                return (
                                                    <div className="w-full" key={ind2}>
                                                        <div className="flex flex-wrap">
                                                            <div className="w-2/12 pb-3">
                                                                <div className="flex items-center justify-center">
                                                                <img src={`http://localhost:3000/${dt2.photo}`} className="rounded-full h-[60px] w-[60px]" alt="Foto Profil" />
                                                                </div>
                                                            </div>
                                                            <div className="w-8/12">
                                                                {dt2.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                    }

                                </div>
                            ))
                        }
                    </Modal.Body>
                </Modal>
            </section>
        </>
    )
}

export default MenuUtama;