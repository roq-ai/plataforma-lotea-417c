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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createTerrain } from 'apiSdk/terrains';
import { Error } from 'components/error';
import { terrainValidationSchema } from 'validationSchema/terrains';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ProjectInterface } from 'interfaces/project';
import { UserInterface } from 'interfaces/user';
import { getProjects } from 'apiSdk/projects';
import { getUsers } from 'apiSdk/users';
import { TerrainInterface } from 'interfaces/terrain';

function TerrainCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: TerrainInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createTerrain(values);
      resetForm();
      router.push('/terrains');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<TerrainInterface>({
    initialValues: {
      contour: '',
      map_id: (router.query.map_id as string) ?? null,
      surveyor_id: (router.query.surveyor_id as string) ?? null,
    },
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
            Create Terrain
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
    operation: AccessOperationEnum.CREATE,
  }),
)(TerrainCreatePage);
