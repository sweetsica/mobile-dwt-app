import { StyleSheet, Text, View } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import PrimaryTable from '../../common/table/PrimaryTable.tsx';
import {WORK_OFFICE_STATUS_COLOR, WORK_STATUS_COLOR} from '../../../assets/constant.ts';
import { useNavigation } from "@react-navigation/native";

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
export default function WorkOfficeManagerTable({
  listWork,
}: InferProps<typeof WorkOfficeManagerTable.propTypes>) {
  const navigation = useNavigation();
  return (
    <View style={styles.wrapper}>
      <PrimaryTable
        columns={columns}
        onRowPress={(item: any) => {
          // @ts-ignore
          navigation.navigate('WorkDetailOffice', {
            data: item,
          });
        }}
        data={listWork.map((item: any, index: number) => {
          return {
            ...item,
            index: index + 1,
            amount: item.quantity_display,
            kpi: item.kpiValue,
            bgColor: item.work_status
              ? // @ts-ignore
                WORK_OFFICE_STATUS_COLOR[item.work_status]
              : '#FFF',
          };
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
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
    padding: 7,
    gap: 10,
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

WorkOfficeManagerTable.propTypes = {
  listWork: PropTypes.array.isRequired,
};
