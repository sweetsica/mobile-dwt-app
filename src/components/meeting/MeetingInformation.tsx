import {StyleSheet, Text, View} from 'react-native';
import {fs_15_400, fs_15_700, text_black} from '../../assets/style.ts';

export default function MeetingInformation({data}: any) {
    return (
        <View style={styles.wrapper}>
            {data.map((item: any, index: number) => {
                return (
                    <View style={styles.row} key={index}>
                        <View style={styles.left}>
                            <Text style={[fs_15_700, text_black]}>{item.label}:</Text>
                        </View>
                        <View style={styles.right}>
                            <Text style={[fs_15_400, text_black]}>{item.value}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#F3F4F4',
        gap: 7,
    },
    row: {
        flexDirection: 'row',
        gap: 3,
        flex: 1,
    },
    left: {
        flex: 0.3,
    },
    right: {
        flex: 0.7,
    },
});
