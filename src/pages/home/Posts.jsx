import axios from "axios";
import { Carousel, Dropdown } from "flowbite-react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useLoaderData, useParams, Link, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import profileAbuAbu from '../../assets/blankPic.png';

function FilePosts() {
    const api = useLoaderData();
    const [posts, setPosts] = useState(api?.idPosts);
    const [profile, setProfile] = useState(api?.me);
    const [users, setUsers] = useState(api?.users);
    const [comment, setComment] = useState(posts?.comment);
    const [openComment, setOpenComment] = useState(true);
    const [countComment, setCountComment] = useState(posts?.comment.length);

    // Komentar
    const [inputComment, setInputComment] = useState('');
    const [isEditComment, setIsEditComment] = useState(false);
    const [commentId, setCommentId] = useState('');
    // End Komen

    const navigate = useNavigate();

    let token = Cookies.get('token');

    const deleteComment = (e) => {
        e.preventDefault();

        axios.put(`http://localhost:3000/api/deleteComment/${posts.slug}`,{
            id : e.target.idkomen.value
        }, {
            headers : {
                Authorization : 'Bearer ' + token,
                "Content-Type" : "application/json"
            }
        }).then((res) => {
            setComment(res.data.sosmed.comment);

            let filterData = res.data.menu.filter((items) => items.slug === posts?.slug);
            setCountComment(filterData[0].comment.length);

            alert('Sukses Delete');
            console.log(res);
        }).catch((err) => {
            alert('Error');
            console.log(err);
        })
    }

    const submitComment = (e) => {
        e.preventDefault();

        let urlnya = '';
        let data = null;

        if(isEditComment){
            urlnya = `http://localhost:3000/api/updateComment/${posts.slug}`;

            data = {
                isicomment : inputComment,
                id : commentId
            };
        }else{
            urlnya = `http://localhost:3000/api/comment/${posts.slug}`;

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

            let filterData = res.data.menu.filter((items) => items.slug === posts?.slug);
            setCountComment(filterData[0].comment.length);

            if(isEditComment){
                cancelComment();
            }
        }).catch((err) => {
            console.log(err);
        });

        e.currentTarget.reset();
    }

    const editComment = (komen, idkomen) => {
        document.getElementById('ori_komen').value = komen;
        document.getElementById('resp_komen').value = komen;
        setIsEditComment(true);
        setCommentId(idkomen);
    }   

    const cancelComment = () => {
        document.getElementById('ori_komen').value = '';
        document.getElementById('resp_komen').value = '';
        setIsEditComment(!isEditComment);
        setCommentId('');
    }
    
    const deletePosts = (slug) => {
        axios.delete(`http://localhost:3000/api/posts/${slug}`, {
            headers : {
                Authorization : 'Bearer ' + token
            }
        }).then((res) => {
            alert('Bisa');
            navigate('/profile');
        }).catch((err) => {
            console.log(err);
        });
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
                setPosts(res.data.sosmed);
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
                setPosts(res.data.sosmed);
                // alert('Bisa Like');
                console.log(res.data);
            }).catch((err) => {
                console.log(err);
            });

        }
    }


    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-1/12 hidden lg:block">
                    {/* Code Kiri */}

                </div>

                <div className="w-full shadow-xl shadow-inner lg:rounded lg:w-10/12 lg:pl-3 lg:pr-3 ">
                    {/* Code Tengah */}
                    <div className="flex flex-wrap mb-8">
                        <div className="lg:w-7/12 w-full lg:order-1 order-3">
                            <div 
                            className={`flex justify-center items-center lg:h-96 md:h-80 h-72 lg:mt-2 md:mt-3 sm:mt-3 -mt-3 lg:pl-0 lg:pr-0 pl-10 pr-10 `}>
                                {/* Content Part */}
                                <Carousel slide={false}>
                                    {
                                        posts?.image.map((img, i) => {
                                            return <img src={`http://localhost:3000/${img}`} key={i} alt="image" className={`border`} />
                                        }) 
                                    }
                                </Carousel>
                            </div>
                        </div>
                        <div className="lg:w-1/12 lg:pt-4 pt-2 w-1/4 lg:order-2 order-1">
                            {
                                users.map((data, index) => {
                                    if(posts?.author.email === data.email){
                                        return (
                                            <div className="flex justify-center items-center" 
                                            key={index}>
                                                {/* Profile Photo Parts */}
                                                <img src={`http://localhost:3000/${data.photo}`} alt="Foto Profil" className="rounded-full h-12 w-12" />
                                            </div>
                                        )
                                    }
                                })
                            }

                        </div>
                        <div className="lg:w-4/12 lg:pt-3 pt-2 lg:pl-3 w-3/4 lg:order-3 order-2">
                            {/* Profile Parts */}
                            {
                                users.map((data, index) => {
                                    if(posts?.author.email === data.email){
                                        const isoDate = posts?.date;
                                        const convertedDate = moment(isoDate).tz('Asia/Jakarta').format('DD-MM-YYYY HH:mm');
                                        return (
                                            <div className="flex flex-wrap mt-1" key={index}>
                                                <div className="w-10/12">
                                                    <h1 className="text-[1.10rem] font-bold">{data.name}</h1>
                                                </div>
                                                <div className="w-2/12">
                                                {
                                                    posts?.author.email === profile.email && (
                                                        <Dropdown label="" dismissOnClick={false} 
                                                            style={{ width: '22px', height: '22px', 
                                                            marginTop: '5px', marginLeft: '10px', paddingRight: '10px'}}>
                                                            <li role="menuitem" className="">
                                                                <button type="button" 
                                                                    className="flex items-center justify-start py-2 px-4 
                                                                    text-sm text-gray-700 cursor-pointer w-full 
                                                                    hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-200 
                                                                    dark:hover:bg-gray-600 focus:outline-none dark:hover:text-white 
                                                                    dark:focus:bg-gray-600 dark:focus:text-white" 
                                                                    tabIndex={`-1`} onClick={() => deletePosts(posts?.slug)}>
                                                                    Remove Posts?
                                                                </button>
                                                            </li>
                                                        </Dropdown>
                                                    )
                                                }
                                                </div>
                                                <div className="w-full">
                                                    <span className="text-gray-400 text-[0.694rem]">{convertedDate}</span>
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                            }

                            {/* Tampilan Utk Desktop */}
                            <div className="flex flex-wrap lg:pt-3">
                                <div className="w-1/6 min-[320px]:hidden lg:block">
                                    {
                                        posts?.liked.filter(items => items.email === profile.email).length > 0 ? (
                                            <button onClick={() => onClickLike(event, posts?.slug, 'liked')} className="text-blue-700">
                                                <i className="fas fa-thumbs-up"></i>
                                                <span className="text-[10px] pl-1">
                                                    {posts?.liked.length}
                                                </span>
                                            </button>
                                        ) : (
                                            <button onClick={() => onClickLike(event, posts?.slug, 'like')}>
                                                <i className="fas fa-thumbs-up"></i>
                                                <span className="text-[10px] pl-1">
                                                    {posts?.liked.length}
                                                </span>    
                                            </button>
                                        )
                                    }
                                </div>
                                <div className="w-1/6 min-[320px]:hidden lg:block cursor-pointer" 
                                > {/* onClick={ () => setOpenComment(!openComment) } */}
                                    <i className="fas fa-comment" ></i>
                                    <span className="text-[10px] pl-1">{comment.length}</span>
                                </div>
                                <div className="w-1/6 min-[320px]:hidden lg:block">
                                    <i className="fas fa-share"></i>
                                </div>
                            </div>
                            <div className="flex flex-wrap">
                                <div className="w-full mt-3 min-[320px]:hidden lg:block order-1">
                                    <span>
                                        <b>
                                            {!openComment ? (posts?.title.length > 50 && `${posts?.title.substr(0, 50)} ...`) : posts?.title }
                                        </b>
                                    </span>
                                </div>
                                <div className="w-full min-[320px]:hidden lg:block order-2">
                                    <div className="overflow-y-scroll" 
                                    style={{ maxHeight: '200px', minHeight: '10px' }} > {/* hidden={!openComment} */}
                                        <span>{posts?.body}</span>
                                        <p>{posts?.tags}</p>
                                        <p className="mb-3 mt-3 font-bold">Komentar : </p>
                                        {
                                            comment.length !== 0 ? (
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
                                                                                        <div className="flex justify-center items-center">
                                                                                            <img src={`http://localhost:3000/${dt2.photo}`} className="rounded-full h-[40px] w-[40px]" alt="Foto Profil" />
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
                                                                                                    <button type="button" onClick={() => editComment(dataComment.isicomment, dataComment.id)}>
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
                                            ) : (
                                                <p>Tidak Ada Komentar</p>
                                            )
                                        }
                                        <br />
                                        <form action="" method="post" onSubmit={submitComment}>
                                            <span className="pr-3">
                                                <input type="text" name="" id="ori_komen" className="w-[280px] py-1" 
                                                onChange={(e) => setInputComment(e.target.value)} 
                                                /> {/* hidden={openComment} */}
                                            </span>
                                            {
                                                isEditComment ? (
                                                    <>
                                                        <span > {/* hidden={openComment} */}
                                                            <button type="submit"><i className="fas fa-share w-1/4" ></i></button>
                                                        </span>
                                                        <span > {/* hidden={openComment} */}
                                                            <button className="pl-4" type="button" onClick={cancelComment}><i className="fas fa-times"></i></button>
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span > {/* hidden={openComment} */}
                                                        <button type="submit"><i className="fas fa-share w-1/4" ></i></button>
                                                    </span>
                                                )
                                            }

                                        </form>
                                    </div>
                                </div>
                                {/* <div className="w-full min-[320px]:hidden lg:block order-4">
                                    <span hidden={!openComment}>{posts?.tags}</span>
                                </div>
                                <div className="w-full min-[320px]:hidden lg:block order-3">
                                    <div className="overflow-y-scroll max-h-[170px] min-h-[10px]" 
                                    hidden={openComment}>
                                        <p className="mb-3">Komentar : </p>
                                        {
                                            comment.length !== 0 ? (
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
                                                                                        <div className="flex justify-center items-center">
                                                                                            <img src={`http://localhost:3000/${dt2.photo}`} className="rounded-full h-[40px] w-[40px]" alt="Foto Profil" />
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
                                                                                                    <button type="button" onClick={() => editComment(dataComment.isicomment, dataComment.id)}>
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
                                            ) : (
                                                <p>Tidak Ada Komentar</p>
                                            )
                                        }
                                    </div>
                                </div> */}
                                
                                {/* <div className="w-full min-[320px]:hidden lg:block lg:fixed lg:bottom-[140px]" >
                                    <form action="" method="post" onSubmit={submitComment}>
                                        <span className="pr-3">
                                            <input type="text" name="" id="ori_komen" className="w-[280px] py-1" 
                                            onChange={(e) => setInputComment(e.target.value)} 
                                            hidden={openComment}/>
                                        </span>
                                        {
                                            isEditComment ? (
                                                <>
                                                    <span hidden={openComment}>
                                                        <button type="submit"><i className="fas fa-share w-1/4" ></i></button>
                                                    </span>
                                                    <span hidden={openComment}>
                                                        <button className="pl-4" type="button" onClick={cancelComment}><i className="fas fa-times"></i></button>
                                                    </span>
                                                </>
                                            ) : (
                                                <span hidden={openComment}>
                                                    <button type="submit"><i className="fas fa-share w-1/4" ></i></button>
                                                </span>
                                            )
                                        }

                                    </form>

                                </div> */}
                            </div>
                        </div>
                        <div className="lg:hidden w-full order-4 pl-10 pr-10 lg:mt-2 md:mt-3 sm:mt-3 -mt-3">
                            <div className="flex flex-wrap"> 
                                {/* Tampilan Responsive */}
                                <div className="w-1/6 -pt-3">
                                {
                                    posts?.liked.filter(items => items.email === profile.email).length > 0 ? (
                                        <button onClick={() => onClickLike(event, posts?.slug, 'liked')} className="text-blue-700">
                                            <i className="fas fa-thumbs-up"></i>
                                            <span className="text-[10px] pl-1">
                                                {posts?.liked.length}
                                            </span>
                                        </button>
                                    ) : (
                                        <button onClick={() => onClickLike(event, posts?.slug, 'like')}>
                                            <i className="fas fa-thumbs-up"></i>
                                            <span className="text-[10px] pl-1">
                                                {posts?.liked.length}
                                            </span>
                                        </button>
                                    )
                                }
                                </div>
                                <div className="w-1/6 cursor-pointer" 
                                onClick={() => setOpenComment(!openComment)}>
                                    <i className="fas fa-comment"></i>
                                    <span className="text-[10px] pl-1">{comment.length}</span>

                                </div>
                                <div className="w-1/6">
                                    <i className="fas fa-share"></i>
                                </div>

                                <div className="w-full pt-3">
                                    <span>
                                        <b>
                                            {!openComment ? (posts?.title.length > 50 && `${posts?.title.substr(0, 50)} ...`) : posts?.title }
                                        </b>
                                    </span>
                                </div>
                                <div className="w-full" > {/* hidden={!openComment} */}
                                    <span>{posts?.body}</span>
                                </div>
                                <div className="w-full" > {/* hidden={!openComment} */}
                                    <p className="mb-3 font-bold mt-3">Komentar : </p>
                                    {
                                        comment.length !== 0 ? (
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
                                                                                    <div className="flex justify-center items-center">
                                                                                        <img src={`http://localhost:3000/${dt2.photo}`} className="rounded-full h-[40px] w-[40px]" alt="Foto Profil" />
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
                                                                                                <button type="button" onClick={() => editComment(dataComment.isicomment, dataComment.id)}>
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
                                        ) : (
                                            <p>Tidak Ada Komentar</p>
                                        )
                                    }
                                </div>

                                <form className="w-full mt-5" action="" method="post" onSubmit={submitComment}>
                                    <div className="flex flex-wrap">

                                        <div className="w-10/12">
                                            <input type="text" name="" id="resp_komen" className={`w-full py-1`} 
                                                onChange={(e) => setInputComment(e.target.value)} /> {/* hidden={!openComment} */}
                                        </div>

                                        {
                                            isEditComment ? (
                                                <>
                                                    <div className="w-1/12 text-center">
                                                        <span > {/* hidden={!openComment} */}
                                                            <button type="submit"><i className="fas fa-share " ></i></button>
                                                        </span>
                                                    </div>
                                                    <div className="w-1/12 text-center">
                                                        <span > {/* hidden={!openComment} */}
                                                            <button className="w-1/4" type="button" onClick={cancelComment}><i className="fas fa-times"></i></button>
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-2/12 text-center">
                                                    <span > {/* hidden={!openComment} */}
                                                        <button type="submit"><i className="fas fa-share "></i></button>
                                                    </span>
                                                </div>
                                            )
                                        }
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
                
                <div className="w-full lg:w-1/12 hidden lg:block">
                    {/* Code Kanan bisa saja tambah sticky top-15 dibawah div ini */}
                        
                </div>
            </div>
        </>
    )
}

export default FilePosts;