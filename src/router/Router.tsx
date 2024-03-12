import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {updater} from '../service/Updater';
import {routePath} from './routePath.ts';
import {useEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {useConnection} from '../redux/connection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {dwtApi} from '../api/service/dwtApi.ts';
import {LocaleConfig} from 'react-native-calendars';
import NoInternetModal from "../components/internet/NoInternetModal.tsx";

const Stack = createNativeStackNavigator();
const screenOptions = {
  headerShown: false,
};

LocaleConfig.locales.vi = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
};
LocaleConfig.defaultLocale = 'vi';

const Router = () => {
  const {onSetUserInfo} = useConnection();
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [firstScreen, setFirstScreen] = useState<string | null>(null);

  const checkToken = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (accessToken) {
      try {
        const response = await dwtApi.getMe();
        if (response.status === 200) {
          onSetUserInfo(response.data);
          setIsLogin(true);
        }
      } catch (error: any) {
        setIsLogin(false);
        if (error.status === 401) {
          await AsyncStorage.removeItem('accessToken');
        }
      }
    } else {
      setIsLogin(false);
    }
  };

  useEffect(() => {
    checkToken().then(() => {
      setAppIsReady(true);
      SplashScreen.hide();
    });
  }, []);

  useEffect(() => {
    if (!appIsReady) {
      return;
    }
    if (!isLogin) {
      setFirstScreen('Login');
    } else {
      setFirstScreen('HomePage');
    }
  }, [appIsReady]);

  return (
    <NavigationContainer>

      <NoInternetModal />
      {appIsReady && firstScreen && (
        <Stack.Navigator
          screenOptions={screenOptions}
          initialRouteName={firstScreen}
        >
          {routePath.map((route, index) => (
            <Stack.Screen
              key={index}
              name={route.name}
              component={route.component}
              options={{
                animation: 'slide_from_right',
              }}
            />
          ))}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default updater(Router);
