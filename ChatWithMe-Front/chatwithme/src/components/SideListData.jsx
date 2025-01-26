import React from "react";
import * as Faicons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import * as ioIcons from 'react-icons/io'
import { FaHistory } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { IoIosChatbubbles } from "react-icons/io";


export const SideListData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiFillHome />,
        cName:'nav-text'
    },
    {
        title: 'History',
        path: '/History',
        icon: <FaHistory />,
        cName:'nav-text'
    },
    {
        title: 'CreateRoom',
        path: '/CreatRoom',
        icon: <IoAdd /> ,
        cName:'nav-text'
    },
    {
        title: 'Rooms',
        path: '/Rooms',
        icon: <IoIosChatbubbles />,
        cName:'nav-text'
    },
        
    ]