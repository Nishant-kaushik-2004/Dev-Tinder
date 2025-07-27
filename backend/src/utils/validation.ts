import validator from "validator"; // ✅ Default import
// validator is CjS module so directly destructuring at the import is not valid in ESM environment
const { isEmail, isAlpha, isStrongPassword } = validator;

export interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface loginInput {
  email: string;
  password: string;
}

export const signupDataValidation = ({
  firstName,
  lastName,
  email,
  password,
}: SignupInput) => {
  if (!isAlpha(firstName) || firstName.length < 3) return "Invalid firstName";
  else if (!isAlpha(lastName) || lastName.length < 3) return "Invalid lastName";
  else if (!isEmail(email)) return "Invalid email format";
  else if (
    !isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  )
    return "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol";
  return "";
};

export const loginDataValidation = ({ email, password }: loginInput) => {
  if (!isEmail(email)) return "Invalid email format";
  else if (
    !isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  )
    return "Password must be at least 8 characters long and includes uppercase, lowercase, number, and symbol";
  return "";
};

export const isEditValid = (edits) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(edits).every((field) =>
    allowedFields.includes(field)
  );

  return isEditAllowed;
};
