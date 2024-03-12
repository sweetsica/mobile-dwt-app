import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  fs_14_700,
  mt10,
  mt20,
  text_black,
  text_center,
  text_red,
} from '../../../assets/style.ts';
import CloseIcon from '../../../assets/img/close-icon.svg';
import { useEffect, useState } from 'react';
import 'dayjs/locale/vi';
import PrimaryButton from '../button/PrimaryButton.tsx';
import { ReactNativeModal } from 'react-native-modal';
import { dwtApi } from '../../../api/service/dwtApi.ts';
import LoadingActivity from "../loading/LoadingActivity.tsx";
import { longPressHandlerName } from 'react-native-gesture-handler/lib/typescript/handlers/LongPressGestureHandler';
import dayjs from "dayjs";

export default function CreateOrEditDailyReportModal({
  setVisible,
  visible,
  isEdit,
  currentDate,
  onSuccess,
}: any) {
  const [todayReport, setTodayReport] = useState('');
  const [yesterdayReport, setYesterdayReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleUpdateDailyReport = async () => {
    if(!todayReport || !yesterdayReport) {
        return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
    }
    try {
      setIsLoading(true);
      const payload = {
        today_work_note: todayReport,
        yesterday_work_note: yesterdayReport,
        date_report: dayjs(
          `${currentDate.year}-${currentDate.month + 1}-${currentDate.date}`
        ).format('YYYY-MM-DD'),
      };
      await dwtApi.createPersonalDailyReport(payload);
      setVisible(false);
      setTodayReport('');
      setYesterdayReport('');
      await onSuccess();
    } catch (error) {
      console.log(error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!isEdit) {
      return;
    }
    setTodayReport(isEdit.today_work_note);
    setYesterdayReport(isEdit.yesterday_work_note);
  }, [currentDate, isEdit, visible]);

  const handleClose = () => {
    setVisible(false);
    setTodayReport('');
    setYesterdayReport('');
  }
  return (
    <ReactNativeModal
      animationInTiming={200}
      animationOutTiming={200}
      animationIn={'fadeInUp'}
      animationOut={'fadeOutDown'}
      swipeDirection={'down'}
      backdropTransitionInTiming={200}
      backdropTransitionOutTiming={200}
      onSwipeComplete={handleClose}
      style={styles.wrapper}
      isVisible={visible}
      onBackdropPress={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[fs_14_700, text_red, text_center]}>
            {isEdit ? 'SỬA BÁO CÁO NGÀY' : 'THÊM BÁO CÁO NGÀY'}
          </Text>
          <Pressable
            hitSlop={10}
            onPress={handleClose}
          >
            <CloseIcon width={20} height={20} style={styles.closeIcon} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <TextInput
            style={styles.input}
            placeholder="Báo cáo hôm qua *"
            placeholderTextColor={'#787878'}
            multiline={true}
            value={yesterdayReport}
            onChangeText={(text) => {
              setYesterdayReport(text);
            }}
          />

          <TextInput
            style={[styles.input, mt20]}
            placeholder="Kế hoạch hôm nay *"
            placeholderTextColor={'#787878'}
            multiline={true}
            value={todayReport}
            onChangeText={(text) => {
              setTodayReport(text);
            }}
          />
          <View style={styles.divider} />
          <PrimaryButton
            onPress={handleUpdateDailyReport}
            text={isEdit ? 'Cập nhật' : 'Gửi'}
            buttonStyle={styles.button}
          />
        </View>
      </View>
      <LoadingActivity isLoading={isLoading} />
    </ReactNativeModal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(217, 217, 217, 0.75)',
    justifyContent: 'center',
    margin: 0,
  },
  header: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    position: 'relative',
  },
  container: {
    backgroundColor: '#FFF',
    paddingBottom: 15,
  },
  closeIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  content: {
    paddingTop: 10,
  },
  input: {
    borderColor: '#787878',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    color: '#111',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    marginHorizontal: 15,
  },
  mt30: {
    marginTop: 30,
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginTop: 20,
  },
});
