import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  fs_13_400,
  fs_13_500,
  fs_13_700,
  text_black,
  text_white,
} from '../../assets/style.ts';
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { dwtApi } from "../../api/service/dwtApi.ts";

export default function WorkStorageRowDetail({ data }: any) {
  const { data: unitData } = useQuery(['unit', data?.unit_id], async () => {
    const res = await dwtApi.getUnitById(data?.unit_id);
    return res.data;
  });
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={[fs_13_700, text_black, styles.title]}>Tên nhiệm vụ:</Text>
        <Text style={[fs_13_400, text_black, styles.value]}>
          {data?.name ?? ''}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[fs_13_700, text_black, styles.title]}>Mô tả:</Text>
        <Text style={[fs_13_400, text_black, styles.value]}>
          {data?.desc ?? ''}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[fs_13_700, text_black, styles.title]}>Thời gian:</Text>
        <Text style={[fs_13_400, text_black, styles.value]}>
          {dayjs(data?.start_time).format('DD/MM/YYYY')} -{' '}
          {dayjs(data?.end_time).format('DD/MM/YYYY')}
        </Text>
      </View>

      {
        data?.user &&
          <View style={styles.row}>
            <Text style={[fs_13_700, text_black, styles.title]}>
              Người đảm nhiệm:
            </Text>
            <Text style={[fs_13_400, text_black, styles.value]}>
              {data?.user?.name ?? ""}
            </Text>
          </View>
      }

      <View style={styles.row}>
        <Text style={[fs_13_700, text_black, styles.title]}>Mục tiêu:</Text>
        <Text style={[fs_13_400, text_black, styles.value]}>
          {data?.type === 1 ? '1 lần' : 'Đạt giá trị'}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[fs_13_700, text_black, styles.title]}>Giờ công:</Text>
        <Text style={[fs_13_400, text_black, styles.value]}>
          {data?.working_hours ?? 0} giờ
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[fs_13_700, text_black, styles.title]}>Chỉ tiêu:</Text>
        <Text style={[fs_13_400, text_black, styles.value]}>
          {data?.quantity}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[fs_13_700, text_black, styles.title]}>ĐVT:</Text>
        <Text style={[fs_13_400, text_black, styles.value]}>
          {unitData?.name ?? ""}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[fs_13_700, text_black, styles.title]}>Người giao:</Text>
        <Text style={[fs_13_400, text_black, styles.value]}>
          {data?.created_by?.name ?? ""}
        </Text>
      </View>

      {data.actual_state === 0 && (
        <View style={styles.listButton}>
          <TouchableOpacity
            onPress={async () => {
              if (data?.handleAcceptJob && data?.id) {
                await data.handleAcceptJob(data.id);
              }
            }}
            style={styles.button}
          >
            <Text style={[fs_13_500, text_white]}>Nhận việc</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderLeftColor: '#D9D9D9',
    borderLeftWidth: 1,
    borderRightColor: '#D9D9D9',
    borderRightWidth: 1,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    gap: 5,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    paddingLeft: 20,
  },
  title: {
    width: '40%',
  },
  value: {
    width: '60%',
  },
  listButton: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#BC2426',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
