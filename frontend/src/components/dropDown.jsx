import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const DropdownMenu = (defaultOption) => {
  const defaultValue = { value: defaultOption.defaultOption.country, label: defaultOption.defaultOption.country}
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const options = [
    { value: 'Brazil', label: 'Brazil' },
    { value: 'Poland', label: 'Poland' },
    { value: 'Bulgaria', label: 'Bulgaria' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Romania', label: 'Romania' },
  ];
  const handleChange = (selectedOption) => {
    window.location.href = `/${selectedOption.value}`
  };

  return (
    <div className="w-fit z-20">
      <Select
        options={options}
        onChange={handleChange}
        value={selectedValue}
        defaultValue={selectedValue}
      />
    </div>
  );
};

export default DropdownMenu;
