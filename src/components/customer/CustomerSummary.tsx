import {ScrollView, StyleSheet, Text, View} from "react-native";
import PropTypes, {InferProps} from "prop-types";

export default function CustomerSummary(
    {
        totalCustomer,
        totalPotential,
        totalCare,
        totalCooperation
    }: InferProps<typeof CustomerSummary.propTypes>) {
    return (
        <ScrollView
            contentContainerStyle={styles.container}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
        >
            <View style={styles.box}>
                <Text style={styles.title}>{totalCustomer}</Text>
                <Text style={styles.description}>Tổng số khách hàng</Text>
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>{totalPotential}</Text>
                <Text style={styles.description}>Tiềm năng</Text>
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>{totalCare}</Text>
                <Text style={styles.description}>Đang chăm sóc</Text>
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>{totalCooperation}</Text>
                <Text style={styles.description}>Đang hợp tác</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
        padding: 15,
    },
    box: {
        width: 160,
        paddingVertical: 20,
        backgroundColor: 'rgba(0, 205, 150, 0.15)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        color: '#13C999',
        lineHeight: 28,
        letterSpacing: 1.2
    },
    description: {
        fontSize: 14,
        fontWeight: '500',
        color: '#13C999',
        letterSpacing: 0.28
    }
})

CustomerSummary.propTypes = {
    totalCustomer: PropTypes.number.isRequired,
    totalPotential: PropTypes.number.isRequired,
    totalCare: PropTypes.number.isRequired,
    totalCooperation: PropTypes.number.isRequired
}