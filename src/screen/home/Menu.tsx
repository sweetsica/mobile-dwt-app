import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  fs_10_400,
  fs_15_700,
  mb20,
  row_between,
  text_black,
  text_center,
  text_red,
} from '../../assets/style.ts';
import AvatarIcon from "../../assets/img/avatar.svg";
import { useConnection } from '../../redux/connection';
import BangCongIcon from "../../assets/img/menu/bangcong.svg";
import LuongIcon from "../../assets/img/menu/luong.svg";
import ViPhamIcon from "../../assets/img/menu/vipham.svg";
import QuyDinhIcon from "../../assets/img/menu/quydinh.svg";
import CongViecIcon from "../../assets/img/menu/congviec.svg";
import HopIcon from "../../assets/img/menu/hop.svg";
import BienBanIcon from "../../assets/img/menu/bienban.svg";
import DeXuatIcon from "../../assets/img/menu/dexuat.svg";
import SanPhamIcon from "../../assets/img/menu/sanpham.svg";
import KhachHangIcon from "../../assets/img/menu/khachhang.svg";
import BanHangIcon from "../../assets/img/menu/banhang.svg";
import PhanAnhIcon from "../../assets/img/menu/phananh.svg";
import CanteenIcon from "../../assets/img/menu/canteen.svg";
import HuanLuyenIcon from "../../assets/img/menu/huanluyen.svg";
import { useState } from 'react';

const hanhchinhData = [
  {
    id: 1,
    name: 'Bảng công',
    icon: <BangCongIcon width={30} height={30} />,
    path: 'Attendance',
  },
  {
    id: 2,
    name: 'Lương',
    icon: <LuongIcon width={30} height={30} />,
    path: 'SalaryInfo',
  },
  {
    id: 3,
    name: 'Khen & Phạt',
    icon: <ViPhamIcon width={30} height={30} />,
    path: 'RewardAndPunishInfo',
  },
  {
    id: 4,
    name: 'Quy định',
    icon: <QuyDinhIcon width={30} height={30} />,
    path: 'ComingSoon',
  },
];

const congviecData = [
  {
    name: 'Công việc',
    icon: <CongViecIcon width={30} height={30} />,
    path: 'Work',
  },
  {
    name: 'Họp',
    icon: <HopIcon width={30} height={30} />,
    path: 'MeetingInfo',
  },
  {
    name: 'Biên bản',
    icon: <BienBanIcon width={30} height={30} />,
    path: 'ComingSoon',
  },
  {
    name: 'Huấn luyện',
    icon: <HuanLuyenIcon width={30} height={30} />,
    path: 'ComingSoon',
  },
];

const kinhdoanhData = [
  {
    name: 'Sản phẩm',
    icon: <SanPhamIcon width={30} height={30} />,
    path: 'ComingSoon',
  },
  {
    name: 'Khách hàng',
    icon: <KhachHangIcon width={30} height={30} />,
    path: 'Customer',
  },
  {
    name: 'Bán hàng',
    icon: <BanHangIcon width={30} height={30} />,
    path: 'ComingSoon',
  },
  {
    name: 'Đề xuất',
    icon: <DeXuatIcon width={30} height={30} />,
    path: 'Propose',
  },
];

const moreData = [
  {
    name: 'Phản ánh',
    icon: <PhanAnhIcon width={30} height={30} />,
    path: 'ComingSoon',
  },
  {
    name: 'Canteen',
    icon: <CanteenIcon width={30} height={30} />,
    path: 'ComingSoon',
  },
];

export default function Menu({ navigation }: any) {
  const {
    connection: { userInfo },
  } = useConnection();
  const [boxWidth, setBoxWidth] = useState(0);
  return (
    <SafeAreaView style={styles.wrapper}>
      <ImageBackground
        source={require('./../../assets/img/menu-bg.png')}
        style={{
          flex: 1,
        }}
        imageStyle={{
          opacity: 0.6,
        }}
      >
        <View
          style={[
            row_between,
            {
              paddingTop: 15,
              paddingHorizontal: 15,
            },
          ]}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: '#000',
            }}
          >
            Menu
          </Text>
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
              borderRadius: 999,
            }}
            onPress={() => {
              navigation.navigate('Profile');
            }}
          >
            {userInfo?.avatar ? (
              <Image
                source={{ uri: userInfo?.avatar }}
                width={35}
                height={35}
                borderRadius={999}
              />
            ) : (
              <AvatarIcon width={35} height={35} />
            )}
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.content}
        >

          <View style={styles.boxContainer}>
            <Text style={[fs_15_700, text_black, text_center]}>CÔNG VIỆC</Text>
            <View style={styles.box}>
              {congviecData.map((item, index) => (
                  <TouchableOpacity
                      key={index}
                      style={[
                        styles.boxIcon,
                        {
                          width: boxWidth / 4 - 20,
                          height: boxWidth / 4 - 20,
                        },
                      ]}
                      onPress={() => {
                        navigation.navigate(item.path);
                      }}
                  >
                    {item.icon}
                    <Text
                        style={[
                          fs_10_400,
                          text_red,
                          text_center,
                          {
                            marginTop: 5,
                          },
                        ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.boxContainer}
                onLayout={(e) => {
                  setBoxWidth(e.nativeEvent.layout.width);
                }}>
            <Text style={[fs_15_700, text_black, text_center]}>HÀNH CHÍNH</Text>
            <View style={styles.box}>
              {hanhchinhData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.boxIcon,
                    {
                      width: boxWidth / 4 - 20,
                      height: boxWidth / 4 - 20,
                    },
                  ]}
                  onPress={() => {
                    navigation.navigate(item.path);
                  }}
                >
                  {item.icon}
                  <Text
                    style={[
                      fs_10_400,
                      text_red,
                      text_center,
                      {
                        marginTop: 5,
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>


          <View style={styles.boxContainer}>
            <Text style={[fs_15_700, text_black, text_center]}>KINH DOANH</Text>
            <View style={styles.box}>
              {kinhdoanhData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.boxIcon,
                    {
                      width: boxWidth / 4 - 20,
                      height: boxWidth / 4 - 20,
                    },
                  ]}
                  onPress={() => {
                    navigation.navigate(item.path);
                  }}
                >
                  {item.icon}
                  <Text
                    style={[
                      fs_10_400,
                      text_red,
                      text_center,
                      {
                        marginTop: 5,
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.boxContainer}>
            <Text style={[fs_15_700, text_black, text_center]}>KHÁC</Text>
            <View style={styles.box}>
              {moreData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.boxIcon,
                    {
                      width: boxWidth / 4 - 20,
                      height: boxWidth / 4 - 20,
                    },
                  ]}
                  onPress={() => {
                    navigation.navigate(item.path);
                  }}
                >
                  {item.icon}
                  <Text
                    style={[
                      fs_10_400,
                      text_red,
                      text_center,
                      {
                        marginTop: 5,
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  boxContainer: {
    gap: 5,
    marginBottom: 15,
  },
  box: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 6,
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    padding: 10,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  boxIcon: {
    borderRadius: 6,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#817C7C',
  },
});
