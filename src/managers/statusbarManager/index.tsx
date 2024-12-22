import React from 'react';
import { StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { StatusBarState } from '../../redux/statusbarSlice';


const StatusBarManager: React.FC = () => {
    const statusBarConfig = useSelector((state: { statusBar: StatusBarState }) => state.statusBar);

    return (
        <StatusBar
            animated={statusBarConfig.animated}
            backgroundColor={statusBarConfig.backgroundColor}
            barStyle={statusBarConfig.barStyle}
        />
    );
};

export default StatusBarManager;