import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../../../redux/Apis/Auth";

const validationSchema = Yup.object({
  email: Yup.string().email("Enter a valid email address").required("Email is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
});

export default function useLoginController() {
  const [login, { isLoading }] = useLoginMutation();
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await login({ email: values.email.trim().toLowerCase(), password: values.password }).unwrap();
      } catch {
        // API failures are presented consistently by the global RTK Query middleware.
      }
    },
  });

  return { values: { formik, isLoading }, functions: { submit: formik.handleSubmit } };
}
