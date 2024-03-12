import {Pressable, StyleSheet, Text, View} from "react-native";
import {fs_15_700, text_red} from "../../assets/style.ts";

export default function InformationBox({listText, headerTitle, hasDot, textStyle, onPressItem}: any) {
    return (
        <View style={styles.wrapper}>
            <Text style={[fs_15_700, text_red]}>{headerTitle}</Text>
            <View style={styles.content}>
                {listText && listText.length > 0 && listText.map((item: any, index: number) => {
                    return (
                        <Pressable key={index} onPress={() => {
                            if(onPressItem) {
                                onPressItem(item)
                            }
                        }}>
                            <Text style={textStyle}>
                                {
                                    hasDot ? '• ' : null
                                }
                                {
                                    item
                                }
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        gap: 5,
    },
    content: {
        paddingLeft: 10,
        gap: 2,
    }
});