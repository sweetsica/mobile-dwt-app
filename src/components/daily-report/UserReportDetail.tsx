import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ChevronDownIcon from '../../assets/img/chevron-down.svg';
import ChevronUpIcon from '../../assets/img/chevron-up.svg';
import AvatarDefault from '../../assets/img/avatar.svg';
import {
  fs_12_400,
  fs_14_500,
  text_black,
  text_gray,
} from '../../assets/style.ts';
import { useRef, useState } from 'react';

import PersonalReportDetail from './PersonalReportDetail.tsx';
import dayjs from 'dayjs';

export default function UserReportDetail({ data }: any) {
  // const [moreSectionHeight, setMoreSectionHeight] = useState(0);
  const shareValue = useRef(new Animated.Value(0)).current;
  const [isMore, setIsMore] = useState(false);
  const toggleMore = () => {
    if (!isMore) {
      Animated.timing(shareValue, {
        toValue: 1,
        duration: 50,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
      setIsMore(true);
    } else {
      Animated.timing(shareValue, {
        toValue: 0,
        duration: 50,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
      setIsMore(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <View style={styles.leftBox}>
          {data?.user_avatar ? (
            <Image
              source={{
                uri: data?.user_avatar,
              }}
              style={styles.avatar}
            />
          ) : (
            <AvatarDefault width={50} />
          )}

          <View style={{ gap: 2 }}>
            <Text style={[fs_14_500, text_black]}>{data?.user_name}</Text>
            <Text style={[fs_12_400, text_gray]}>
              Vị trí: {data?.position_name}
            </Text>
            <Text style={[fs_12_400, text_gray]}>
              {dayjs(data?.created_at).format('DD/MM/YYYY HH:mm')}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleMore}>
          {isMore ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </TouchableOpacity>
      </View>

      {isMore && (
        <View style={{ marginTop: 15 }}>
          <PersonalReportDetail
            data={{
              key: 1,
              label: 'Hôm qua',
              text: data?.yesterday_work_note,
            }}
          />
          <View style={{ marginTop: 20 }}>
            <PersonalReportDetail
              data={{
                key: 2,
                label: 'Hôm nay',
                text: data?.today_work_note,
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 8,
    borderColor: '#787878',
    borderWidth: 1,
    padding: 10,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 999,
    backgroundColor: '#ccc',
  },
  moreWrapper: {
    overflow: 'hidden',
    position: 'relative',
  },
  moreContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    paddingHorizontal: 1,
  },
});
