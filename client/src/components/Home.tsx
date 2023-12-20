import React, { useEffect, useState } from 'react'
import { OnDataOptions, useQuery, useSubscription } from "@apollo/client";
import { QUERY, SUBSCRIPTION } from "../graphql/schema";
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types/UserInterface';



function Home() {
    const [users, setUsers] = useState<HTMLElement[] | null>(null);
    const { loading, error, data } = useSubscription(
        SUBSCRIPTION,
        {
            onData: (data) => {
                if (data) {
                    console.log(data);
                    
                    const usersElm = data.data.data.users.map((user : User) => {
                        return(
                            <div key={uuidv4()}> 
                            <div><b>{user.firstname  }</b></div>
                            <div><b>{user.lastname }</b></div>
                            </div>
                            )
                        })  
                        setUsers(usersElm)
                }
            },
        }
    );

    
    // useEffect(() => {
    //     if (data){
    //         const usersElm = data.users.map((user : User) => {
    //                 return(
    //                     <div key={uuidv4()}> 
    //                     <div><b>{user.firstname  }</b></div>
    //                     <div><b>{user.lastname }</b></div>
    //                     </div>
    //                     )
    //                 })  
    //                 setUsers(usersElm)
    //     }
                
                
    //         }, [data ])
            
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error : {error.message}</p>;
            
    return (
        <>
        <p>hhhh</p>
        {users && users}
        </>
    )
};


export default Home