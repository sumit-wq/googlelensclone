import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // or any other icon family you prefer
import HomeScreen from '../screen/home';
import ScheduleScreen from '../screen/schedule';
import NotificationScreen from '../screen/notification';
import MoreScreen from '../screen/more';

export const TAB_SCREENS = [
  {
    name: 'Home',
    component: HomeScreen,
    iconName: 'home-outline',
    focousedIcon: 'home'
  },
  {
    name: 'Schedule',
    component: ScheduleScreen,
    iconName: 'clock-outline',
        focousedIcon: 'clock-outline'
  },
  {
    name: 'Notification',
    component: NotificationScreen,
    iconName: 'bell-outline',
    focousedIcon: 'bell'
  },
  {
    name: 'More',
    component: MoreScreen,
    iconName: 'menu',
        focousedIcon: 'menu'
  },
] as const;