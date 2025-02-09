
// if (typeof window !== 'undefined') {
//     const usersId = localStorage.getItem('userId');
//     getAllSideNavDataAllUserWise(usersId).then(data => {
//       console.log(data);
//     });
//   }
// get All Admin Data 
export const getAllAdminData = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/allAdmin`)
    const data = await response.json()
    return data
}
export const getAllSideNavData = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/group-names-id`)
    const data = await response.json()
    return data
}

// export const getAllSideNavDataAllUserWise = async () => {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${usersId}/role`)
//     const data = await response.json()
//     return data
// }

// get All user Data 
export const getAllUserData = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/allUser`)
    const data = await response.json()
    return data
}

// get All user role Data 
export const getUserRoleData = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/users/role_all`)
    const data = await response.json()
    return data
}

