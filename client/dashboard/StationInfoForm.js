import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Controls from '../components/controls/Controls';
import { useForm, Form } from '../components/useForm';
//import * as employeeService from "../../services/employeeService";

const initialFValues = {
  id: 0,
  charger_box_id: '',
  ocpp_protocol: '',
  registration_status: '',
  charge_point_vendor: '',
  charger_point_model: '',
  charger_point_serial_number: '',
  charger_box_serial_number: '',
  fw_version: '',
  fw_update_status: '',
  fw_update_timestamp: '',
  meter_type: '',
  meter_serial_number: '',
  diagnostics_status: '',
  diagnostics_timestamp: '',
  last_heartbeat_timestamp: '',
  description: '',
  note: '',
};

export default function StationForm(props) {
  const { addOrEdit, recordForEdit } = props;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('charger_box_id' in fieldValues)
      temp.charger_box_id = fieldValues.charger_box_id
        ? ''
        : 'This field is required.';
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == '');
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      addOrEdit(values, resetForm);
    }
  };

  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
      });
  }, [recordForEdit]);

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={12}>
          <Controls.Input
            name='charger_box_id'
            label='ChargeBox ID'
            value={values.charger_box_id}
          />
          <Controls.Input
            label='Ocpp Protocol'
            name='occp_protocol'
            defaultValue='No Information'
            value={values.occp_protocol}
            disabled
          />
          <Controls.Input
            label='Charge Point Vendor'
            name='charge_point_vendor'
            defaultValue='No Information'
            value={values.charge_point_vendor}
            disabled
          />
          <Controls.Input
            label='Charge Point Model'
            name='charge_point_model'
            defaultValue='No Information'
            value={values.charge_point_model}
            disabled
          />
          <Controls.Input
            label='Charge Point Serial'
            name='charger_point_serial_number'
            defaultValue='No Information'
            value={values.charger_point_serial_number}
            disabled
          />
          <Controls.Input
            label='Charge Box Serial'
            name='charger_box_serial_number'
            defaultValue='No Information'
            value={values.charger_box_serial_number}
            disabled
          />
          <Controls.Input
            label='Firmware Version'
            name='fw_version'
            defaultValue='No Information'
            value={values.fw_version}
            disabled
          />
          <Controls.Input
            label='Firmware Update Timestamp'
            name='fw_update_timestamp'
            defaultValue='No Information'
            value={values.fw_update_timestamp}
            disabled
          />
          <Controls.Input
            label='Iccid'
            name='iccid'
            defaultValue='No Information'
            value={values.iccid}
            disabled
          />
          <Controls.Input
            label='Imsi'
            name='imsi'
            defaultValue='No Information'
            value={values.imsi}
            disabled
          />
          <Controls.Input
            label='Meter Type'
            name='meter_type'
            defaultValue='No Information'
            value={values.meter_type}
            disabled
          />
          <Controls.Input
            label='Meter Serial Number'
            name='meter_serial_number'
            defaultValue='No Information'
            value={values.meter_serial_number}
            disabled
          />
          <Controls.Input
            label='Diagnostics Status'
            name='diagnostics_status'
            defaultValue='No Information'
            value={values.diagnostics_status}
            disabled
          />

          <Controls.Input
            label='Diagnostics Status'
            name='diagnostics_timestamp'
            defaultValue='No Information'
            value={values.diagnostics_timestamp}
            disabled
          />
          <Controls.Input
            label='Last Hearbeat Timestamp'
            name='last_heartbeat_timestamp'
            defaultValue='No Information'
            value={values.last_heartbeat_timestamp}
            disabled
          />

          <div>
            <Controls.Button type='submit' text='Submit' />
            <Controls.Button text='Reset' color='default' onClick={resetForm} />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
