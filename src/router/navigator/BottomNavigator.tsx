import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';

import HomeIcon from '../../assets/img/bottom-tab/home.svg';
import WorkIcon from '../../assets/img/bottom-tab/work.svg';
import FingerprintIcon from '../../assets/img/bottom-tab/fingerprint.svg';
import NewsIcon from '../../assets/img/bottom-tab/news.svg';
import MenuIcon from '../../assets/img/bottom-tab/menu.svg';

import HomeSelectIcon from '../../assets/img/bottom-tab/home-select.svg';
import WorkSelectIcon from '../../assets/img/bottom-tab/work-select.svg';
import FingerprintSelectIcon from '../../assets/img/bottom-tab/fingerprint-select.svg';
import NewsSelectIcon from '../../assets/img/bottom-tab/news-select.svg';
import MenuSelectIcon from '../../assets/img/bottom-tab/menu-select.svg';

import {
  fs_10_400,
  fs_10_700,
  text_black,
  text_red,
} from '../../assets/style.ts';
import CustomTabBar from '../../components/tabBar/CustomTabBar.tsx';
import {navigatorPath} from '../routePath.ts';

const Tabs = createBottomTabNavigator();

export default function BottomNavigator(): JSX.Element {
  const options = ({route}: any) => {
    return {
      tabBarIcon: ({isFocused}: any) => {
        switch (route.name) {
          case 'Home':
            return isFocused ? (
              <HomeSelectIcon width={20} height={20} />
            ) : (
              <HomeIcon width={20} height={20} />
            );
          case 'Work':
            return isFocused ? (
              <WorkSelectIcon width={20} height={20} />
            ) : (
              <WorkIcon width={20} height={20} />
            );
          case 'Attendance':
            return isFocused ? (
              <FingerprintSelectIcon width={20} height={20} />
            ) : (
              <FingerprintIcon width={20} height={20} />
            );
          case 'News':
            return isFocused ? (
              <NewsSelectIcon width={20} height={20} />
            ) : (
              <NewsIcon width={20} height={20} />
            );
          case 'Menu':
            return isFocused ? (
              <MenuSelectIcon width={20} height={20} />
            ) : (
              <MenuIcon width={20} height={20} />
            );
          default:
            null;
        }
      },
      tabBarLabel: ({isFocused}: any) => {
        switch (route.name) {
          case 'Home':
            return (
              <Text style={[fs_10_400, isFocused ? text_red : text_black]}>
                Trang chủ
              </Text>
            );
          case 'Work':
            return (
              <Text style={[fs_10_400, isFocused ? text_red : text_black]}>
                Công việc
              </Text>
            );
          case 'Attendance':
            return (
              <Text style={[fs_10_400, isFocused ? text_red : text_black]}>
                Chấm công
              </Text>
            );
          case 'News':
            return (
              <Text style={[fs_10_400, isFocused ? text_red : text_black]}>
                Bảng tin
              </Text>
            );
          case 'Menu':
            return (
              <Text style={[fs_10_400, isFocused ? text_red : text_black]}>
                Menu
              </Text>
            );
          default:
            null;
        }
      },
      headerShown: false,
    };
  };
  return (
    <Tabs.Navigator
      screenOptions={options}
      tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}
      backBehavior={'history'}
    >
      {navigatorPath.map((route, index) => (
        <Tabs.Screen
          key={index}
          name={route.name}
          component={route.component}
        />
      ))}
    </Tabs.Navigator>
  );
}
