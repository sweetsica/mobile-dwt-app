import {StyleSheet, Text, View} from "react-native";
import {LIST_ABSENCE_TYPE, LIST_ABSENCE_TYPE_COLOR} from "../../assets/constant.ts";
import NoSalaryIcon from "../../assets/img/absence/no-salary.svg";
import WorkIcon from "../../assets/img/absence/work.svg";
import AllowIcon from "../../assets/img/absence/allow.svg";
import {fs_14_400, text_black, text_gray} from "../../assets/style.ts";

export default function AbsenceItem({ item, currentTabManager }: any) {
    return (
        <View
            style={[
                styles.item,
                {
                    backgroundColor: LIST_ABSENCE_TYPE_COLOR[item.type],
                },
            ]}
        >
            <View style={styles.leftItem}>
                {item.type === 1 ? (
                    <NoSalaryIcon width={30} height={30}/>
                ) : item.type === 2 ? (
                    <WorkIcon width={30} height={30}/>
                ) : (
                    item.type === 3 && <AllowIcon width={30} height={30}/>
                )}
            </View>
            <View style={[styles.rightItem]}>
                <View style={[styles.gap5, {flex: 0.4}]}>
                    {currentTabManager === 1 && (
                        <Text style={[fs_14_400, text_gray]}>Tên:</Text>
                    )}
                    <Text style={[fs_14_400, text_gray]}>Loại nghỉ:</Text>
                    <Text style={[fs_14_400, text_gray]}>Ngày áp dụng:</Text>
                    <Text style={[fs_14_400, text_gray]}>Ca nghỉ:</Text>
                    <Text style={[fs_14_400, text_gray]}>Lý do nghỉ:</Text>
                </View>
                <View style={[styles.gap5, {flex: 0.6}]}>
                    {currentTabManager === 1 && (
                        <Text style={[fs_14_400, text_black]}>
                            {item?.users?.name}
                        </Text>
                    )}
                    <Text style={[fs_14_400, text_black]}>
                        {LIST_ABSENCE_TYPE[item.type].label}
                    </Text>
                    <Text style={[fs_14_400, text_black]}>{item.date}</Text>
                    <Text style={[fs_14_400, text_black]}>
                        {item.absent_duration_type === 1
                            ? 'Sáng'
                            : item.absent_duration_type === 2
                                ? 'Chiều'
                                : 'Cả ngày'}
                    </Text>
                    <Text style={[fs_14_400, text_black]}>{item.note}</Text>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
    },
    content: {
        gap: 15,
        paddingTop: 10,
    },
    dropdown: {
        borderRadius: 5,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.25)',
    },
    item: {
        flexDirection: 'row',
        flex: 1,
        padding: 10,
        gap: 10,
    },
    leftItem: {
        flex: 0.1,
        justifyContent: 'center',
    },
    rightItem: {
        flex: 0.9,
        flexDirection: 'row',
    },
    gap5: {
        gap: 5,
    },
    filter_wrapper: {
        gap: 10,
        paddingHorizontal: 15,
    },
    align_end: {
        position: 'absolute',
        bottom: 10,
        right: 15,
        zIndex: 2,
    },
});