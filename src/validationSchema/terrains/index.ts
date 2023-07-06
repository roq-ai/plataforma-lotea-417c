import * as yup from 'yup';

export const terrainValidationSchema = yup.object().shape({
  contour: yup.string().required(),
  map_id: yup.string().nullable(),
  surveyor_id: yup.string().nullable(),
});
