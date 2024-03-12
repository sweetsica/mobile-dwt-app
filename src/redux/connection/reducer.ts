import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';

type IConnectionInterface = {
    userInfo: any;
    currentTabManager: number;
    listDepartmentGroup: {
        office: number[];
        mechan: number[];
        business: number[];
    }
};

const initialState: IConnectionInterface = {
    userInfo: null,
    currentTabManager: 0,
    listDepartmentGroup: {
        office: [],
        mechan: [],
        business: []
    }
};

const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            AsyncStorage.setItem('user', JSON.stringify(action.payload)).then();
            state.userInfo = action.payload;
        },
        setCurrentTabManager: (state, action) => {
            state.currentTabManager = action.payload;
        },
        setListDepartmentGroup: (state, action) => {
            state.listDepartmentGroup = action.payload;
        }
    },
});

const {actions, reducer} = connectionSlice;
export const {
    setUserInfo,
    setCurrentTabManager,
    setListDepartmentGroup
} = actions;

export default reducer;
