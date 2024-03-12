import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminTabBlock from '../../components/common/tab/AdminTabBlock.tsx';
import { useConnection } from '../../redux/connection';
import UserBusinessWork from "../../components/work/user/UserBusinessWork.tsx";
import ManagerBusinessWork from "../../components/work/manager/ManagerBusinessWork.tsx";
import UserOfficeWork from "../../components/work/user/UserOfficeWork.tsx";
import ManagerOfficeWork from "../../components/work/manager/ManagerOfficeWork.tsx";
import UserFactoryWork from "../../components/work/user/UserFactoryWork.tsx";
import ManagerFactoryWork from "../../components/work/manager/ManagerFactoryWork.tsx";

export default function Work({ navigation }: any) {
  const {
    connection: { userInfo, currentTabManager, listDepartmentGroup },
  } = useConnection();

  return (
    userInfo && (
      <SafeAreaView style={styles.wrapper}>
        <AdminTabBlock />
        {currentTabManager === 0 ? (
            listDepartmentGroup.business.includes(userInfo?.departement_id) ? (
            <UserBusinessWork navigation={navigation} />
          ) : listDepartmentGroup.office.includes(userInfo?.departement_id) ? (
            <UserOfficeWork navigation={navigation} />
          ) : listDepartmentGroup.mechan.includes(userInfo?.departement_id) ? (
            <UserFactoryWork navigation={navigation} />
          ) : null
        ) : listDepartmentGroup.business.includes(userInfo?.departement_id) ? (
          <ManagerBusinessWork navigation={navigation} />
        ) : listDepartmentGroup.office.includes(userInfo?.departement_id) ? (
          <ManagerOfficeWork navigation={navigation} />
        ) : listDepartmentGroup.mechan.includes(userInfo?.departement_id) ? (
          <ManagerFactoryWork navigation={navigation} />
        ) : null}
      </SafeAreaView>
    )
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    position: 'relative',
  },
});
