import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/header/Header.tsx';
import {useState} from 'react';
import AdminTabBlock from '../../components/common/tab/AdminTabBlock.tsx';
import {useConnection} from '../../redux/connection';
import PersonalReport from '../../components/daily-report/PersonalReport.tsx';
import DepartmentReport from '../../components/daily-report/DepartmentReport.tsx';

export default function DailyReport({navigation}: any) {
    const {
        connection: {currentTabManager},
    } = useConnection();

    return (
        <SafeAreaView style={styles.wrapper}>
            <AdminTabBlock
                secondLabel={'Quản lý'}
            />
            <Header title={'Báo cáo ngày'} handleGoBack={() => navigation.goBack()}/>
            {currentTabManager === 0 ? <PersonalReport/> : <DepartmentReport/>}
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
