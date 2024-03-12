import {StyleSheet, Text, View} from 'react-native';
import {
  fs_12_400,
  fs_15_400,
  fs_15_700,
  text_black,
  text_red,
} from '../../assets/style.ts';

export default function SummaryReportBlock({data}: any) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.rowGap10}>
        <Text style={[fs_15_700, text_red]}>TỔNG HỢP BÁO CÁO</Text>
        <Text style={[fs_12_400, text_black, {fontStyle: 'italic'}]}>
          Kết quả tạm tính
        </Text>
      </View>
      <View style={styles.content}>
        {data.map((item: any, index: number) => {
          return (
            <View key={index}>
              <Text style={[fs_15_400, text_black]}>
                {item.label}: <Text style={[text_red]}>{item.value}</Text>
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 3,
    paddingLeft: 15,
  },
  wrapper: {
    width: '100%',
  },
  rowGap10: {
    flexDirection: 'row',
    gap: 10,
  },
});
