import { PartialRecord } from "react-better-core";

import { useForm } from "./hooks";

export const getFormErrorObject = <FormFields extends ReturnType<typeof useForm>["values"]>(
   formValues: FormFields,
): PartialRecord<keyof FormFields, string> => {
   return {};
};
