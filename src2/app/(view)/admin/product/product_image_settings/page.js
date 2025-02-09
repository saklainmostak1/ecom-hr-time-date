'use client' 
 //ismile
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';

const ImageSettingsProduct = () => {


    const [formData, setFormData] = useState({
        small: {
            name: '',
            ratio: '',
            height: '',
            width: ''
        },
        medium: {
            name: '',
            ratio: '',
            height: '',
            width: ''
        },
        mediumSmall: {
            name: '',
            ratio: '',
            height: '',
            width: ''
        }
    });
    console.log(formData)

    const handleChange = (e, formType) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [formType]: {
                ...prevState[formType],
                [name]: value
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_image_settings/product_image_settings_create`, formData)
            .then(response => {
                console.log(response.data.message);

                // setFormData('')
                // Handle success, e.g., show a success message to the user
            })
            .catch(error => {
                console.error('Error submitting form data:', error);
                // Handle error, e.g., show an error message to the user
            });
    };

    const page_group = localStorage.getItem('pageGroup')


    const [selectedOptionSmall, setSelectedOptionSmall] = useState('');

    const handleSelectChangeSmall = (e) => {
        setSelectedOptionSmall(e.target.value);
    };

    const [selectedOptionMedium, setSelectedOptionMedium] = useState('');

    const handleSelectChangeMedium = (e) => {
        setSelectedOptionMedium(e.target.value);
    };

    const [selectedOption, setSelectedOption] = useState('');

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
    };

    return (
        <div class="container-fluid">
            <div class="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class="body-content ">
                            {/* bg-light p-4 */}
                            <div class=" border-primary shadow-sm border-0">
                                <div class=" card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 class="card-title font-width-bold mb-0 card-header-color float-left mt-1">Product Image Settings</h5>
                                    <div class="card-title font-width-bold mb-0 card-header-color float-right">

                                        <Link href={`/Admin/product/product_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create Product</Link>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <form onSubmit={handleSubmit}>
                                        {/* <h4>For Small:</h4> */}
                                        <div>

                                            <div className="col-md-9 offset-md-1">
                                                <div className="form-group row student">

                                                    <label className="col-form-label col-md-2"><strong>Image Size:</strong></label>
                                                    <div className="col-md-10">
                                                        <select
                                                            required=""
                                                            name="ratio"
                                                            className="form-control form-control-sm mb-2"

                                                        >
                                                            <option value="">Select Image Size</option>
                                                            <option value="small">Small</option>
                                                            <option value="medium">Medium</option>
                                                            <option value="medium_small">Medium Small</option>
                                                        </select>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-md-9 offset-md-1">
                                                <div className="form-group row student">
                                                    <label className="col-form-label col-md-2"><strong>Name:</strong></label>
                                                    <div className="col-md-4">
                                                        <input
                                                            name="name"
                                                            type="text"
                                                            className="form-control form-control-sm alpha_space student_id"
                                                            placeholder="Name"
                                                            value={formData.small.name}
                                                            onChange={(e) => handleChange(e, 'small')}
                                                        />
                                                    </div>
                                                    <label className="col-form-label col-md-2"><strong>Ratio:</strong></label>
                                                    <div className="col-md-4">
                                                        <select
                                                            required=""
                                                            name="ratio"
                                                            className="form-control form-control-sm mb-2"
                                                            value={formData.small.ratio}
                                                            onChange={(e) => handleChange(e, 'small')}
                                                        >

                                                            <option value="">Select Ratio</option>
                                                            <option value="1">Enable</option>
                                                            <option value="0">Disable</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                {formData.small.ratio !== "0" && (
                                                    <div className="form-group row student">
                                                        <label className="col-form-label col-md-2"><strong>Height:</strong></label>
                                                        <div className="col-md-4">
                                                            <input
                                                                name="height"
                                                                type="number"
                                                                className="form-control form-control-sm alpha_space student_id"
                                                                placeholder="Height Px"
                                                                value={formData.small.height}
                                                                onChange={(e) => handleChange(e, 'small')}
                                                            />
                                                        </div>
                                                        <label className="col-form-label col-md-2"><strong>Width:</strong></label>
                                                        <div className="col-md-4">
                                                            <input
                                                                name="width"
                                                                type="number"
                                                                className="form-control form-control-sm alpha_space student_id"
                                                                placeholder="Width Px"
                                                                value={formData.small.width}
                                                                onChange={(e) => handleChange(e, 'small')}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {formData.small.ratio === "0" && (
                                                    <div className="form-group row student">
                                                        <label className="col-form-label col-md-2"><strong>Select One:</strong></label>
                                                        <div className="col-md-4">
                                                            <select
                                                                required=""
                                                                name="ratio"
                                                                className="form-control form-control-sm mb-2"
                                                                value={selectedOptionSmall}
                                                                onChange={handleSelectChangeSmall}
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="1">Height</option>
                                                                <option value="0">Width</option>
                                                            </select>
                                                        </div>
                                                        {selectedOptionSmall && (
                                                            <>

                                                                <label className="col-form-label col-md-2" htmlFor="inputValue"><strong>{selectedOptionSmall === '1' ? 'Height' : 'Width'}</strong>:</label>
                                                                <div className="col-md-4">
                                                                    <input
                                                                        value={selectedOptionSmall === '1' ? formData.small.height : formData.small.width}
                                                                        onChange={(e) => handleChange(e, 'small')}
                                                                        type="text"
                                                                        id="inputValue"
                                                                        name={selectedOptionSmall === '1' ? 'height' : 'width'}
                                                                        placeholder={`Enter ${selectedOptionSmall === '1' ? 'Height' : 'Width'}`}
                                                                        className="form-control form-control-sm mb-2"
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                        {/* {selectedOptionSmall && (
                                            <>

                                                <label className="col-form-label col-md-2" htmlFor="inputValue"><strong>{selectedOptionSmall === '1' ? 'Height' : 'Width'}</strong>:</label>
                                                <div className="col-md-4">
                                                    <input
                                                         value={selectedOptionSmall === '1' ? formData.small.height : formData.small.width}
                                                         onChange={(e) => handleChange(e, 'small')}
                                                        type="text"
                                                        id="inputValue"
                                                        name={selectedOptionSmall === '1' ? 'height' : 'width'}
                                                        placeholder={`Enter ${selectedOptionSmall === '1' ? 'Height' : 'Width'}`}
                                                        className="form-control form-control-sm mb-2"
                                                    />
                                                </div>
                                            </>
                                        )} */}



                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        <div className='border'></div>
                                        <div className='mt-4'>

                                            <div className="col-md-9 offset-md-1">
                                                <div className="form-group row student">

                                                    <label className="col-form-label col-md-2"><strong>Image Size:</strong></label>
                                                    <div className="col-md-10">
                                                        <select
                                                            required=""
                                                            name="ratio"
                                                            className="form-control form-control-sm mb-2"

                                                        >
                                                            <option value="">Select Image Size</option>
                                                            <option value="small">Small</option>
                                                            <option value="medium">Medium</option>
                                                            <option value="medium_small">Medium Small</option>
                                                        </select>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-md-9 offset-md-1">
                                                <div className="form-group row student">
                                                    <label className="col-form-label col-md-2"><strong>Name:</strong></label>
                                                    <div className="col-md-4">
                                                        <input
                                                            name="name"
                                                            type="text"
                                                            className="form-control form-control-sm alpha_space student_id"
                                                            placeholder="Name"
                                                            value={formData.medium.name}
                                                            onChange={(e) => handleChange(e, 'medium')}
                                                        />
                                                    </div>
                                                    <label className="col-form-label col-md-2"><strong>Ratio:</strong></label>
                                                    <div className="col-md-4">
                                                        <select
                                                            required=""
                                                            name="ratio"
                                                            className="form-control form-control-sm mb-2"
                                                            value={formData.medium.ratio}
                                                            onChange={(e) => handleChange(e, 'medium')}
                                                        >

                                                            <option value="">Select Ratio</option>
                                                            <option value="1">Enable</option>
                                                            <option value="0">Disable</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                {formData.medium.ratio !== "0" && (
                                                    <div className="form-group row student">
                                                        <label className="col-form-label col-md-2"><strong>Height:</strong></label>
                                                        <div className="col-md-4">
                                                            <input
                                                                name="height"
                                                                type="number"
                                                                className="form-control form-control-sm alpha_space student_id"
                                                                placeholder="Height Px"
                                                                value={formData.medium.height}
                                                                onChange={(e) => handleChange(e, 'medium')}
                                                            />
                                                        </div>
                                                        <label className="col-form-label col-md-2"><strong>Width:</strong></label>
                                                        <div className="col-md-4">
                                                            <input
                                                                name="width"
                                                                type="number"
                                                                className="form-control form-control-sm alpha_space student_id"
                                                                placeholder="Width Px"
                                                                value={formData.medium.width}
                                                                onChange={(e) => handleChange(e, 'medium')}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {formData.medium.ratio === "0" && (
                                                    <div className="form-group row student">
                                                        <label className="col-form-label col-md-2"><strong>Select One:</strong></label>
                                                        <div className="col-md-4">
                                                            <select
                                                                required=""
                                                                name="ratio"
                                                                className="form-control form-control-sm mb-2"
                                                                value={selectedOptionMedium}
                                                                onChange={handleSelectChangeMedium}
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="1">Height</option>
                                                                <option value="0">Width</option>
                                                            </select>
                                                        </div>
                                                        {selectedOptionMedium && (
                                                            <>

                                                                <label className="col-form-label col-md-2" htmlFor="inputValue"><strong>{selectedOptionMedium === '1' ? 'Height' : 'Width'}</strong>:</label>
                                                                <div className="col-md-4">
                                                                    <input
                                                                        value={selectedOptionMedium === '1' ? formData.medium.height : formData.medium.width}
                                                                        onChange={(e) => handleChange(e, 'medium')}
                                                                        type="text"
                                                                        id="inputValue"
                                                                        name={selectedOptionMedium === '1' ? 'height' : 'width'}
                                                                        placeholder={`Enter ${selectedOptionMedium === '1' ? 'Height' : 'Width'}`}
                                                                        className="form-control form-control-sm mb-2"
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                        {/* {selectedOption && (
                                            <>

                                                <label className="col-form-label col-md-2" htmlFor="inputValue"><strong>{selectedOption === '1' ? 'Height' : 'Width'}</strong>:</label>
                                                <div className="col-md-4">
                                                    <input
                                                         value={selectedOption === '1' ? formData.small.height : formData.small.width}
                                                         onChange={(e) => handleChange(e, 'small')}
                                                        type="text"
                                                        id="inputValue"
                                                        name={selectedOption === '1' ? 'height' : 'width'}
                                                        placeholder={`Enter ${selectedOption === '1' ? 'Height' : 'Width'}`}
                                                        className="form-control form-control-sm mb-2"
                                                    />
                                                </div>
                                            </>
                                        )} */}



                                                    </div>
                                                )}

                                            </div>
                                        </div>



                                        <div className='border'></div>
                                        <div className='mt-4'>

                                            <div className="col-md-9 offset-md-1">
                                                <div className="form-group row student">

                                                    <label className="col-form-label col-md-2"><strong>Image Size:</strong></label>
                                                    <div className="col-md-10">
                                                        <select
                                                            required=""
                                                            name="ratio"
                                                            className="form-control form-control-sm mb-2"

                                                        >
                                                            <option value="">Select Image Size</option>
                                                            <option value="small">Small</option>
                                                            <option value="medium">Medium</option>
                                                            <option value="medium_small">Medium Small</option>
                                                        </select>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-md-9 offset-md-1">
                                                <div className="form-group row student">
                                                    <label className="col-form-label col-md-2"><strong>Name:</strong></label>
                                                    <div className="col-md-4">
                                                        <input
                                                            name="name"
                                                            type="text"
                                                            className="form-control form-control-sm alpha_space student_id"
                                                            placeholder="Name"
                                                            value={formData.mediumSmall.name}
                                                            onChange={(e) => handleChange(e, 'mediumSmall')}
                                                        />
                                                    </div>
                                                    <label className="col-form-label col-md-2"><strong>Ratio:</strong></label>
                                                    <div className="col-md-4">
                                                        <select
                                                            required=""
                                                            name="ratio"
                                                            className="form-control form-control-sm mb-2"
                                                            value={formData.mediumSmall.ratio}
                                                            onChange={(e) => handleChange(e, 'mediumSmall')}
                                                        >

                                                            <option value="">Select Ratio</option>
                                                            <option value="1">Enable</option>
                                                            <option value="0">Disable</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                {formData.mediumSmall.ratio !== "0" && (
                                                    <div className="form-group row student">
                                                        <label className="col-form-label col-md-2"><strong>Height:</strong></label>
                                                        <div className="col-md-4">
                                                            <input
                                                                name="height"
                                                                type="number"
                                                                className="form-control form-control-sm alpha_space student_id"
                                                                placeholder="Height Px"
                                                                value={formData.mediumSmall.height}
                                                                onChange={(e) => handleChange(e, 'mediumSmall')}
                                                            />
                                                        </div>
                                                        <label className="col-form-label col-md-2"><strong>Width:</strong></label>
                                                        <div className="col-md-4">
                                                            <input
                                                                name="width"
                                                                type="number"
                                                                className="form-control form-control-sm alpha_space student_id"
                                                                placeholder="Width Px"
                                                                value={formData.mediumSmall.width}
                                                                onChange={(e) => handleChange(e, 'mediumSmall')}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {formData.mediumSmall.ratio === "0" && (
                                                    <div className="form-group row student">
                                                        <label className="col-form-label col-md-2"><strong>Select One:</strong></label>
                                                        <div className="col-md-4">
                                                            <select
                                                                required=""
                                                                name="ratio"
                                                                className="form-control form-control-sm mb-2"
                                                                value={selectedOption}
                                                                onChange={handleSelectChange}
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="1">Height</option>
                                                                <option value="0">Width</option>
                                                            </select>
                                                        </div>
                                                        {selectedOption && (
                                                            <>

                                                                <label className="col-form-label col-md-2" htmlFor="inputValue"><strong>{selectedOption === '1' ? 'Height' : 'Width'}</strong>:</label>
                                                                <div className="col-md-4">
                                                                    <input
                                                                        value={selectedOption === '1' ? formData.mediumSmall.height : formData.mediumSmall.width}
                                                                        onChange={(e) => handleChange(e, 'mediumSmall')}
                                                                        type="text"
                                                                        id="inputValue"
                                                                        name={selectedOption === '1' ? 'height' : 'width'}
                                                                        placeholder={`Enter ${selectedOption === '1' ? 'Height' : 'Width'}`}
                                                                        className="form-control form-control-sm mb-2"
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                        {/* {selectedOption && (
                                            <>

                                                <label className="col-form-label col-md-2" htmlFor="inputValue"><strong>{selectedOption === '1' ? 'Height' : 'Width'}</strong>:</label>
                                                <div className="col-md-4">
                                                    <input
                                                         value={selectedOption === '1' ? formData.small.height : formData.small.width}
                                                         onChange={(e) => handleChange(e, 'small')}
                                                        type="text"
                                                        id="inputValue"
                                                        name={selectedOption === '1' ? 'height' : 'width'}
                                                        placeholder={`Enter ${selectedOption === '1' ? 'Height' : 'Width'}`}
                                                        className="form-control form-control-sm mb-2"
                                                    />
                                                </div>
                                            </>
                                        )} */}



                                                    </div>
                                                )}

                                            </div>
                                        </div>


                                        <div className="form-group row">
                                            <div className="offset-md-3 col-sm-6">
                                                <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                            </div>
                                        </div>
                                    </form>
                                    <div class="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
                                        <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageSettingsProduct;