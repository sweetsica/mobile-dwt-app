import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  fs_14_400,
  fs_14_700,
  row_between,
  text_black,
  text_center,
  text_red,
} from '../../../assets/style.ts';
import DateTimePicker from 'react-native-ui-datepicker';
import CloseIcon from '../../../assets/img/close-icon.svg';
import dayjs from 'dayjs';
import {useState} from 'react';
import 'dayjs/locale/vi';
import PrimaryButton from '../button/PrimaryButton.tsx';
export default function DatePickerFromToModal({
  setVisible,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: any) {
  const [fromDateEdit, setFromDateEdit] = useState(fromDate || dayjs());
  const [toDateEdit, setToDateEdit] = useState(toDate || dayjs());
  const [currentSelect, setCurrentSelect] = useState(0);

  const handleSaveValue = () => {
    setFromDate(fromDateEdit);
    setToDate(toDateEdit);
    setVisible(false);
  };
  return (
    <View style={styles.timePickerWrapper}>
      <View style={styles.timePickerContainer}>
        <View style={styles.header}>
          <Text style={[fs_14_700, text_red, text_center]}>
            TÙY CHỌN THỜI GIAN
          </Text>
          <Pressable
            hitSlop={10}
            onPress={() => {
              setVisible(false);
            }}>
            <CloseIcon width={20} height={20} style={styles.closeIcon} />
          </Pressable>
        </View>
        <View style={styles.content}>
          <View style={row_between}>
            <View style={styles.row_gap10}>
              <Text style={[fs_14_400, text_black]}>Từ: </Text>
              <TouchableOpacity
                style={
                  currentSelect === 0 ? styles.dateBoxSelect : styles.dateBox
                }
                onPress={() => {
                  setCurrentSelect(0);
                }}>
                <Text style={[fs_14_400, text_black]}>
                  {dayjs(fromDateEdit).format('DD/MM/YYYY')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row_gap10}>
              <Text style={[fs_14_400, text_black]}>Đến: </Text>
              <TouchableOpacity
                style={
                  currentSelect === 1 ? styles.dateBoxSelect : styles.dateBox
                }
                onPress={() => {
                  setCurrentSelect(1);
                }}>
                <Text style={[fs_14_400, text_black]}>
                  {dayjs(toDateEdit).format('DD/MM/YYYY')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.calendar}>
            <DateTimePicker
              value={currentSelect === 0 ? fromDateEdit : toDateEdit}
              onValueChange={(date: any) => {
                if (currentSelect === 0) {
                  setFromDateEdit(date);
                } else {
                  setToDateEdit(date);
                }
              }}
              locale={'vi'}
              mode={'date'}
              firstDayOfWeek={1}
              selectedItemColor={'#CA1F24'}
              weekDaysTextStyle={styles.weekDayTextStyle}
              calendarTextStyle={styles.dayTextStyle}
              headerTextStyle={styles.headerTextStyle}
            />
          </View>
          <PrimaryButton
            onPress={handleSaveValue}
            text={'Áp dụng bộ lọc'}
            buttonStyle={styles.button}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  timePickerWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgba(217, 217, 217, 0.83)',
    zIndex: 1,
  },
  timePickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  content: {
    padding: 15,
  },
  row_gap10: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  dateBox: {
    height: 30,
    width: 100,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateBoxSelect: {
    height: 30,
    width: 100,
    borderWidth: 1,
    borderColor: '#CA1F24',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendar: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  weekDayTextStyle: {
    fontSize: 10,
    color: '#8F9098',
    fontWeight: '600',
  },
  dayTextStyle: {
    fontSize: 12,
    color: '#000',
    fontWeight: '700',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  headerTextStyle: {
    ...fs_14_700,
    ...text_black,
  },
});
