import { Select, MenuItem, Link, TextField, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Footer } from './Footer';
import axios from 'axios';

export function SegmentComponent() {
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [availableMenuItems, setAvailableMenuItems] = useState([
    'First Name',
    'Last Name',
    'Gender',
    'Age',
    'Account Name',
    'City',
    'State'
  ])

  // const addValue = (value) => {
  //   setSelectedValue(value)
  //   setSelectedItems([...selectedItems, selectedValue]);
  // }

  const handleAdd = () => {
    if (selectedValue && !selectedItems.includes(selectedValue)) {
      setSelectedItems([...selectedItems, selectedValue]);
      console.log(selectedValue, availableMenuItems);

      setAvailableMenuItems(availableMenuItems.filter((option) => option !== selectedValue));
      setSelectedValue('');
    }
  };

  const handleCancel = () => {
    setSelectedValue('');
    setSelectedItems([]);
    setSegmentName('');
    setAvailableMenuItems([
      'First Name',
      'Last Name',
      'Gender',
      'Age',
      'Account Name',
      'City',
      'State'
    ])
  };

  const [segmentName, setSegmentName] = useState('');

  const handleSegmentName = (e) => {
    setSegmentName(e.target.value);
  };

  const handleChange = async () => {
    if (selectedValue && !selectedItems.includes(selectedValue)) {
      setSelectedItems([...selectedItems, selectedValue]);
    }
  };

  // Maintain a separate state to store TextField values for each selected item
  const [textFieldValues, setTextFieldValues] = useState({
    'First Name': 'first_name',
    'Last Name': 'last_name',
    'Gender': 'gender',
    'Age': 'age',
    'Account Name': 'account_name',
    'City': 'city',
    'State': 'state'
  });

  const handleTextFieldChange = (label, value) => {
    // Update the TextField value for the corresponding label
    setTextFieldValues((prevValues) => ({
      ...prevValues,
      [label]: value,
    }));
  };

  useEffect(() => {
    handleChange()
  }, [selectedValue])

  const sendDataToServer = async () => {
    // Create an array of objects
    console.log(selectedItems);

    const schemaData = selectedItems.map((item) => ({
      [item]: textFieldValues[item],
    }));

    const dataToSend = {
      segment_name: segmentName,
      schema: schemaData
    }

    const SERVER_URL = "https://webhook.site/4175185f-1107-4c6a-aade-6d91a1c79f30"

    console.log(dataToSend);

    // Send the data to the server using an HTTP POST request
    // await axios
    //   .post(SERVER_URL, dataToSend)
    //   .then((response) => {
    //     console.log('Data sent successfully:', response.data);
    //     // Handle any success response from the server if needed
    //   })
    //   .catch((error) => {
    //     console.error('Error sending data to server:', error);
    //     // Handle any error from the server if needed
    //   });

    var authOptions = {
      method: 'post',
      url: SERVER_URL,
      data: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/json'
      },
      json: true
    };

    await axios(authOptions)
      .then((response) => {
        console.log('Data sent successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error sending data to server:', error);
      })

  }

  // console.log('1', selectedItems);

  return (
    <div>
      <Container>
        <Typography variant='subtitle1' marginTop="30px" fontWeight="500">Enter the Name of Segment</Typography>
        <TextField
          label="Name of the segment"
          variant="outlined"
          fullWidth
          margin="normal"
          size="small"
          value={segmentName}
          onChange={handleSegmentName}

        />
        <Typography variant='subtitle1' marginTop="30px" fontWeight="500" marginBottom="30px">
          To save your segment, you need to add the schemas to build the query
        </Typography>
        {selectedItems.map((item) => (
          <Select
            key={item}
            label={item}
            variant="outlined"
            fullWidth
            margin="normal"
            marginBottom="30px"
            size="small"
            value={textFieldValues[item] || ''}
            onChange={(e) => handleTextFieldChange(item, e.target.value)}
          />
        ))}
        <Select
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
          displayEmpty
          variant="outlined"
          fullWidth
          margin="normal"
        >
          <MenuItem value="" disabled>
            Select an option
          </MenuItem>
          {availableMenuItems.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <Link
          component="button"
          underline="always"
          variant="body1"
          sx={{ color: "cyan", padding: "20px 0 210px 0" }}
          onClick={() => {
            handleAdd();
            setSelectedValue('');
          }}
        >
          + Add Schema to Segment
        </Link>
      </Container>
      <Footer handleCancel={handleCancel} sendDataToServer={sendDataToServer} />
    </div>
  )
}