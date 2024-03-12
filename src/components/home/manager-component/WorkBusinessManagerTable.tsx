import { StyleSheet, View } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import PrimaryTable from '../../common/table/PrimaryTable.tsx';
import { WORK_STATUS_COLOR } from '../../../assets/constant.ts';
import { useNavigation } from '@react-navigation/native';

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
export default function WorkBusinessManagerTable({
  listWork,
    date
}: InferProps<typeof WorkBusinessManagerTable.propTypes>) {
  const navigation = useNavigation();
  return (
    <View style={styles.wrapper}>
      <PrimaryTable
        columns={columns}
        onRowPress={(item: any) => {
          // @ts-ignore
          navigation.navigate('WorkDetailDepartment', {
            data: item,
            managerWorkId: item.business_standard_id,
            date: date,
          });
        }}
        data={listWork.map((item: any, index: number) => {
          return {
            ...item,
            index: index + 1,
            amount: item.business_standard_quantity_display,
            kpi: item.business_standard_score_tmp,
            bgColor: item.actual_state
              ? // @ts-ignore
                WORK_STATUS_COLOR[item.actual_state]
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
    backgroundColor: '#F5F5F5',
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
});

WorkBusinessManagerTable.propTypes = {
  listWork: PropTypes.array.isRequired,
  date: PropTypes.string.isRequired,
};
