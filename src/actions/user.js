export const Types = {
    INSERT_USER_INFO: "INSERT_USER_INFO",
    DELETE_USER_INFO: "DELETE_USER_INFO"
};
  
export const insertUserInfo = (jwt, user) => {
    return {
        type: Types.INSERT_USER_INFO,
        payload: {
            jwt,
            user
        }
    };
};

export const deleteUserInfo = () => {
    return {
        type: Types.DELETE_USER_INFO
    };
};