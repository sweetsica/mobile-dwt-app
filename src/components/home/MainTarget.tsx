import {Text, View} from "react-native";
import {fs_15_700, text_center, text_red} from "../../assets/style.ts";

export default function MainTarget({ name, value, unit, tmpAmount }: any) {
    return (
        <View style={{
            width: '100%',
            borderRadius: 6,
            backgroundColor: '#FFF',
            paddingVertical: 10,
            borderColor: '#C02626',
            borderWidth: 1,
            elevation: 5,
            shadowColor: 'rgba(0, 0, 0, 0.25)',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            paddingHorizontal: 5,
            shadowOpacity: 0.25,
            shadowRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Text style={[fs_15_700, text_red, text_center]}>{name}: {tmpAmount ?? 0}/{value}{unit}</Text>
        </View>
    );
}