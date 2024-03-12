import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {StyleSheet, View} from 'react-native';
import {fs_14_400, text_black} from '../../../assets/style.ts';
import PropTypes, {InferProps} from 'prop-types';

export default function PrimaryCheckbox({
                                            label,
                                            checked,
                                            onChange,
                                            labelStyle,
                                            disabled
                                        }: InferProps<typeof PrimaryCheckbox.propTypes>) {
    return (
        <View style={styles.wrapper}>
            <BouncyCheckbox
                size={20}
                text={label}
                hitSlop={10}
                unfillColor={'#FFFFFF'}
                fillColor={'#CA1F24'}
                innerIconStyle={
                    disabled ? styles.disabledOuterIconStyle :
                        (!checked ? styles.outerIconStyle : styles.outerIconSelectStyle)
                }
                iconComponent={
                    <View
                        style={
                            disabled ? styles.disabledInnerIconStyle :
                                (checked ? styles.innerIconSelectStyle : styles.innerIconStyle)
                        }
                    />
                }
                isChecked={checked}
                textStyle={[labelStyle, {textDecorationLine: 'none'}]}
                onPress={(isChecked: boolean) => onChange(isChecked)}
                disabled={disabled ? disabled : false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    outerIconStyle: {
        borderColor: '#dadada',
        borderWidth: 1,
    },
    outerIconSelectStyle: {
        borderColor: '#CA1F24',
        borderWidth: 1,
    },
    innerIconStyle: {
        backgroundColor: '#FFF',
        width: '100%',
        height: '100%',
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#FFF',
    },
    innerIconSelectStyle: {
        backgroundColor: '#CA1F24',
        width: '100%',
        height: '100%',
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#FFF',
    },
    disabledOuterIconStyle: {
        borderColor: '#787878',
        borderWidth: 1,
    },
    disabledInnerIconStyle: {
        backgroundColor: '#787878',
        width: '100%',
        height: '100%',
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#fff',
    },
});

PrimaryCheckbox.propTypes = {
    label: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    labelStyle: PropTypes.object,
    disabled: PropTypes.bool
};

PrimaryCheckbox.defaultProps = {
    labelStyle: {
        fontSize: 14,
        fontWeight: '400',
        color: '#000',
    },
    disabled: false
};
