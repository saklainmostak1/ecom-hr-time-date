'use client' 
 //ismile
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { HiTrash } from 'react-icons/hi';
import '../fa.css'

const IconModal = ({ index, names, handleInputChange, inputValue }) => {

    const [lgShow, setLgShow] = useState(false);
    const [icons, setIcons] = useState([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/faIcons`)
            .then(res => res.json())
            .then(data => {
                setIcons(data)
            })
    }, [])

    const [cart, setCart] = useState([])
    const handleAddToCart = data => {

        const newCart = [...cart, data]
        setCart(newCart)

    }

    const iconValue = (cart?.map(c => c?.fa))

    const handleDeleteClick = () => {
        setCart([])
    };

    useEffect(() => {
        handleDeleteClick()
    }, [inputValue])

    console.log(icons)

    return (
        <div className='row px-1'>
            <div class="input-group ">
                <div class="input-group-prepend">
                    <button class="btn btn-sm btn-success icon_view" type="button"
                    >
                        <a
                            dangerouslySetInnerHTML={{ __html: iconValue[iconValue.length - 1] }}
                        ></a>
                    </button>
                </div>
                <input
                    type="text"
                    className="form-control form-control-sm page_group_icon"
                    name={names}
                    readOnly
                    placeholder="Enter Page Group Icon"
                    data-input={`icon[${index}]`}
                    defaultValue={iconValue[iconValue.length - 1]}
                    onChange={(event) => handleInputChange(index, event)}
                />
                <div class="input-group-append">
                    <button
                        className="btn btn-sm btn-danger icon_clear"
                        data-input={`icon[${index}]`}
                        type="button"
                        onClick={handleDeleteClick}
                        onChange={() => handleInputChange(index, { target: { name: { names }, value: '' } })}
                    >
                        <HiTrash />
                    </button>

                    <button
                        onClick={() => setLgShow(true)}
                        className="btn btn-sm btn-secondary icon_modal"
                        data-input={`icon[${index}]`}
                        type="button"
                    >
                        <i className="fas fa-search"></i> Icon
                    </button>
                </div>

            </div>
            <Modal
                className='text-black'
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
                <Modal.Body className='mt-5'>
                    <div className='row row-cols-2 row-cols-lg-6 row-cols-md-4 g-4 '>
                        {
                            icons?.map((icon) =>
                                <div key={icon.id} className='mt-1' onClick={() => setLgShow(false)} >
                                    <div   
                                        onClick={() => handleAddToCart(icon)} >

                                        <div className="icon-el text-center bg-light m-1 p-1 show_fa_icon fs-3 "
                                        
                                            onClick={() => handleAddToCart(icon)}
                                        >
                                            <a
                                            className='fa-2xl'
                                            style={{color:'black'}}
                                           
                                                dangerouslySetInnerHTML={{ __html: icon.fa }}
                                            >
                                               
                                            </a>
                                            <p className='fa-1x' ><small >{icon.icon_name}</small></p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </Modal.Body>
            </Modal>

        </div>
    );
};

export default IconModal;

