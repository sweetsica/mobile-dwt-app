import {FlatList, StyleSheet, Text, View} from 'react-native';
import {fs_12_500, text_black, text_center} from '../../assets/style.ts';
import PropTypes, {InferProps} from 'prop-types';
import {fs_12_400, text_red} from '../../assets/style.ts';

export default function AttendanceHistoryTable({
  data,
}: InferProps<typeof AttendanceHistoryTable.propTypes>) {
  const columns = [
    {
      key: 'name',
      title: 'Nhân viên',
      width: 0.35,
    },
    {
      key: 'date',
      title: 'Thời gian',
      width: 0.25,
    },
    {
      key: 'checkIn',
      title: 'Giờ vào',
      width: 0.2,
    },
    {
      key: 'checkOut',
      title: 'Giờ ra',
      width: 0.2,
    },
  ];
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {columns.map((column: any, index: any) => {
          return (
            <View
              key={index}
              style={[
                {
                  flex: column.width,
                  backgroundColor: '#DCE1E7',
                  height: 'auto',
                },
                styles.cell,
              ]}>
              <Text style={[fs_12_500, text_black, text_center]}>
                {column.title}
              </Text>
            </View>
          );
        })}
      </View>
      <FlatList
        scrollEnabled={false}
        data={data}
        renderItem={({item}) => {
          return (
            <View style={[styles.row]}>
              {columns.map((column: any, index: any) => {
                return (
                  <View
                    key={index}
                    style={[
                      {
                        flex: column.width,
                        backgroundColor: '#FFF',
                        height: 'auto',
                      },
                      styles.cell,
                    ]}>
                    {column.key === 'checkIn' ? (
                      <Text
                        style={[
                          fs_12_400,
                          item.checkin_late < 0 ? text_red : text_black,
                          text_center,
                        ]}>
                        {item[column.key]}
                      </Text>
                    ) : column.key === 'checkOut' ? (
                      <Text
                        style={[
                          fs_12_400,
                          item.checkout_early < 0 ? text_red : text_black,
                          text_center,
                        ]}>
                        {item[column.key]}
                      </Text>
                    ) : (
                      <Text style={[fs_12_400, text_black, text_center]}>
                        {item[column.key]}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  cell: {
    paddingVertical: 7,
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
  },
});

AttendanceHistoryTable.propTypes = {
  data: PropTypes.array.isRequired,
};
