import { StyleSheet, Text, View } from 'react-native';
import { text_center, text_red, fs_14_500 } from '../../assets/style.ts';
import PropTypes, { InferProps } from 'prop-types';
import PrimaryTable from '../common/table/PrimaryTable.tsx';
import { WORK_STATUS_COLOR } from '../../assets/constant.ts';
import { useNavigation } from '@react-navigation/native';
import dayjs from "dayjs";

const columns = [
  {
    key: 'index',
    title: 'STT',
    width: 0.1,
  },
  {
    key: 'name',
    title: 'Tên',
    width: 0.4,
  },
  {
    key: 'amount',
    title: 'Số lượng',
    width: 0.25,
  },
  {
    key: 'kpi',
    title: 'NS/KPI',
    width: 0.25,
  },
];
export default function WorkTable({
  listWork,
}: InferProps<typeof WorkTable.propTypes>) {
  const navigation = useNavigation();
  const date = dayjs().format('YYYY-MM')
  return (
    <PrimaryTable
      columns={columns}
      onRowPress={(item: any) => {
        // @ts-ignore
        navigation.navigate('WorkDetail', { data: item, date: date});
      }}
      data={listWork.map((item: any, index: number) => {
        return {
          ...item,
          index: index + 1,
          bgColor: item.actual_state
            ? // @ts-ignore
              WORK_STATUS_COLOR[item.actual_state]
            : '#FFF',
          isWorkArise: item.isWorkArise ? item.isWorkArise : false,
        };
      })}
    />
  );
}

WorkTable.propTypes = {
  listWork: PropTypes.array.isRequired,
};
