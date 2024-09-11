import axios from 'axios';

export const CONNECT_TO_EXTERNAL_BANK_REQUEST = 'CONNECT_TO_EXTERNAL_BANK_REQUEST';
export const CONNECT_TO_EXTERNAL_BANK_SUCCESS = 'CONNECT_TO_EXTERNAL_BANK_SUCCESS';
export const CONNECT_TO_EXTERNAL_BANK_FAILURE = 'CONNECT_TO_EXTERNAL_BANK_FAILURE';


axios.defaults.baseURL =process.env.REACT_APP_SERVER_DOMAIN;


export const connectToExternalBank = (id) => async (dispatch) => {
    dispatch({ type: CONNECT_TO_EXTERNAL_BANK_REQUEST });

    try {
        const response = await axios.post(`/api/auth/connect`, {"id":id});
        const connect_url = response.data;

        dispatch({ type: CONNECT_TO_EXTERNAL_BANK_SUCCESS, payload: connect_url });

        if (connect_url) {
            window.location.href = connect_url;
        }
    } catch (error) {
        dispatch({ type: CONNECT_TO_EXTERNAL_BANK_FAILURE, payload: error.message });
    }
};
