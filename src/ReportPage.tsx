import React, { useState } from 'react';
import {
    TextField,
    Dropdown,
    DefaultButton,
    Stack,
    Label,
    Image,
    ImageFit,
    PrimaryButton,
    DatePicker,
    defaultDatePickerStrings,
} from '@fluentui/react';

import './ReportPage.css'
import { useNavigate } from 'react-router-dom';


const categoryOptions = [
  { key: 'electronics', text: 'Electronics' },
  { key: 'furniture', text: 'Furniture' },
  { key: 'clothing', text: 'Clothing' },
  { key: 'other', text: 'Other' },
];

const stackTokens = { childrenGap: 15 };

const textBoxStyles = {
    root: {
        width: '100%'
    }
}

export const ReportPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: null,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSubmit = () => {
    console.log('Submitting listing:', formData);
    console.log('Uploaded image:', imageFile);
    // Handle form submission to server or API
  };
    const navigate = useNavigate();

  const handleCancel = () => {
      navigate('/');
  };

    
    return (
        <div>
            <Stack tokens={stackTokens} horizontalAlign='center' verticalAlign='center'>
                <div className="mainBoxWrapper">
                    <h1>Report a Lost Item</h1>
                    <div className="mainBox">
                        <div className="contentContainer">
                            <div className="imageBoxWrapper">
                                <Label>Upload Image</Label>
                                <div className="imageBox">
                                    <input type="file" accept="image/*" />
                                    {imagePreview && (
                                    <Image
                                        src={imagePreview}
                                        imageFit={ImageFit.cover}
                                        alt="Preview"
                                        styles={{ root: 
                                            { 
                                                marginTop: 10,
                                                width: '' 
                                            } 
                                        }}
                                    />
                                )}
                                </div>
                            </div>
                            <div className="textSide">
                                <Stack className="textFields" styles={textBoxStyles}>
                                    <TextField
                                        label="Title"
                                        name="title"
                                        value={formData.title}

                                        required
                                    />
                                    <TextField
                                        label="Describe what you are looking for"
                                        name="description"
                                        value={formData.description}

                                        multiline
                                        rows={4}
                                        required
                                        styles={
                                            {
                                                fieldGroup: { height: 120 },
                                                field: { height: '100%', overflow: 'auto'}
                                            }
                                        }
                                    />
                                    <DatePicker
                                        label="When did you lose your item?"
                                        placeholder="Select a date..."
                                        ariaLabel="Select a date"
                                        // DatePicker uses English strings by default. For localized apps, you must override this prop.
                                        strings={defaultDatePickerStrings}
                                        
                                    />
                                    <Dropdown
                                        label="Category"
                                        selectedKey={formData.category}
                                        options={categoryOptions}
                                        placeholder="Select a category"
                                        required
                                    />
                                </Stack>

                                <div className="bottomButtonWrapper">
                                    <div className="bottomButtons">
                                        <DefaultButton text="Cancel" onClick={handleCancel} />
                                        <PrimaryButton text="Submit Listing" onClick={handleSubmit} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Stack>
        </div>
    );
}