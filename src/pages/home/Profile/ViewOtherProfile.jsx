import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";
import profileAbuAbu from '../../../assets/blankPic.png';

 function ProfileLain(){
    let token = Cookies.get('token');
    const dataApi = useLoaderData();
    const [api, setApi] = useState(dataApi?.me); // me ini adalah target userlain
    const [post, setPost] = useState(dataApi?.myPost);
    const [otherPeople, setOtherPeople] = useState(dataApi?.otherPeople.targetUserNotIn); // otherpeople yang follow userlain
    const [follower, setFollower] = useState(0);
    const [yangLogin, setYangLogin] = useState(dataApi?.loginUser); // ini adalah user yg sedang login
    const [isFollow, setIsFollow] = useState(false);
    const [isFollBack, setIsFollback] = useState(dataApi?.isFollBack);

    const ambilFollower = () => {
        otherPeople.map((item1, i) => {
            item1.following.filter((item2, ii) => {
                if(item2.emailFriends.includes(api?.email)){
                    setFollower(prevFollower => prevFollower + 1);
                    if(item2.emailUser === yangLogin.email){
                        setIsFollow(true);
                    }
                }
            })
        });

        // api.following.map((items, i) => {
        //     if(items.emailFriends === yangLogin.email){
        //         setIsFollback(true);
        //         yangLogin.following.map((items2, ii) => {
        //             if(items2.emailFriends === items.emailUser){
        //                 setIsFollback(false);
        //             }
        //         })
        //     }
        // })
    }
    useEffect(() => {
        // yangLogin.following.map((items2, ii) => {
        //     if(items2.emailFriends.includes(api?.email)){
        //         setFollower(prevFollower => prevFollower + 1);
        //     }
        // });
        ambilFollower();

        console.log('Perubahan Func Follower');
    }, [api?.email]);

    const follow = (email) => {
        axios.post('http://localhost:3000/api/addFriend', {
            emailFriends : email
        }, {
            headers : {
                Authorization : 'Bearer ' + token
            }
        }).then((res) => {
            console.log(res.data.otherPeople.targetUserNotIn);
            setOtherPeople(res.data.otherPeople.targetUserNotIn);
            setApi(res.data.otherPeople.targetUser);
            setIsFollow(res.data.isFollow);
            setIsFollback(res.data.isFollBack);

            if(res.data.isFollow){
                setFollower(prevFollower => prevFollower + 1);
                // setIsFollback(false);
            }else{
                setFollower(prevFollower => prevFollower - 1);
                // setIsFollback(true);
            }
            
        }).catch((err) => {
            alert('Error');
            console.warn(err);
        });
    }

    const navigate = useNavigate();

    return (
        <>
            <div className="flex flex-wrap">
                <div className="lg:w-1/12 hidden lg:block">
                    {/* Kiri */}
                </div>
                <div className="w-full lg:w-10/12 shadow-lg">
                    <div className="flex flex-wrap pl-5 py-3 mt-3">
                        <div className="w-full lg:w-1/6 pb-3 flex justify-center items-center">
                            <img
                                alt="..."
                                src={api?.photo ? `http://localhost:3000/`+api?.photo : profileAbuAbu}
                                className="h-32 w-32 rounded-full"
                            />
                        </div>
                        <div className="w-full lg:w-5/6 py-3 text-center lg:text-left">
                            <div className="flex flex-wrap">
                                <div className="w-full lg:w-4/6 ">
                                    <h3 className="font-bold text-xl">{api?.name}</h3>

                                    <p className="lg:pt-3 pt-2">{api?.desc}</p>


                                </div> 

                                {
                                    yangLogin?.email === api?.email ? (
                                        <>
                                            <div className="lg:w-1/6 md:w-2/4 w-2/4 py-3 text-center lg:text-right pr-5">
                                                <p className="lg:pt-3 pt-2">
                                                    <Link to={'/profile/edit'}>Edit Profile</Link>
                                                </p>
                                            </div>
            
                                            
                                            <div className="lg:w-1/6 md:w-2/4 w-2/4 py-3 text-center lg:text-right pr-5">
                                                <p className="lg:pt-3 pt-2">
                                                    View Archieve
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                        <div className="lg:w-2/6 md:w-full w-full py-3 text-center lg:text-right pr-5">
                                            <div className="lg:pt-3 pt-2">
                                                <form method="post" className="-mt-1" onSubmit={(e) => {
                                                    e.preventDefault();
                                                    follow(api?.email);
                                                }}>
                                                    <button type="submit" className={`text-gray-400 text-[0.694rem] w-full ${isFollow ? ' bg-gray-600 hover:bg-blue-600' : ' bg-blue-600 hover:bg-blue-800'} py-2 rounded-lg`}>
                                                        { isFollow ? 'Following' : isFollBack ? 'Follow Back' : 'Follow'}
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                        </>
                                    )
                                }



                                <div className="w-full md:text-center lg:text-right mt-2 pr-5">
                                    <div className="flex flex-wrap">
                                        <div className="lg:w-6/12">

                                        </div>
                                        <div className="lg:w-2/12 md:w-4/12 w-4/12 ">
                                            {post.length} Posts
                                        </div>
                                        <div className="lg:w-2/12 md:w-4/12 w-4/12">
                                            {follower} Followers
                                        </div>
                                        <div className="lg:w-2/12 md:w-4/12 w-4/12">
                                             {api?.following.filter((items, i) => items.emailUser === api?.email).length } Following
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div className="flex flex-wrap mb-3">
                        <div className="w-full border lg:hidden"></div>
                        <div className="w-full text-center font-bold">
                            POSTS
                        </div>
                    </div>
                    <hr className="w-full mb-3"/>
                    <div className="flex flex-wrap text-center">
                        {
                            post.length !== 0 ? (
                                post.map((params, index) => (
                                    <div className="w-4/12 lg:h-80 md:h-80 h-[180px] border-2" key={index}>
                                        <img src={`http://localhost:3000/`+params?.image[0]} className={`w-full h-full object-cover cursor-pointer`} alt="" 
                                        onClick={() => navigate(`/posts/${params?.slug}`)}/>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full text-center py-5">Tidak Ada Postingan</div>
                                
                            )

                        }

                    </div>
                </div>
                <div className="lg:w-1/12 hidden lg-block">
                    {/* Kanan */}
                </div>
            </div>
        </>


        // <>
        //     <div className="flex flex-wrap">
        //         <div className="w-full lg:w-12/12 lg:px-48 px-auto">
        //             <div className="relative flex flex-col bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
        //                 <div className="px-6">
        //                     <div className="flex flex-wrap justify-center">
        //                         <img
        //                             alt="..."
        //                             src={`http://localhost:3000/`+api?.photo}
        //                             className="shadow-xl rounded-full h-24 w-24 align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
        //                         />
        //                         <div className="p-3 mt-12 text-center">
        //                             <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
        //                                 {api?.name}
        //                             </span>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="px-6">
        //                     Test
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </>

        // <>
        //     {api?.name}
        //     Ini Menu Profile

        //     <Link to="/profile/edit">Edit Profile ANda</Link>
        // </>
    )
 }

 export default ProfileLain;