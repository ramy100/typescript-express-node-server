import * as yup from "yup";

export const loginValidationRules = yup.object().shape({
  email: yup.string().required("email is required").email("Invalid email"),
  password: yup.string().required().min(3).max(30),
});

export const registerValidationRules = loginValidationRules.shape({
  username: yup
    .string()
    .matches(
      /^[a-zA-Z0-9_]*$/,
      "username should contain only numbers and alphapits"
    )
    .min(3)
    .max(30)
    .required("user name required"),
  repeat_password: yup
    .string()
    .required("Please confirm password")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  avatar: yup.string(),
});
