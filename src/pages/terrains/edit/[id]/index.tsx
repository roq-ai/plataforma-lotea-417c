import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getTerrainById, updateTerrainById } from 'apiSdk/terrains';
import { Error } from 'components/error';
import { terrainValidationSchema } from 'validationSchema/terrains';
import { TerrainInterface } from 'interfaces/terrain';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ProjectInterface } from 'interfaces/project';
import { UserInterface } from 'interfaces/user';
import { getProjects } from 'apiSdk/projects';
import { getUsers } from 'apiSdk/users';

function TerrainEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<TerrainInterface>(
    () => (id ? `/terrains/${id}` : null),
    () => getTerrainById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: TerrainInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateTerrainById(id, values);
      mutate(updated);
      resetForm();
      router.push('/terrains');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<TerrainInterface>({
    initialValues: data,
    validationSchema: terrainValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Terrain
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="contour" mb="4" isInvalid={!!formik.errors?.contour}>
              <FormLabel>Contour</FormLabel>
              <Input type="text" name="contour" value={formik.values?.contour} onChange={formik.handleChange} />
              {formik.errors.contour && <FormErrorMessage>{formik.errors?.contour}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<ProjectInterface>
              formik={formik}
              name={'map_id'}
              label={'Select Project'}
              placeholder={'Select Project'}
              fetcher={getProjects}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'surveyor_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'terrain',
    operation: AccessOperationEnum.UPDATE,
  }),
)(TerrainEditPage);
