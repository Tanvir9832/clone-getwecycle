import express from "express";
import * as Yup from "yup";
import { parseYupError } from "../../utils/helper";
import { failed } from "../../utils/response";
import { CreateServiceDTO, IFileRequest } from "@tanbel/homezz/types";

const app = express();
app.use(express.json());

const serviceSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  cover: Yup.mixed().required("Cover is required"),
  priceInputs: Yup.array()
    .of(
      Yup.object().shape({
        inputType: Yup.string().required("Input type is required"),
        name: Yup.string().required("Name is required"),
        label: Yup.string().required("Label is required"),
        unite: Yup.string().when("inputType", {
          is: "select",
          then: (schema) => schema.notRequired(),
          otherwise: (schema) => schema.required("Unite is required"),
        }),
        defaultValue: Yup.number().when("inputType", {
          is: "select",
          then: (schema) => schema.notRequired(),
          otherwise: (schema) => schema.required("Default value is required"),
        }),
        options: Yup.array()
          .of(
            Yup.object().shape({
              label: Yup.string().required("Label is required"),
              value: Yup.string().required("Value is required"),
            })
          )
          .when("inputType", {
            is: "select",
            then: (schema) => schema.required("Options is required"),
            otherwise: (schema) => schema.notRequired(),
          }),
      })
    )
    .required(),
  category: Yup.array().of(Yup.string()).required(),
});

export const serviceValidator = async (
  req: IFileRequest<CreateServiceDTO>,
  res,
  next
) => {
  try {
    const { category, priceInputs } = req.body;
    const categoryArray = JSON.parse(category);
    const priceInputsArray = JSON.parse(priceInputs);
    await serviceSchema.validate(
      {
        ...req.body,
        category: categoryArray,
        priceInputs: priceInputsArray,
        ...req.files,
      },
      { abortEarly: false }
    );
    next();
  } catch (error) {
    const err = parseYupError(error);
    res.status(400).json(failed({ issue: err }));
  }
};
