import axios from "axios";
import {API_ENDPOINT} from '../constants';


const startLoader = (dispatch,a)=>{
    return dispatch({ type: "START_LOADER" });
}
  
const stopLoader = (dispatch)=>{
    return dispatch({ type: "STOP_LOADER" });
}


export const hideAlert =() => dispatch =>{
  dispatch({
    type: "HIDE_NOTIFY", payload: {}
  });
}

export const setSortOrder = (data) => dispatch => {
 
  return dispatch({ 
    type    : "SET_SORT_ORDER",
    payload : {
      sortorder : data.order
    }
   });
}

export const setSearchValue = (value) => dispatch => {

  return dispatch({ 
    type    : "SET_SEARCH_VALUE",
    payload : {
      searchval : value
    }
   });
}

export const createUser = (data) => dispatch => {
  var requestObj = {
    method: 'POST',
    data: {
      u_name      : data.name,
      e_mail      : data.email,
      role        : data.role,
      stts        : data.status,
      user_id     : data.user_id
    },
    url: API_ENDPOINT + '/userdata/ad_usr',
  };
  startLoader(dispatch,1);
  
  return axios(requestObj).then((res) => {
    stopLoader(dispatch);
    var msg = 'User Added Successfully'
    if(data.user_id){
      msg = 'User details Edited Successfully'
    }
    dispatch({
      type: "SHOW_NOTIFY", payload: {
        type: 'success',
        message: msg,
        dispatch: dispatch
      }
    });
    return res;
  })
  .catch((err) => {
    var err_msg = "Something went wrong";
    if (err.response && err.response.statusText) {
      err_msg = err.response.statusText;
    }
    if(err.response && err.response.data && err.response.data.err){
      err_msg = err.response.data.err;
    }
    
    stopLoader(dispatch);
    console.log(err_msg);
    return dispatch({
      type: "SHOW_NOTIFY", payload: {
        type: 'error',
        message: err_msg,
        dispatch: dispatch
      }
    });
  })
}

export const getAllUsers = (data) => dispatch => {
 
    var requestObj = {
      method  : 'GET',
      params    : {
        sort_order  : data.sort_order,
        searchval   : data.searchval
      },
      url     : API_ENDPOINT + '/userdata/gt_users',
    };
    startLoader(dispatch,1);
    
    axios(requestObj).then((res) => {
      if (res ) {
        dispatch({
          type: "GET_ALL_USERS",
          payload: {
              usersdata : res.data.data
          }
        });
      }
      stopLoader(dispatch);
    })
    .catch((err) => {
      var err_msg = "Something went wrong";
      if (err.response && err.response.statusText) {
        err_msg = err.response.statusText;
      }
      if(err.response && err.response.data && err.response.data.err){
        err_msg = err.response.data.err;
      }
      
      stopLoader(dispatch);
      console.log(err_msg);
      return dispatch({
        type: "SHOW_NOTIFY", payload: {
          type: 'error',
          message: err_msg,
          dispatch: dispatch
        }
      });
    })
}


export const deleteUser = (data) => dispatch => {
  var requestObj = {
    method: 'PUT',      // due to soft delete not from db 
    data: {
      user_id     : data.user_id
    },
    url: API_ENDPOINT + '/userdata/rm_usr',
  };
  startLoader(dispatch,1);
  
  return axios(requestObj).then((res) => {
    stopLoader(dispatch);
    dispatch({
      type: "SHOW_NOTIFY", payload: {
        type: 'success',
        message: "User details Deleted Successfully!",
        dispatch: dispatch
      }
    });
    return res;
  })
  .catch((err) => {
    var err_msg = "Something went wrong";
    if (err.response && err.response.statusText) {
      err_msg = err.response.statusText;
    }
    if(err.response && err.response.data && err.response.data.err){
      err_msg = err.response.data.err;
    }
    
    stopLoader(dispatch);
    console.log(err_msg);
    return dispatch({
      type: "SHOW_NOTIFY", payload: {
        type: 'error',
        message: err_msg,
        dispatch: dispatch
      }
    });
  })
}
