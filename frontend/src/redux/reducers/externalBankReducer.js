import {
    CONNECT_TO_EXTERNAL_BANK_REQUEST,
    CONNECT_TO_EXTERNAL_BANK_SUCCESS,
    CONNECT_TO_EXTERNAL_BANK_FAILURE,
} from '../actions/actions';

const initialExternalBankState = {
    loading: false,
    error: null,
    connectUrl: null,
};

const externalBankReducer = (state = initialExternalBankState, action) => {
    switch (action.type) {
        case CONNECT_TO_EXTERNAL_BANK_REQUEST:
            return { ...state, loading: true };
        case CONNECT_TO_EXTERNAL_BANK_SUCCESS:
            return { ...state, loading: false, connectUrl: action.payload };
        case CONNECT_TO_EXTERNAL_BANK_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default externalBankReducer;
