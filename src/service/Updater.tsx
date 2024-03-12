import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useEffect} from "react";
import {dwtApi} from "../api/service/dwtApi.ts";
import {LIST_BUSINESS_DEPARTMENT, LIST_FACTORY_DEPARTMENT, LIST_OFFICE_DEPARTMENT} from "../assets/constant.ts";
import {useConnection} from "../redux/connection";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function updater<T>(Component: React.ComponentType<any>) {
    return function (props: any) {
        const {onSetListDepartmentGroup} = useConnection();
        useEffect(() => {
            getListDepartmentGroup().then();
        }, []);
        const getListDepartmentGroup = async () => {
            try {
                const res = await dwtApi.getListDepartmentGroup();
                onSetListDepartmentGroup(res.data);
            } catch (err) {
                onSetListDepartmentGroup({
                    business: LIST_BUSINESS_DEPARTMENT,
                    office: LIST_OFFICE_DEPARTMENT,
                    mechan: LIST_FACTORY_DEPARTMENT,
                });
            }
        }
        return (
            <SafeAreaProvider>
                <Component {...props} />
            </SafeAreaProvider>
        );
    };
}
