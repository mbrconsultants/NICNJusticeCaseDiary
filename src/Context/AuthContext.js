// import React, {useState, useEffect, useContext} from 'react'


// const AuthContext = React.createContext()

// export function useAuth(){
//     return useContext(AuthContext);
// }

// export function AuthProvider(props){
//     const [authUser, setAuthUser]=useState(null)
//     const [isLoggedIn, setisLoggedIn]=useState(false)


//     useEffect(() =>{
//         localStorage.setItem("user", JSON.stringify(state.user));
       
    // }, [state.user])
//     const value={

//         authUser, 
//         setAuthUser,
//         isLoggedIn, 
//         setisLoggedIn
//     }

// return(
//     <AuthContext.Provider value={value}>{props }</AuthContext.Provider> 
// )
// }