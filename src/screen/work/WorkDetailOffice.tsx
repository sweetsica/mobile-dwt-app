import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import Header from '../../components/header/Header.tsx';
import {SafeAreaView} from 'react-native-safe-area-context';
import WorkDetailBlock from '../../components/work/WorkDetailBlock.tsx';
import SummaryReportBlock from '../../components/work/SummaryReportBlock.tsx';
import {
    fs_15_400,
    fs_15_700,
    text_black,
    text_red,
} from '../../assets/style.ts';
import WorkReportTable from '../../components/common/table/WorkReportTable.tsx';
import {useConnection} from '../../redux/connection';
import {WORK_STATUS, WORK_STATUS_OFFICE} from '../../assets/constant.ts';
import {useMemo, useState} from 'react';
import NoDataScreen from '../../components/common/no-data/NoDataScreen.tsx';
import {useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../api/service/dwtApi.ts';
import PrimaryLoading from '../../components/common/loading/PrimaryLoading.tsx';
import {useRefreshOnFocus} from '../../hook/useRefeshOnFocus.ts';
import dayjs from "dayjs";
import FileWebviewModal from "../../components/common/modal/FileWebviewModal.tsx";

export default function WorkDetailOffice({route, navigation}: any) {
    const {data} = route.params;
    const {
        connection: {userInfo},
    } = useConnection();
    const [isOpenViewFile, setIsOpenViewFile] = useState(false);
    const [listOpenFile, setListOpenFile] = useState([]);
    const {
        data: workDetailData = {},
        isLoading: isLoadingWorkDetail,
        refetch,
    } = useQuery(
        ['workDetailOffice', data.id],
        async ({queryKey}: any) => {
            if (data.isWorkArise) {
                const res = await dwtApi.getOfficeWorkAriseDetail(queryKey[1]);
                return res.data;
            } else {
                const res = await dwtApi.getOfficeWorkDetail(queryKey[1]);
                return res.data;
            }
        },
        {
            enabled: !!userInfo && !!data.id && !!userInfo.id,
        }
    );

    const workDetail = useMemo(() => {
        if (data.isWorkArise) {
            return {
                name: workDetailData?.name,
                desc: workDetailData?.description,
                workerName: workDetailData?.userName,
                startDate: workDetailData?.startDate,
                deadline: workDetailData?.deadline,
                workPerComplete: `${workDetailData?.manDay ?? 0} giờ (${
                    workDetailData?.kpiTmp ?? 1
                } KPI)`,
                criteria: workDetailData?.criteria,
                totalExpected: `${workDetailData?.criteria_required} ${workDetailData?.unit_name}`,
                totalExpectedKpi: workDetailData?.expected_kpi,
                workStatus: workDetailData.actual_state
                    ? // @ts-ignore
                    WORK_STATUS_OFFICE[workDetailData?.actual_state]
                    : WORK_STATUS_OFFICE[1],
                totalReport: workDetailData?.count_report,
                totalCompletedValue: `${workDetailData?.keysPassed} / ${workDetailData?.criteria_required}`,
                totalWorker: 1,
                totalTmpKpi: workDetailData?.kpiValue,
                managerComment: workDetailData?.managerComment,
                managerKpi: workDetailData?.managerManDay,
                targetLogs: workDetailData?.report_task_logs?.map((item: any) => {
                    return {
                        ...item,
                        date: dayjs(item.report_date).format('DD/MM/YYYY'),
                        criteria: item?.kpi_keys[0]?.name,
                        quantity: item?.kpi_keys[0]?.pivot?.quantity,
                    };
                }),
                reportLogs: workDetailData?.report_task_logs?.map((item: any) => {
                    const listFile = item?.files ?
                        item?.files?.split(',').map((file: any) => file.split('/').pop()).join(', ')
                        : '';
                    return {
                        ...item,
                        date: dayjs(item.report_date).format('DD/MM/YYYY'),
                        note: item?.note,
                        file: listFile,
                        listFileUrl: item?.files?.split(','),
                    };
                }),
            };
        }
        return {
            name: workDetailData?.target?.name,
            workType: workDetailData.name,
            desc: workDetailData?.target?.description,
            workerName: workDetailData?.user_name,
            startDate: workDetailData?.startDate,
            deadline: workDetailData?.deadline,
            workPerComplete: `${workDetailData?.manday ?? 0} giờ (${
                workDetailData?.kpiTmp
            } KPI)`,
            criteria: workDetailData?.criteria,
            totalExpected: `${workDetailData?.criteria_required} ${workDetailData?.unit_name}`,
            totalExpectedKpi: workDetailData?.expected_kpi,
            workStatus: workDetailData.actual_state
                ? // @ts-ignore
                WORK_STATUS_OFFICE[workDetailData?.actual_state]
                : WORK_STATUS_OFFICE[1],
            totalReport: workDetailData?.count_report,
            totalCompletedValue: `${workDetailData?.keysPassed} / ${workDetailData?.criteria_required}`,
            totalWorker: workDetailData?.users ? workDetailData?.users.length : 0,
            totalTmpKpi: workDetailData?.kpiValue,
            managerComment: workDetailData?.managerComment,
            managerKpi: workDetailData?.managerManDay,
            targetLogs: workDetailData?.targetLogs?.map((item: any) => {
                return {
                    ...item,
                    date: dayjs(item.reportedDate).format('DD/MM/YYYY'),
                    criteria: item?.targetLogDetails[0]?.kpiKeys[0]?.name,
                    quantity: item?.targetLogDetails[0]?.kpiKeys[0]?.quantity,
                };
            }),
            reportLogs: workDetailData?.targetLogs?.map((item: any) => {
                const listFile = item?.targetLogDetails[0]?.files ?
                    item?.targetLogDetails[0]?.files?.split(',').map((file: any) => file.split('/').pop()).join(', ')
                    : '';
                return {
                    ...item,
                    date: dayjs(item.reportedDate).format('DD/MM/YYYY'),
                    note: item?.targetLogDetails[0]?.note,
                    file: listFile,
                    listFileUrl: item?.targetLogDetails[0]?.files?.split(','),
                };
            }),
        };
    }, [workDetailData, data.isWorkArise]);

    useRefreshOnFocus(refetch);

    if (isLoadingWorkDetail) {
        return <PrimaryLoading/>;
    }
    if (!data) {
        return <NoDataScreen text={'Không có dữ liệu'}/>;
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <Header
                title="CHI TIẾT KẾ HOẠCH"
                handleGoBack={() => {
                    navigation.goBack();
                }}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                <WorkDetailBlock
                    data={[
                        {
                            label: 'Tên nhiệm vụ',
                            value: workDetail?.name,
                        },
                        (!data.isWorkArise && {
                            label: 'Thuộc định mức lao động',
                            value: workDetail?.workType,
                        }),
                        {
                            label: 'Mô tả',
                            value: workDetail?.desc,
                        },
                        {
                            label: 'Người đảm nhiệm',
                            value: workDetail?.workerName,
                        },
                        {
                            label: 'Ngày bắt đầu',
                            value: dayjs(workDetail?.startDate).format('DD/MM/YYYY'),
                        },
                        {
                            label: 'Thời hạn',
                            value: dayjs(workDetail?.deadline).format('DD/MM/YYYY'),
                        },
                        {
                            label: 'Giờ công 1 lượt hoàn thành',
                            value: workDetail?.workPerComplete,
                        },
                        {
                            label: 'Tiêu chí',
                            value: workDetail?.criteria,
                        },
                        {
                            label: 'Tổng giá trị dự kiến',
                            value: workDetail?.totalExpected,
                        },
                        {
                            label: 'Tổng KPI dự kiến',
                            value: workDetail?.totalExpectedKpi,
                        },
                        {
                            label: 'Trạng thái',
                            value: workDetail?.workStatus,
                        },
                    ]}
                />
                <SummaryReportBlock
                    data={[
                        {
                            label: 'Số báo cáo đã lập trong tháng',
                            value: workDetail?.totalReport + ' báo cáo',
                        },
                        {
                            label: `Giá trị đạt được trong tháng (${dayjs().month() + 1})`,
                            value: workDetail?.totalCompletedValue || '',
                        },
                        {
                            label: 'Số nhân sự thực hiện',
                            value: workDetail?.totalWorker + ' nhân sự',
                        },
                        {
                            label: 'Điểm KPI tạm tính',
                            value: workDetail?.totalTmpKpi || '',
                        },
                    ]}
                />

                <View style={styles.commentBlock}>
                    <Text style={[fs_15_700, text_red]}>NHẬN XÉT NHIỆM VỤ</Text>
                    <View style={styles.inputBox}>
                        <TextInput
                            style={[
                                styles.inputContent,
                                text_black,
                                fs_15_400,
                                styles.disableInput,
                            ]}
                            placeholderTextColor={'#787878'}
                            placeholder={workDetail?.managerComment || ''}
                            multiline={true}
                            editable={false}
                        />
                        <TextInput
                            style={[
                                styles.inputGrade,
                                text_black,
                                fs_15_400,
                                styles.disableInput,
                            ]}
                            placeholderTextColor={'#787878'}
                            placeholder={workDetail?.managerKpi || ''}
                            keyboardType="numeric"
                            editable={false}
                        />
                    </View>
                </View>

                <View style={styles.commentBlock}>
                    <Text style={[fs_15_700, text_red]}>
                        DANH SÁCH TIÊU CHÍ CÔNG VIỆC
                    </Text>
                    <WorkReportTable
                        columns={[
                            {
                                title: 'Ngày báo cáo',
                                key: 'date',
                                width: 0.3,
                            },
                            {
                                title: 'Tiêu chí',
                                key: 'criteria',
                                width: 0.5,
                            },
                            {
                                title: 'Giá trị',
                                key: 'quantity',
                                width: 0.2,
                            },
                        ]}
                        data={workDetail.targetLogs}
                    />
                </View>
                <View style={styles.commentBlock}>
                    <Text style={[fs_15_700, text_red]}>DANH SÁCH BÁO CÁO CÔNG VIỆC</Text>
                    <WorkReportTable
                        columns={[
                            {
                                title: 'Ngày báo cáo',
                                key: 'date',
                                width: 0.3,
                            },
                            {
                                title: 'Nội dung báo cáo',
                                key: 'note',
                                width: 0.5,
                            },
                            {
                                title: 'File',
                                key: 'file',
                                width: 0.2,
                            },
                        ]}
                        onCellPress={(item: any) => {
                            if (item.listFileUrl) {
                                setListOpenFile(item.listFileUrl);
                                setIsOpenViewFile(true)
                            }
                        }}
                        data={workDetail.reportLogs}
                    />
                </View>
            </ScrollView>
            <FileWebviewModal
                visible={isOpenViewFile}
                setVisible={setIsOpenViewFile}
                listFileUrl={listOpenFile}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        padding: 15,
        gap: 25,
    },
    commentBlock: {
        gap: 6,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
        width: '100%',
    },
    inputContent: {
        width: '70%',
        borderWidth: 1,
        borderColor: '#787878',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    inputGrade: {
        width: '30%',
        borderWidth: 1,
        borderColor: '#787878',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    disableInput: {
        backgroundColor: '#D9D9D9',
    },
});
