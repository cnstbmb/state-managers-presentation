import {atom} from 'recoil';

export const loadingState = atom({
    key: 'loadingState',
    default: false,
});

export const errorState = atom({
    key: 'errorState',
    default: null,
});

export const notificationState = atom({
    key: 'notificationState',
    default: null,
});

export const viewModeState = atom({
    key: 'viewModeState',
    default: 'single', // 'single' | 'list' | 'stats'
});
