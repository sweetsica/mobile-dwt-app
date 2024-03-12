import {StyleSheet, Text, View} from 'react-native';
import {
  fs_10_500,
  fs_12_400,
  text_black,
  text_center,
  text_white,
} from '../../assets/style.ts';
import {backgroundColor} from 'react-native-calendars/src/style';

export default function PersonalReportDetail({data}: any) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
      {
        //today log
        data.key === 1 ? (
          <Text style={[fs_10_500, text_black]}>{data?.time}</Text>
        ) : (
          //bịt đít :D
          <Text style={[fs_10_500, text_black, text_white]}>{data?.time}</Text>
        )
      }
      <View style={styles.wrapper}>
        <View style={[styles.timeBox, {backgroundColor: data.todayType === 0 ? '#C02626' : '#38BDF8'}]}>
          <Text style={[fs_10_500, text_white, text_center]}>
            {data?.label ?? ''}
          </Text>
        </View>
        {data?.text?.split('\n').map((item: any, index: any) => (
          <Text style={[fs_12_400, text_black]} key={index}>
            • {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '85%',
    alignSelf: 'flex-end',
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    paddingVertical: 15,
    paddingLeft: 15,
    paddingRight: 10,
  },
  timeBox: {
    position: 'absolute',
    left: 15,
    top: -8,
    borderRadius: 15,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
});
