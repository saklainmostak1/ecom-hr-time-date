'use client' 
 //ismile

import { useEffect, useState } from "react";
import Login1 from "../login1/page";
import Login2 from "../login2/page";
import Login3 from "../login3/page";
import Login4 from "../login4/page";
import Login5 from "../login5/page";
import Login6 from "../login6/page";
import Login7 from "../login7/page";
import Login8 from "../login8/page";
import Login9 from "../login9/page";
import Login10 from "../login10/page";
import Login11 from "../login11/page";
import Login12 from "../login12/page";
import Login13 from "../login13/page";
import Login14 from "../login14/page";
import Login15 from "../login15/page";
import Login16 from "../login16/page";
import Login17 from "../login17/page";
import Login18 from "../login18/page";
import Login19 from "../login19/page";
import Login20 from "../login20/page";
import Login21 from "../login21/page";
import Login22 from "../login22/page";
import Login23 from "../login23/page";
import Login24 from "../login24/page";
import Login25 from "../login25/page";
import Login26 from "../login26/page";
import Login27 from "../login27/page";


const Login = () => {

    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/admin_panel_settings`)
            .then(Response => Response.json())
            .then(data => setCategories(data))
    }, [])
    console.log(categories, 'categories')
    const filteredCategories = categories.filter(category => category.status === 1);



    const loginTemplateNumber = filteredCategories[0]?.login_template_name




    return (
        <>
            {
                loginTemplateNumber  === 1 && 
            <Login1></Login1>
            }
            {
                loginTemplateNumber  === 2 && 
                <Login2></Login2>
            }
            {
                loginTemplateNumber  === 3 && 
                <Login3></Login3>
            }
            {
                loginTemplateNumber  === 4 && 
                <Login4></Login4>
            }
            {
                loginTemplateNumber  === 5 && 
                <Login5></Login5>
            }
            {
                loginTemplateNumber  === 6 && 
                <Login6></Login6>
            }
            {
                loginTemplateNumber  === 7 && 
                <Login7></Login7>
            }
            {
                loginTemplateNumber  === 8 && 
                <Login8></Login8>
            }
            {
                loginTemplateNumber  === 9 && 
                <Login9></Login9>
            }
            {
                loginTemplateNumber  === 10 && 
                <Login10></Login10>
            }
            {
                loginTemplateNumber  === 11 && 
                <Login11></Login11>
            }
            {
                loginTemplateNumber  === 12 && 
                <Login12></Login12>
            }
            {
                loginTemplateNumber  === 13 && 
                <Login13></Login13>
            }
            {
                loginTemplateNumber  === 14 && 
                <Login14></Login14>
            }
            {
                loginTemplateNumber  === 15 && 
                <Login15></Login15>
            }
            {
                loginTemplateNumber  === 16 && 
                <Login16></Login16>
            }
            {
                loginTemplateNumber  === 17 && 
                <Login17></Login17>
            }
            {
                loginTemplateNumber  === 18 && 
                <Login18></Login18>
            }
            {
                loginTemplateNumber  === 19 && 
                <Login19></Login19>
            }
            {
                loginTemplateNumber  === 20 && 
                <Login20></Login20>
            }
            {
                loginTemplateNumber  === 21 && 
                <Login21></Login21>
            }
            {
                loginTemplateNumber  === 22 && 
                <Login22></Login22>
            }
            {
                loginTemplateNumber  === 23 && 
                <Login23></Login23>
            }
            {
                loginTemplateNumber  === 24 && 
                <Login24></Login24>
            }
            {
                loginTemplateNumber  === 25 && 
                <Login25></Login25>
            }
            {
                loginTemplateNumber  === 26 && 
                <Login26></Login26>
            }
            {
                loginTemplateNumber  === 27 && 
                <Login27></Login27>
            }
           
           
           
        </>
    );
};

export default Login;