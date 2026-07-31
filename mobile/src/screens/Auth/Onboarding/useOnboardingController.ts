import { useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../../../redux/hook/hook";
import { setOnboarded } from "../../../redux/slice/generalSlice";
export default function useOnboardingController() {
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();

    const getStarted = () => {
        dispatch(setOnboarded(true));
    };
    const signIn = () => {
        navigation.navigate("Login");
    };

    return {
        values: {},
        functions: {
            getStarted,
            signIn,
        },
    };
}
