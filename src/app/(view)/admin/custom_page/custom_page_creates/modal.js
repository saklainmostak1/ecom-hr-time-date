'use client' 
 //ismile
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { HiTrash } from 'react-icons/hi';
import '../../../admin_layout/modal/fa.css'

const IconModalCustomBox = ({ index, names, handleInputChange, inputValue }) => {

    const [lgShow, setLgShow] = useState(false);
    const [icons, setIcons] = useState([]);
    const [selectedIcon, setSelectedIcon] = useState(inputValue.page_group_icon || ''); // Add this state to handle the selected icon.

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/faIcons`)
            .then(res => res.json())
            .then(data => setIcons(data));
    }, []);

    const [cart, setCart] = useState([]);

    const handleAddToCart = (data) => {
        setCart([...cart, data]);
        setSelectedIcon(data.fa);  // Update selected icon when adding it to the cart
        handleInputChange(index, { target: { name: names, value: data.fa } }); // Update parent component
    };

    const handleDeleteClick = () => {
        setCart([]);
        setSelectedIcon(''); // Clear selected icon
        handleInputChange(index, { target: { name: names, value: '' } }); // Notify parent to clear value
    };

    useEffect(() => {
        if (inputValue.page_group_icon) {
            setSelectedIcon(inputValue.page_group_icon);  // Ensure the input reflects the prop change.
        }
    }, [inputValue]);

    return (
        <div className='row '>
            <div className="input-group ml-3">
                <div className="input-group-prepend">
                    <button className="btn btn-sm btn-success icon_view" type="button">
                        <a
                            dangerouslySetInnerHTML={{ __html: selectedIcon }}
                        ></a>
                    </button>
                </div>
                <input
                    type="text"
                    className="form-control form-control-sm page_group_icon d-none"
                    name={names}
                    readOnly
                    placeholder="Enter Page Group Icon"
                    value={selectedIcon}  // Use state value to control the input
                    onChange={(event) => handleInputChange(index, event)}  // Use event to update parent
                />
                <div className="input-group-append">
                    <button
                        className="btn btn-sm btn-danger icon_clear"
                        type="button"
                        onClick={handleDeleteClick}
                    >
                        <HiTrash />
                    </button>

                    <button
                        onClick={() => setLgShow(true)}
                        className="btn btn-sm btn-secondary icon_modal"
                        type="button"
                    >
                        <i className="fas fa-search"></i> Icon
                    </button>
                </div>
            </div>

            <Modal
                className="text-black"
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Large Modal
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="mt-5">
                    <div className="row row-cols-2 row-cols-lg-6 row-cols-md-4 g-4 ">
                        {icons?.map((icon) => (
                            <div key={icon.id} className="mt-1" onClick={() => setLgShow(false)}>
                                <div onClick={() => handleAddToCart(icon)}>
                                    <div className="icon-el text-center bg-light m-1 p-1 show_fa_icon fs-3">
                                        <a
                                            className="fa-2xl"
                                            style={{ color: 'black' }}
                                            dangerouslySetInnerHTML={{ __html: icon.fa }}
                                        />
                                        <p className="fa-1x">
                                            <small>{icon.icon_name}</small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default IconModalCustomBox;