import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AdminTabBlock from '../../components/common/tab/AdminTabBlock.tsx';
import {useConnection} from '../../redux/connection';
import Header from '../../components/header/Header.tsx';
import {useMemo, useState} from 'react';
import WorkDetailBlock from '../../components/work/WorkDetailBlock.tsx';
import {fs_15_700, text_red} from '../../assets/style.ts';
import WorkReportTable from '../../components/common/table/WorkReportTable.tsx';
import {useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../api/service/dwtApi.ts';
import dayjs from 'dayjs';
import LoadingActivity from '../../components/common/loading/LoadingActivity.tsx';

export default function ProjectWorkDetail({route, navigation}: any) {
    const {data} = route.params;
    const {data: projectWorkDetailData = {}, isLoading} = useQuery(
        ['dwtApi.getProductionDiaryDetail', data],
        ({queryKey}) => dwtApi.getProductionDiaryDetail(+queryKey[1])
    );
    const {data: projectWorkDetail = {}} = projectWorkDetailData;
    //normalization data
    // mỗi log có type 1 là giao việc, 2 là báo cáo
    // tuy nhiên hiển thị thì cần phải nhóm lại theo ngày báo cáo
    const workLogs = useMemo(() => {
        const logs = projectWorkDetail?.project_work_logs ?? [];
        const logsByDate: any[] = [];
        logs?.forEach((item: any) => {
            const index = logsByDate.findIndex(
                (log: any) => log?.logDate === item?.logDate
            );
            if (index === -1) {
                logsByDate.push({
                    logDate: item?.logDate,
                    logs: [item],
                });
            } else {
                logsByDate[index].logs.push(item);
            }
        });

        return logsByDate.sort((a, b) => {
            return dayjs(b?.logDate).valueOf() - dayjs(a?.logDate).valueOf();
        });
    }, [projectWorkDetail]);

    const listWorkReport = useMemo(() => {
        let listWorkReport: any[] = [];
        const listLogs = projectWorkDetail?.project_work_logs ?? [];
        listLogs.forEach((log: any) => {
            if (log?.mechanic_target_reports?.length > 0) {
                log?.mechanic_target_reports?.forEach((report: any) => {
                    listWorkReport.push(report);
                });
            }
        });
        return listWorkReport.sort((a, b) => {
            return dayjs(b?.created_at).valueOf() - dayjs(a?.created_at).valueOf();
        });
    }, [projectWorkDetail]);
    return (
        <SafeAreaView style={styles.wrapper}>
            <AdminTabBlock secondLabel={'Quản lý'}/>
            <Header
                title={'CHI TIẾT KẾ HOẠCH'}
                handleGoBack={() => navigation.goBack()}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <WorkDetailBlock
                    data={[
                        {
                            label: 'Tên kế hoạch',
                            value: projectWorkDetail?.name,
                        },
                        {
                            label: 'Mục tiêu',
                            value: projectWorkDetail?.goal,
                        },
                        {
                            label: 'Người triển khai',
                            value: projectWorkDetail?.assignee?.name,
                        },
                        {
                            label: 'Phòng ban',
                            value: projectWorkDetail?.assignee?.departement?.name,
                        },
                        {
                            label: 'Người giao việc',
                            value: projectWorkDetail?.assigner?.name,
                        },
                        {
                            label: 'Phòng ban',
                            value: projectWorkDetail?.assigner?.departement?.name,
                        },
                        {
                            label: 'Ngày bắt đầu',
                            value: dayjs(projectWorkDetail?.startDate).format('DD/MM/YYYY'),
                        },
                        {
                            label: 'Hạn hoàn thành',
                            value: dayjs(projectWorkDetail?.endDate).format('DD/MM/YYYY'),
                        },
                    ]}
                />
                <View style={styles.commentBlock}>
                    <Text style={[fs_15_700, text_red]}>DANH SÁCH TIÊU CHÍ CÔNG VIỆC</Text>
                    <WorkReportTable
                        columns={[
                            {
                                title: 'Ngày',
                                key: 'date',
                                width: 0.2,
                            },
                            {
                                title: 'Tiêu chí',
                                key: 'name',
                                width: 0.35,
                            },
                            {
                                title: 'Số lượng',
                                key: 'amount',
                                width: 0.2,
                            },
                            {
                                title: 'Kết quả',
                                key: 'kpi',
                                width: 0.25,
                            },
                        ]}
                        data={listWorkReport.map((item: any) => {
                            const date = dayjs(item?.created_at).format('DD/MM/YYYY');
                            const name = item?.mechanic_target?.name;
                            const amount = item?.amount;
                            const kpi = item?.total_kpi;
                            return {
                                key: item.id,
                                date,
                                name,
                                amount,
                                kpi: `${kpi} KPI`,
                            };
                        })}
                    />
                </View>

                <View style={styles.commentBlock}>
                    <Text style={[fs_15_700, text_red]}>DANH SÁCH BÁO CÁO CÔNG VIỆC</Text>
                    <WorkReportTable
                        columns={[
                            {
                                title: 'Ngày báo cáo',
                                key: 'logDate',
                                width: 3 / 11,
                            },
                            {
                                title: 'Người BC',
                                key: 'userName',
                                width: 2 / 11,
                            },
                            {
                                title: 'Nội dung GV',
                                key: 'assigneeContent',
                                width: 3 / 11,
                            },
                            {
                                title: 'Nội dung BC',
                                key: 'assignerContent',
                                width: 3 / 11,
                            },
                        ]}
                        data={workLogs.map((item: any) => {
                            const assigneeLog = item.logs.find((log: any) => log?.type === 1);
                            const assignerLog = item.logs.find((log: any) => log?.type === 2);
                            return {
                                key: item.id,
                                logDate: dayjs(item?.logDate).format('DD/MM/YYYY'),
                                userName: assignerLog?.user?.name,
                                assigneeContent: assigneeLog?.content,
                                assignerContent: assignerLog?.content,
                            };
                        })}
                    />
                </View>
            </ScrollView>
            <LoadingActivity isLoading={isLoading}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
    commentBlock: {
        gap: 6,
    },
    content: {
        padding: 15,
        gap: 25,
    },
});
