import { useFormik } from "formik";
import * as Yup from "yup";
import { useRegisterMutation } from "../../../redux/Apis/Auth";

const validationSchema = Yup.object({
  name: Yup.string().trim().min(2, "Name must be at least 2 characters").required("Name is required"),
  email: Yup.string().email("Enter a valid email address").required("Email is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
});

export default function useSignupController() {
  const [register, { isLoading }] = useRegisterMutation();
  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await register({ name: values.name.trim(), email: values.email.trim().toLowerCase(), password: values.password }).unwrap();
      } catch {
        // API failures are presented consistently by the global RTK Query middleware.
      }
    },
  });
  return { values: { formik, isLoading }, functions: { submit: formik.handleSubmit } };
}
