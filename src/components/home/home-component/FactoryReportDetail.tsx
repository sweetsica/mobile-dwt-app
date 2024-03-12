import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {
    fs_10_400,
    fs_10_500,
    fs_12_400, fs_12_500, mt10,
    row_between,
    text_black,
    text_center, text_gray,
    text_white
} from "../../../assets/style.ts";
import dayjs from "dayjs";

export default function FactoryReportDetail({data, navigation}: any) {
    return (
        <TouchableOpacity
            style={styles.boxContainer}
            onPress={() => {
                navigation.navigate('ProjectWorkDetail', {
                    data: data.project_work_id,
                });
            }}
        >
            <View style={row_between}>
                <View style={[styles.button,
                    {
                        backgroundColor:
                            data?.type === 1 ? '#C02626' : '#7CB8FF',
                    }]}>
                    <Text style={[fs_10_500, text_white, text_center]}>
                        {data?.user_name} {data?.type === 1 ? '(GV)' : '(TK)'}
                    </Text>
                </View>
                <Text style={[fs_10_500, text_gray]}>{dayjs(data?.logDate).format('DD/MM/YYYY')}</Text>
            </View>
            <Text style={[fs_12_400, text_black]}>
                <Text style={[data?.type === 1 ? fs_12_400 : fs_12_500]}>Báo cáo: </Text>
                {data?.content}
            </Text>
            {
                data?.mechanic_target_reports.length > 0 && (
                    <View>
                        <Text style={[fs_12_500, text_black]}>Hoàn thành: </Text>
                        {
                            data?.mechanic_target_reports.map((report: any, index: number) => {
                                const name = report?.mechanic_target?.name;
                                const mechanicUnit = report?.unit_name;
                                const amount = report?.amount;
                                const code = report?.mechanic_target?.code;
                                const total = report?.total_kpi;
                                return (
                                    <Text key={report.id}
                                          style={[fs_12_400, text_black]}> • {amount} {mechanicUnit} {name} ({code})
                                        = {total} KPI</Text>
                                )
                            })
                        }
                    </View>
                )
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    boxContainer: {
        width: '100%',
        borderRadius: 12,
        backgroundColor: '#F4F4F4',
        paddingLeft: 15,
        paddingRight: 10,
        paddingVertical: 10,
        elevation: 5,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: {
            width: 1,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        gap: 5,
    },
    button: {
        borderRadius: 10,
        backgroundColor: '#DD0013',
        paddingVertical: 3,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});