import {TextInput} from "react-native";
import {text_black, text_gray} from "../../../assets/style.ts";

export default function TimeInput({time, setTime}: any) {
    const mask = (value: string): string => {
        // replace non-numeric characters
        value = value.replace(/:|[a-zA-Z]/g, '');

        let totalCharactersInValue = value.length;

        if (totalCharactersInValue === 3) {
            return value.substr(0, 1) + ':' + value.substr(1);
        }

        if (totalCharactersInValue === 4) {
            return value.substr(0, 2) + ':' + value.substr(2);
        }

        return value;
    };

    return (
        <TextInput
            keyboardType="number-pad"
            maxLength={5}
            onChangeText={(text: string) => setTime(mask(text))}
            value={time}
            placeholder={'HH:mm'}
            placeholderTextColor={text_gray.color}
            style={{
                borderRadius: 6,
                backgroundColor: 'rgba(118, 118, 129, 0.12)',
                paddingVertical: 1,
                width: 60,
                textAlign: 'center',
                color: text_black.color,
                fontSize: 14
            }}
        />
    )
}