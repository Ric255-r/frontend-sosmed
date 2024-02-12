import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";

let token = Cookies.get('token');

export const getApi = () => {
    return fetch(`http://localhost:3000/api/me`, {
        headers : {
            Authorization : 'Bearer ' + token,
            'Content-Type' : 'application/json'
        }
    });
}

export const getPosts = async () => {
    try {
        const responseDataPosts = await axios.get(`http://localhost:3000/api/posts`, {
            headers : {
                Authorization : 'Bearer ' + token,
                'Content-Type' : 'application/json'
            }
        })
    
        const responseOtherPeople = await axios.get(`http://localhost:3000/api/anotherpeople`, {
            headers : {
                Authorization : 'Bearer ' + token,
                'Content-Type' : 'application/json'
            }
        });

        const responseMe = await axios.get(`http://localhost:3000/api/me`, {
            headers : {
                Authorization : 'Bearer ' + token,
                'Content-Type' : 'application/json'
            }
        });

        const respAllUsers = await axios.get(`http://localhost:3000/api/users`, {
            headers : {
                Authorization : 'Bearer ' + token,
                'Content-Type' : 'application/json'
            }
        });

        return {
            dataPosts : responseDataPosts.data,
            otherPeople : responseOtherPeople.data,
            Me : responseMe.data,
            users : respAllUsers.data
        }

    } catch (error) {
        console.log(error);
        return null
    }


}

export const getPostsById = async ({params}) => {
    try {
        const responseIdPosts = await axios.get(`http://localhost:3000/api/posts/${params.slug}`, {
            headers : {
                Authorization : 'Bearer ' + token
            }
        });
    
        const responseMe = await axios.get(`http://localhost:3000/api/me`, {
            headers : {
                Authorization : 'Bearer ' + token
            }
        });

        const respAllUsers = await axios.get(`http://localhost:3000/api/users`, {
            headers : {
                Authorization : 'Bearer ' + token,
                'Content-Type' : 'application/json'
            }
        });

        return {
            idPosts : responseIdPosts.data,
            me : responseMe.data,
            users : respAllUsers.data
        }
    } catch (error) {
        console.log(error);
        return null;
    }

    
}

export const getProfileById = async(idProfile) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/getUser`,{
            headers : {
                Authorization : 'Bearer ' + token,
                'Content-Type' : 'application/json'
            },
            params : {
                idProfilenya: idProfile
            }
        });

        return {
            me: response.data.getUser,
            myPost: response.data.sosmed,
            otherPeople: response.data.otherPeople,
            loginUser: response.data.getUserLogin,
            isFollow: response.data.isFollow,
            isFollBack: response.data.isFollBack
        }

    } catch (error) {
        console.log(error);
        return null;
    }
}