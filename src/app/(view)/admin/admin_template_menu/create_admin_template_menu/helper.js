
// 'use client'
// import React, { useState } from 'react';

// const App = () => {
//   const [url, setUrl] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('http://localhost:5002/convertToPDF', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ url }),
//       });

//       if (response.ok) {
//         const blob = await response.blob();
//         const pdfUrl = URL.createObjectURL(blob);
//         window.open(pdfUrl, '_blank');
//       } else {
//         console.error('Failed to convert to PDF:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h1>URL to PDF Converter</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           URL:
//           <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
//         </label>
//         <button type="submit">Convert to PDF</button>
//       </form>
//     </div>
//   );
// };

// export default App;
'use client'
import "./style.css";
import React, { useEffect, useState } from "react";
import Nestable from "react-nestable";
import "react-nestable/dist/styles/index.css";
import { FaAlignJustify, FaPlus, FaMinus, FaRegTrashAlt, FaPencilAlt, FaTrashAlt, FaInfoCircle, FaTrash, FaSearch, FaRegWindowClose } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Modal from 'react-bootstrap/Modal';
import { HiTrash } from 'react-icons/hi';
import '../../../admin_layout/modal/fa.css'
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "bootstrap-4-react/lib/components";
import axios from "axios";



const styles = {
  position: "relative",
  fontSize: "20px",
  border: "1px solid #B6E3F7",
  borderRadious: "10px",
  background: "white",
  color: "#333",
  cursor: "pointer"
};

const AdminTemplateMenu = ({ modal, setModal }) => {


  const { data: currentPosts = [], isLoading, refetch } = useQuery({
    queryKey: ['currentPosts'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/api/menu`);
      const data = await res.json();

      return data;
    },
  });

  // console.log(items)

  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(20)

  const lastPostIndex = currentPage * postsPerPage
  const firstPosIndex = lastPostIndex - postsPerPage
  const items = currentPosts.slice(firstPosIndex, lastPostIndex)

  let totalPosts = currentPosts.length
  let pages = []

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i)
  }

  // http://192.168.0.112:5002/menu_item/all



  const [lgShow, setLgShow] = useState(false);
  const [icons, setIcons] = useState([])
  const [inputValues, setInputValues] = useState([])

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newInputValues = [...inputValues];
    newInputValues[index][name] = value;
    setInputValues(newInputValues);
  };


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
  }, [])

  const handleDelete = id => {

    console.log(id)
    const proceed = window.confirm('Are You Sure delete')
    if (proceed) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin_template_table/delete/${id}`, {
        method: "DELETE",

      })
        .then(Response => Response.json())
        .then(data => {

          if (data.affectedRows > 0) {
            refetch()

            console.log(data)
          }
        })
    }
  }

  const [isEditClicked, setIsEditClicked] = useState(false);


  const [editId, seteditId] = useState([])

  const handleEditClick = (id) => {
    seteditId(id)
    setIsEditClicked(true);
  };

  console.log(editId)

  const [editProfile, setEditProfile] = useState(editId)

  const handleEditHome = event => {
    event.preventDefault()

    // ${process.env.NEXT_PUBLIC_API_URL}:5002/admin_template_table/update/${editId.id}
    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin_template_table/update/${editId.id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(editProfile)
    })
      .then(Response => Response.json())
      .then(data => {
        console.log(data)

        if (data.changedRows > 0) {
          refetch()
          Swal.fire(
            'Good job!',
            'You clicked the button!',
            'success'
          )
        }
        else {
          Swal.fire(
            'Good job!',
            'You clicked the button!',
            'error'
          )
        }

      })
  }

  const handleChange = event => {
    const field = event.target.name
    console.log(field)
    const value = event.target.value
    console.log(value)
    const review = { ...editProfile }
    review[field] = value
    setEditProfile(review)
  }



  const renderItem = ({ item, collapseIcon, handler }) => {
    const textColor = item.active === '1' ? 'red' : 'black';
    return (


      <div style={{ ...styles, color: textColor }}>
        {
          collapseIcon &&
          <button className="btn  rounded-0 btn-sm border border-secondary" style={{
            padding: '10px 5px', marginTop: '-1px', background: 'linear-gradient(to bottom, #ddd 0%, #bbb 100%)',

            border: '1px solid #6c757d',
            important: 'true',
          }}>
            {
              collapseIcon
            }

          </button>
        }
        {handler}


        <button className="mr-2" style={{
          background: 'linear-gradient(to bottom, #ddd 0%, #bbb 100%)',
          padding: '5px',
          border: '1px solid #6c757d',
          important: 'true',
        }}>

          <a class="btn btn-secondary rounded-0 btn-sm border border-secondary " style={{ marginTop: '1px' }}>
            <i class="fas fa-bars"></i>
          </a>
        </button>



        {item?.title_en}


        <button
          onClick={() => handleDelete(item.id)}
          class="btn btn-sm btn-danger icon_clear  float-right mt-2 mr-2"
          type="button"
          title='Delete'

          data-input="icon"

        ><FaTrashAlt ></FaTrashAlt >
        </button>

        <button
          onClick={() => handleEditClick(item)}
          class="btn btn-sm btn-info icon_clear  float-right mt-2 mr-2"
          type="button"
          title='Edit'
          data-input="icon" ><FaPencilAlt  ></FaPencilAlt >
        </button>



      </div>
    );
  };


  const [order, setOrder] = useState([]);
  const setParentIdRecursively = (items, parentId) => {
    return items.map((item) => {
      const updatedItem = { ...item, parent_id: parentId };

      if (item.children && item.children.length > 0) {
        updatedItem.children = setParentIdRecursively(item.children, item.id);
      }

      return updatedItem;
    });
  };

  const checkChildrenCountRecursively = (item, maxChildren) => {
    if (item.children.length > maxChildren) {
      return true;
    }

    for (const child of item.children) {
      if (checkChildrenCountRecursively(child, maxChildren)) {
        return true;
      }
    }

    return false;
  };

  const onChangeItem = (newItems) => {
    // Check if any item or its children have more than 3 children
    const hasMoreThanThreeChildren = newItems.items.some((item) =>
      checkChildrenCountRecursively(item, 3)
    );

    if (hasMoreThanThreeChildren) {
      alert('Each item or its children can have a maximum of 3 children. Please remove extra children.');
      return;
    } else {
      // Check if any item or its children have more than 10 children
      const hasMoreThanTenChildren = newItems.items.some((item) =>
        checkChildrenCountRecursively(item, 10)
      );

      if (hasMoreThanTenChildren) {
        alert('Each item or its children can have a maximum of 10 children. Please remove extra children.');
        return;
      } else {
        // Set parent_id for each child item using the recursive function
        const itemsWithParentId = setParentIdRecursively(newItems.items, null);

        setOrder({ items: itemsWithParentId });
      }
    }


  };
  console.log(JSON.stringify(order.items));

  const [isActive, setIsActive] = useState(false);


  const handleCheckboxChange = () => {

    setIsActive((prevIsActive) => !prevIsActive);
  };

  console.log(isActive)

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const title_en = form.title_en.value;
    const menu_id = form.menu_id.value;
    const floating_position = form.floating_position.value;
    const menu_icon = form.menu_icon.value;
    const link_path_type = form.link_path_type.value;
    const link_path = form.link_path.value;
    const active = form.active.value;



    const users = {
      title_en, admin_template_menu_id: menu_id, icon_align: floating_position, menu_icon, link_path_type, link_path, active
    };
    console.log(users)
   
    // ${process.env.NEXT_PUBLIC_API_URL}:5002/menu_item/create
    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/menu_item/create`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(users),
    })
      .then((Response) => Response.json())
      .then((data) => {
        refetch()
        console.log(data);
      })
      .catch((error) => console.error(error));
  };
  // console.log(order.items.length)
  // npm run dev -- -H 192.168.0.112



  const handleDeleteAndInsert = async () => {

    try {
      // Step 1: Delete all data
      const deleteResponse = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin_template_table/delete_all`);
      console.log('Data deleted:', deleteResponse.data);

      // Step 2: Insert data
      const dataArray = Array.isArray(menuData) ? menuData : [];
      const insertResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/insertData`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(dataArray),
      });

      const insertData = await insertResponse.json();
      refetch(); // Assuming refetch is a function to update your data after insert
      console.log('Data inserted:', insertData);
    } catch (error) {
      console.error('Error:', error);
      // Handle error or show an error message to the user
    }
  };

  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    setMenuData(order.items);
  }, [order.items]);

  console.log(menuData);



  return (

    <div class="bg-light border-primary shadow-sm border-0 overflow-hidden">
      <div>

        <textarea
          // className="d-none"
          value={JSON.stringify(order.items ? order.items : items)}
          rows="10"
          readOnly
          style={{ width: "100%" }}
        />





        <div class="card-header py-1 custom-card-header clearfix  text-white " style={{ color: '#fff', background: '#4267b2', borderColor: '#4267b2', }}>
          <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Menu</h5>
          <div class="card-title font-weight-bold mb-0 card-header-color float-right"> <a href="" class="btn btn-sm btn-info">Back to Admin Panel Settings Create</a></div>
        </div>
        <div className="d-lg-flex d-md-flex">

          <div class="card-body col-md-6" style={{ borderRight: '1px solid black' }}>
            <div class="w-100  border-bottom pb-1 d-flex justify-content-between mb-2">
              <h5 class="">Menu Item List</h5>
              <button
                onClick={handleDeleteAndInsert}
                class="reorder reordering float-right btn btn-sm btn-secondary">Re Order</button>
            </div>

            <div className="App">

              {
                isLoading ?

                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  :

                  <Nestable items={order.items ? order.items : items} renderItem={renderItem} onChange={onChangeItem} />
              }
            </div>


          </div>
          <div class="card-body ">
            {isEditClicked ?

              <form action="" onSubmit={handleEditHome}>

                <div class=" px-0">
                  <div class="w-100 clearfix border-bottom pb-1">
                    <h5 class="float-left mb-0 ">Menu Edit For {editId.title_en} </h5>
                  </div>

                  <div class="form-group row">
                    <div class="col-md-12 pt-2">
                      <label for="exampleInputEmail1" class="font-weight-bold">Item Name: </label>
                      <input
                        onChange={handleChange}
                        type="text" name="title_en" defaultValue={editId ? editId.title_en : ''} class="form-control form-control-sm  menu_en " placeholder="Enter Item Name" />
                    </div>
                  </div>
                  <div class="form-group row">
                    <div class="col-md-12">
                      <label for="exampleInputEmail1" class="font-weight-bold">Menu Icon:</label>
                      <div class="input-group input-group-sm">
                        <input
                          onChange={handleChange}
                          type="hidden" name="admin_template_menu_id" value="37" />
                        <select
                          onChange={handleChange}
                          name="icon_align" class="form-control form-control-sm floating_id trim">
                          <option value="float-left"> Left Align</option>
                          <option value="float-right"> Right Align</option>
                        </select>
                        <div class="input-group-prepend">
                          <button class="btn btn-sm btn-success icon_view" id="icon_view" type="button">
                            <a
                              dangerouslySetInnerHTML={{ __html: iconValue[iconValue.length - 1] }}
                            ></a>
                          </button>
                        </div>
                        <input type="text"

                          readOnly
                          name="menu_icon"
                          placeholder="Enter Page Group Icon"
                          defaultValue={iconValue[iconValue.length - 1]}

                          onChange={(event) => {
                            handleInputChange(index, event)

                          }}
                          class="form-control form-control-sm icon w-25 page_group_icon" />
                        <div class="input-group-append">
                          <button class="btn btn-sm btn-danger icon_clear"
                            type="button"
                            onClick={handleDeleteClick}
                            onChange={() => handleInputChange(index)}
                            data-input="icon" ><FaTrash ></FaTrash></button>
                          <button
                            onClick={() => setLgShow(true)}
                            className="btn btn-sm btn-secondary icon_modal"
                            type="button"
                          >
                            <FaSearch ></FaSearch> Icon
                          </button>

                          <span class="input-group-text " data-toggle="popover" title="" data-placement="top" data-content="Leave Blank. if you don't show icon." data-original-title="Info"><FaInfoCircle ></FaInfoCircle></span>
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
                                  <div className=''
                                    onClick={() => handleAddToCart(icon)} >

                                    <div className="icon-el text-center bg-light m-1 p-1 show_fa_icon fs-3"
                                      onClick={() => handleAddToCart(icon)}
                                    >
                                      <a
                                        dangerouslySetInnerHTML={{ __html: icon.fa }}
                                      ></a>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                          </div>
                        </Modal.Body>
                      </Modal>
                    </div>
                  </div>


                  <div class="form-group row">
                    <div class="col-md-12">
                      <label for="exampleInputEmail1" class="font-weight-bold">Link:</label>
                      <div class="input-group input-group-sm">
                        <select
                          onChange={handleChange}
                          class="form-control form-control-sm  link_type w-25" name="link_path_type" id="select_item">
                          <option value="1">External</option>
                          <option value="2">Front page</option>
                          <option value="3">No Link</option>
                          <option value="4">Content Reference</option>
                          <option value="5">Custom Content</option>
                        </select>
                        <input
                          onChange={handleChange}
                          defaultValue={editId.link_path}
                          name="link_path" type="text" class="form-control form-control-sm  select_result w-50" id="select_result" />
                        <input class="form-control form-control-sm  input_append_text search_link " id="menu" type="text" readonly="" />
                        <div class="input-group-append">
                          <span class="input-group-text search_icon" id="modal_call" data-id="menu" ><FaSearch ></FaSearch> </span>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div class="form-group row">
                    <div class="col-md-8">
                      <div class="checkbox">
                        <label>
                          <input

                            type="checkbox"
                            name="active"
                            className="check"
                            value={isActive ? 1 : 0}
                            checked={isActive}

                            onChange={(event) => {
                              handleCheckboxChange(event)

                            }}

                          /> Active
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="form-group row">
                    <div class="col-md-8">
                      <button class="btn btn-success btn-sm btn-primary">Create</button>

                    </div>
                    <div class="col-md-4">
                    </div>
                  </div>
                </div>
              </form>


              :


              <form action="" onSubmit={handleSubmit}>

                <div class=" px-0">
                  <div class="w-100 clearfix border-bottom pb-1">
                    <h5 class="float-left mb-0 ">Menu Create</h5>
                  </div>

                  <div class="form-group row">
                    <div class="col-md-12 pt-2">
                      <label for="exampleInputEmail1" class="font-weight-bold">Item Name:</label>
                      <input type="text" name="title_en" class="form-control form-control-sm  menu_en " placeholder="Enter Item Name" />
                    </div>
                  </div>
                  <div class="form-group row">
                    <div class="col-md-12">
                      <label for="exampleInputEmail1" class="font-weight-bold">Menu Icon:</label>
                      <div class="input-group input-group-sm">
                        <input type="hidden" class="menu_id" name="menu_id" value="37" />
                        <select name="floating_position" class="form-control form-control-sm floating_id trim">
                          <option value="float-left"> Left Align</option>
                          <option value="float-right"> Right Align</option>
                        </select>
                        <div class="input-group-prepend">
                          <button class="btn btn-sm btn-success icon_view" id="icon_view" type="button">
                            <a
                              dangerouslySetInnerHTML={{ __html: iconValue[iconValue.length - 1] }}
                            ></a>
                          </button>
                        </div>
                        <input type="text"
                          readOnly
                          name="menu_icon"
                          placeholder="Enter Page Group Icon"
                          defaultValue={iconValue[iconValue.length - 1]}
                          onChange={(event) => handleInputChange(index, event)}
                          class="form-control form-control-sm icon w-25 page_group_icon" />
                        <div class="input-group-append">
                          <button class="btn btn-sm btn-danger icon_clear"
                            type="button"
                            onClick={handleDeleteClick}
                            onChange={() => handleInputChange(index)}
                            data-input="icon" ><FaTrash ></FaTrash></button>
                          <button
                            onClick={() => setLgShow(true)}
                            className="btn btn-sm btn-secondary icon_modal"
                            type="button"
                          >
                            <FaSearch ></FaSearch> Icon
                          </button>

                          <span class="input-group-text " data-toggle="popover" title="" data-placement="top" data-content="Leave Blank. if you don't show icon." data-original-title="Info"><FaInfoCircle ></FaInfoCircle></span>
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
                                  <div className=''
                                    onClick={() => handleAddToCart(icon)} >

                                    <div className="icon-el text-center bg-light m-1 p-1 show_fa_icon fs-3"
                                      onClick={() => handleAddToCart(icon)}
                                    >
                                      <a
                                        dangerouslySetInnerHTML={{ __html: icon.fa }}
                                      ></a>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                          </div>
                        </Modal.Body>
                      </Modal>
                    </div>
                  </div>
                  <div class="form-group row">
                    <div class="col-md-12">
                      <label for="exampleInputEmail1" class="font-weight-bold">Link:</label>
                      <div class="input-group input-group-sm">
                        <select class="form-control form-control-sm  link_type w-25" name="link_path_type" id="select_item">
                          <option value="1">External</option>
                          <option value="2">Front page</option>
                          <option value="3">No Link</option>
                          <option value="4">Content Reference</option>
                          <option value="5">Custom Content</option>
                        </select>
                        <input name="link_path" type="text" class="form-control form-control-sm  select_result w-50" id="select_result" />
                        <input class="form-control form-control-sm  input_append_text search_link " id="menu" type="text" readonly="" />
                        <div class="input-group-append">
                          <span class="input-group-text search_icon" id="modal_call" data-id="menu" ><FaSearch ></FaSearch> </span>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div class="form-group row">
                    <div class="col-md-8">
                      <div class="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name="active"
                            className="check"
                            value={isActive ? 1 : 0}
                            checked={isActive}
                            onChange={handleCheckboxChange}
                          /> Active
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="form-group row">
                    <div class="col-md-8">
                      <button class="btn btn-success btn-sm btn-primary ok">Create</button>
                    </div>
                  </div>
                </div>
              </form>
            }

          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminTemplateMenu





{/* <div class="card-body ">
{isEditClicked ?

  <form action="" onSubmit={handleEditHome}>

    <div class=" px-0">
      <div class="w-100 clearfix border-bottom pb-1">
        <h5 class="float-left mb-0 ">Menu Edit For {editId.title_en} </h5>
      </div>

      <div class="form-group row">
        <div class="col-md-12 pt-2">
          <label for="exampleInputEmail1" class="font-weight-bold">Item Name: </label>
          <input
            onChange={handleChange}
            type="text" name="title_en" defaultValue={editId ? editId.title_en : ''} class="form-control form-control-sm  menu_en " placeholder="Enter Item Name" />
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-12">
          <label for="exampleInputEmail1" class="font-weight-bold">Menu Icon:</label>
          <div class="input-group input-group-sm">
            <input
              onChange={handleChange}
              type="hidden" name="admin_template_menu_id" value="37" />
            <select
              onChange={handleChange}
              name="icon_align" class="form-control form-control-sm floating_id trim">
              <option value="float-left"> Left Align</option>
              <option value="float-right"> Right Align</option>
            </select>
            <div class="input-group-prepend">
              <button class="btn btn-sm btn-success icon_view" id="icon_view" type="button">
                <a
                  dangerouslySetInnerHTML={{ __html: iconValue[iconValue.length - 1] }}
                ></a>
              </button>
            </div>
            <input type="text"

              readOnly
              name="menu_icon"
              placeholder="Enter Page Group Icon"
              defaultValue={iconValue[iconValue.length - 1]}
           
              onChange={(event) => {
                handleInputChange(index, event)
              }}
              class="form-control form-control-sm icon w-25 page_group_icon" />
            <div class="input-group-append">
              <button class="btn btn-sm btn-danger icon_clear"
                type="button"
                onClick={handleDeleteClick}
                onChange={() => handleInputChange(index)}
                data-input="icon" ><FaTrash ></FaTrash></button>
              <button
                onClick={() => setLgShow(true)}
                className="btn btn-sm btn-secondary icon_modal"
                type="button"
              >
                <FaSearch ></FaSearch> Icon
              </button>

              <span class="input-group-text " data-toggle="popover" title="" data-placement="top" data-content="Leave Blank. if you don't show icon." data-original-title="Info"><FaInfoCircle ></FaInfoCircle></span>
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
                      <div className=''
                        onClick={() => handleAddToCart(icon)} >

                        <div className="icon-el text-center bg-light m-1 p-1 show_fa_icon fs-3"
                          onClick={() => handleAddToCart(icon)}
                        >
                          <a
                            dangerouslySetInnerHTML={{ __html: icon.fa }}
                          ></a>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>


      <div class="form-group row">
        <div class="col-md-12">
          <label for="exampleInputEmail1" class="font-weight-bold">Link:</label>
          <div class="input-group input-group-sm">
            <select
              onChange={handleChange}
              class="form-control form-control-sm  link_type w-25" name="link_path_type" id="select_item">
              <option value="1">External</option>
              <option value="2">Front page</option>
              <option value="3">No Link</option>
              <option value="4">Content Reference</option>
              <option value="5">Custom Content</option>
            </select>
            <input
              onChange={handleChange}
              defaultValue={editId.link_path}
              name="link_path" type="text" class="form-control form-control-sm  select_result w-50" id="select_result" />
            <input class="form-control form-control-sm  input_append_text search_link " id="menu" type="text" readonly="" />
            <div class="input-group-append">
              <span class="input-group-text search_icon" id="modal_call" data-id="menu" ><FaSearch ></FaSearch> </span>
            </div>
          </div>
        </div>

      </div>
      <div class="form-group row">
        <div class="col-md-8">
          <div class="checkbox">
            <label>
              <input

                type="checkbox"
                name="active"
                className="check"
                value={isActive ? 1 : 0}
                checked={isActive}
                // onChange={handleChange}
                onChange={(event) => {
                  handleCheckboxChange(event);
                  handleChange(event);
                }}
              // onChange={handleCheckboxChange}
              /> Active
            </label>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-8">
          <button class="btn btn-success btn-sm btn-primary ok">Create</button>
          {/* <button class="btn btn-sm btn-secondary btn-primary new">New</button> */}
//       </div>
//       <div class="col-md-4">
//       </div>
//     </div>
//   </div>
// </form>


// :


// <form action="" onSubmit={handleSubmit}>

//   <div class=" px-0">
//     <div class="w-100 clearfix border-bottom pb-1">
//       <h5 class="float-left mb-0 ">Menu Create</h5>
//     </div>

//     <div class="form-group row">
//       <div class="col-md-12 pt-2">
//         <label for="exampleInputEmail1" class="font-weight-bold">Item Name:</label>
//         <input type="text" name="title_en" class="form-control form-control-sm  menu_en " placeholder="Enter Item Name" />
//       </div>
//     </div>
//     <div class="form-group row">
//       <div class="col-md-12">
//         <label for="exampleInputEmail1" class="font-weight-bold">Menu Icon:</label>
//         <div class="input-group input-group-sm">
//           <input type="hidden" class="menu_id" name="menu_id" value="37" />
//           <select name="floating_position" class="form-control form-control-sm floating_id trim">
//             <option value="float-left"> Left Align</option>
//             <option value="float-right"> Right Align</option>
//           </select>
//           <div class="input-group-prepend">
//             <button class="btn btn-sm btn-success icon_view" id="icon_view" type="button">
//               <a
//                 dangerouslySetInnerHTML={{ __html: iconValue[iconValue.length - 1] }}
//               ></a>
//             </button>
//           </div>
//           <input type="text"
//             readOnly
//             name="menu_icon"
//             placeholder="Enter Page Group Icon"
//             defaultValue={iconValue[iconValue.length - 1]}
//             onChange={(event) => handleInputChange(index, event)}
//             class="form-control form-control-sm icon w-25 page_group_icon" />
//           <div class="input-group-append">
//             <button class="btn btn-sm btn-danger icon_clear"
//               type="button"
//               onClick={handleDeleteClick}
//               onChange={() => handleInputChange(index)}
//               data-input="icon" ><FaTrash ></FaTrash></button>
//             <button
//               onClick={() => setLgShow(true)}
//               className="btn btn-sm btn-secondary icon_modal"
//               type="button"
//             >
//               <FaSearch ></FaSearch> Icon
//             </button>

//             <span class="input-group-text " data-toggle="popover" title="" data-placement="top" data-content="Leave Blank. if you don't show icon." data-original-title="Info"><FaInfoCircle ></FaInfoCircle></span>
//           </div>
//         </div>
//         <Modal
//           className='text-black'
//           size="lg"
//           show={lgShow}
//           onHide={() => setLgShow(false)}
//           aria-labelledby="example-modal-sizes-title-lg"
//         >
//           <Modal.Header closeButton>
//             <Modal.Title id="example-modal-sizes-title-lg">
//               Large Modal
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body className='mt-5'>
//             <div className='row row-cols-2 row-cols-lg-6 row-cols-md-4 g-4 '>
//               {
//                 icons?.map((icon) =>
//                   <div key={icon.id} className='mt-1' onClick={() => setLgShow(false)} >
//                     <div className=''
//                       onClick={() => handleAddToCart(icon)} >

//                       <div className="icon-el text-center bg-light m-1 p-1 show_fa_icon fs-3"
//                         onClick={() => handleAddToCart(icon)}
//                       >
//                         <a
//                           dangerouslySetInnerHTML={{ __html: icon.fa }}
//                         ></a>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               }
//             </div>
//           </Modal.Body>
//         </Modal>
//       </div>
//     </div>
//     <div class="form-group row">
//       <div class="col-md-12">
//         <label for="exampleInputEmail1" class="font-weight-bold">Link:</label>
//         <div class="input-group input-group-sm">
//           <select class="form-control form-control-sm  link_type w-25" name="link_path_type" id="select_item">
//             <option value="1">External</option>
//             <option value="2">Front page</option>
//             <option value="3">No Link</option>
//             <option value="4">Content Reference</option>
//             <option value="5">Custom Content</option>
//           </select>
//           <input name="link_path" type="text" class="form-control form-control-sm  select_result w-50" id="select_result" />
//           <input class="form-control form-control-sm  input_append_text search_link " id="menu" type="text" readonly="" />
//           <div class="input-group-append">
//             <span class="input-group-text search_icon" id="modal_call" data-id="menu" ><FaSearch ></FaSearch> </span>
//           </div>
//         </div>
//       </div>

//     </div>
//     <div class="form-group row">
//       <div class="col-md-8">
//         <div class="checkbox">
//           <label>
//             <input
//               type="checkbox"
//               name="active"
//               className="check"
//               value={isActive ? 1 : 0}
//               checked={isActive}
//               onChange={handleCheckboxChange}
//             /> Active
//           </label>
//         </div>
//       </div>
//     </div>
//     <div class="form-group row">
//       <div class="col-md-8">
//         <button class="btn btn-success btn-sm btn-primary ok">Create</button>

//       </div>
//       <div class="col-md-4">
//       </div>
//     </div>
//   </div>
// </form>
// }

// </div> */}


// const [title_en, setTitle_en] = useState('')
// const [title_bn, setTitle_bn] = useState('')
// const [link_path, setLink_path] = useState('')
// const [link_path_type, setLink_path_type] = useState('')
// const [active, setActive] = useState(false)
// const [parent_id, setParent_id] = useState('')
// const [admin_template_menu_id, setAdmin_template_menu_id] = useState('')
// const [menu_icon, setMenu_icon] = useState('')
// const [icon_align, setIcon_align] = useState('')
// const [content_en, setContent_en] = useState('')






// useEffect(() => {
//   getBrands()
// }, [])

// console.log(title_en, title_bn, link_path, link_path_type, active, parent_id, admin_template_menu_id	, menu_icon, icon_align, content_en)
// const getBrands = async () => {
//   // ${process.env.NEXT_PUBLIC_API_URL}:5002/admin_template_table/update/${editId.id}
//   let result = await fetch(``)
//   result = await result.json()

//   setTitle_en(result.title_en)
//   setTitle_bn(result.title_bn)
//   setLink_path(result.link_path)
//   setLink_path_type(result.link_path_type)
//   setActive(result.active)
//   setParent_id(result.parent_id)
//   setAdmin_template_menu_id(result.admin_template_menu_id)
//   setMenu_icon(result.menu_icon)
//   setIcon_align(result.icon_align)
//   setContent_en(result.content_en)





// }




// const editItems = async () => {


//   const h = {};
//   let data = new FormData();

//   data.append('title_en', title_en);
//   data.append('title_bn', title_bn);
//   data.append('link_path', link_path);
//   data.append('link_path_type', link_path_type);
//   data.append('active', active)
//   data.append('parent_id', parent_id)
//   data.append('admin_template_menu_id', admin_template_menu_id);
//   data.append('menu_icon', menu_icon)
//   data.append('icon_align', icon_align)
//   data.append('content_en', content_en)





//   h.Accept = 'application/json';
//   // ${process.env.NEXT_PUBLIC_API_URL}:5002/admin_template_table/update/${editId.id}
//   fetch(``, {
//     method: 'PUT',
//     headers: h,
//     body: data
//   }).then(response => {
//     response.json()
//     console.log(response)

//   }).catch(err => {
//     console.log(err)

//   });


//   console.log(title_en, title_bn, link_path, link_path_type, active, parent_id, admin_template_menu_id	, menu_icon, icon_align, content_en)

// }


// 'use client'
// import "./style.css";
// import React, { useEffect, useState } from "react";
// import Nestable from "react-nestable";
// import "react-nestable/dist/styles/index.css";
// import { FaAlignJustify, FaPlus, FaMinus, FaRegTrashAlt, FaPencilAlt, FaTrashAlt, FaInfoCircle, FaTrash, FaSearch, FaRegWindowClose } from "react-icons/fa";
// import { useQuery } from "@tanstack/react-query";
// import Modal from 'react-bootstrap/Modal';
// import { HiTrash } from 'react-icons/hi';
// import '../../../admin_layout/modal/fa.css'
// import Swal from "sweetalert2";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Button } from "bootstrap-4-react/lib/components";
// import axios from "axios";


// // const items = [
// //   { id: 0, text: "Andy" },
// //   {
// //     id: 1,
// //     text: "Harry",
// //     children: [{ id: 2, text: "David" }]
// //   },
// //   { id: 3, text: "Lisa" }
// // ];

// const styles = {
//   position: "relative",
//   fontSize: "20px",
//   border: "1px solid #B6E3F7",
//   borderRadious: "10px",
//   background: "white",
//   color: "#333",
//   cursor: "pointer"
// };

//   const AdminTemplateMenu = ({modal, setModal}) => {


//   const { data: currentPosts = [], isLoading, refetch } = useQuery({
//     queryKey: ['currentPosts'],
//     queryFn: async () => {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/menu_item/all`);
//       const data = await res.json();

//       return data;
//     },
//   });

//   // console.log(items)

//   const [currentPage, setCurrentPage] = useState(1)
//   const [postsPerPage, setPostsPerPage] = useState(20)

//   const lastPostIndex = currentPage * postsPerPage
//   const firstPosIndex = lastPostIndex - postsPerPage
//   const items = currentPosts.slice(firstPosIndex, lastPostIndex)

//   let totalPosts = currentPosts.length
//   let pages = []

//   for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
//     pages.push(i)
//   }

//   // http://192.168.0.112:5002/menu_item/all






//   const [lgShow, setLgShow] = useState(false);
//   // const [modal, setModal] = useState(false);
//   const [icons, setIcons] = useState([])
//   const [inputValues, setInputValues] = useState([])

//   const handleInputChange = (index, event) => {
//     const { name, value } = event.target;
//     const newInputValues = [...inputValues];
//     newInputValues[index][name] = value;
//     setInputValues(newInputValues);
//   };


//   useEffect(() => {
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/faIcons`)
//       .then(res => res.json())
//       .then(data => {
//         setIcons(data)
//       })
//   }, [])

//   const [cart, setCart] = useState([])
//   const handleAddToCart = data => {

//     const newCart = [...cart, data]
//     setCart(newCart)

//   }

//   const iconValue = (cart?.map(c => c?.fa))

//   const handleDeleteClick = () => {
//     setCart([])
//   };

//   useEffect(() => {
//     handleDeleteClick()
//   }, [])

 

//   const [isEditClicked, setIsEditClicked] = useState(false);


//   const [editId, seteditId] = useState([])

//   const handleEditClick = (id) => {
//     seteditId(id)
//     setIsEditClicked(true);
//   };

//   console.log(editId)

//   const [editProfile, setEditProfile] = useState(editId)

//   const handleEditHome = event => {
//     event.preventDefault()

//     // ${process.env.NEXT_PUBLIC_API_URL}:5002/admin_template_table/update/${editId.id}
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin_template_table/update/${editId.id}`, {
//       method: 'PUT',
//       headers: {
//         'content-type': 'application/json'
//       },
//       body: JSON.stringify(editProfile)
//     })
//       .then(Response => Response.json())
//       .then(data => {
//         console.log(data)

//         if (data.changedRows > 0) {
//           refetch()
//           Swal.fire(
//             'Good job!',
//             'You clicked the button!',
//             'success'
//           )
//         }
//         else {
//           Swal.fire(
//             'Good job!',
//             'You clicked the button!',
//             'error'
//           )
//         }

//       })
//   }

//   const handleChange = event => {
//     const field = event.target.name
//     console.log(field)
//     const value = event.target.value
//     console.log(value)
//     const review = { ...editProfile }
//     review[field] = value
//     setEditProfile(review)
//   }



//   const renderItem = ({ item, collapseIcon, handler }) => {
//     const textColor = item.active === '1' ? 'red' : 'black';
//     return (


//       <div style={{ ...styles, color: textColor }}>
//         {
//           collapseIcon &&
//           <button className="btn  rounded-0 btn-sm border border-secondary" style={{
//             padding: '10px 5px', marginTop: '-1px', background: 'linear-gradient(to bottom, #ddd 0%, #bbb 100%)',

//             border: '1px solid #6c757d',
//             important: 'true',
//           }}>
//             {
//               collapseIcon
//             }

//           </button>
//         }
//         {handler}


//         <button className="mr-2" style={{
//           background: 'linear-gradient(to bottom, #ddd 0%, #bbb 100%)',
//           padding: '5px',
//           border: '1px solid #6c757d',
//           important: 'true',
//         }}>

//           <a class="btn btn-secondary rounded-0 btn-sm border border-secondary " style={{ marginTop: '1px' }}>
//             <i class="fas fa-bars"></i>
//           </a>
//         </button>



//         {item?.title_en}
      

//         <button
          
//           class="btn btn-sm btn-danger icon_clear  float-right mt-2 mr-2"
//           type="button"
//           title='Delete'

//           data-input="icon"

//         ><FaTrashAlt ></FaTrashAlt >
//         </button>

//         <button
//           onClick={() => handleEditClick(item)}
//           class="btn btn-sm btn-info icon_clear  float-right mt-2 mr-2"
//           type="button"
//           title='Edit'
//           data-input="icon" ><FaPencilAlt  ></FaPencilAlt >
//         </button>



//       </div>
//     );
//   };

//   const [order, setOrder] = useState([]);
//   const setParentIdRecursively = (items, parentId) => {
//     return items.map((item) => {
//       const updatedItem = { ...item, parent_id: parentId };
  
//       if (item.children && item.children.length > 0) {
//         updatedItem.children = setParentIdRecursively(item.children, item.id);
//       }
  
//       return updatedItem;
//     });
//   };

//   const checkChildrenCountRecursively = (item, maxChildren) => {
//     if (item.children.length > maxChildren) {
//       return true;
//     }
  
//     for (const child of item.children) {
//       if (checkChildrenCountRecursively(child, maxChildren)) {
//         return true;
//       }
//     }
  
//     return false;
//   };
  
//   const onChangeItem = (newItems) => {
//     // Check if any item or its children have more than 3 children
//     const hasMoreThanThreeChildren = newItems.items.some((item) =>
//       checkChildrenCountRecursively(item, 3)
//     );
  
//     if (hasMoreThanThreeChildren) {
//       alert('Each item or its children can have a maximum of 3 children. Please remove extra children.');
//       return;
//     } else {
//       // Check if any item or its children have more than 10 children
//       const hasMoreThanTenChildren = newItems.items.some((item) =>
//         checkChildrenCountRecursively(item, 10)
//       );
  
//       if (hasMoreThanTenChildren) {
//         alert('Each item or its children can have a maximum of 10 children. Please remove extra children.');
//         return;
//       } else {
//         // Set parent_id for each child item using the recursive function
//         const itemsWithParentId = setParentIdRecursively(newItems.items, null);
  
//         setOrder({ items: itemsWithParentId });
//       }
//     }
  
//     // Log the updated items
//     console.log(order);
//   };
  
  
//   // const onChangeItem = (newItems) => {
//   //   // Check if any item has more than 3 children
//   //   const hasMoreThanThreeChildren = newItems.items.some(
//   //     (item) => item.children.length > 3
//   //   );
  
//   //   if (hasMoreThanThreeChildren) {
//   //     alert('Each item can have a maximum of 3 children. Please remove extra children.');
//   //     return;
//   //   }else{

//   //     const hasMoreThanThreeChildren = newItems.items.some(
//   //       (item) => item.children.length > 10
//   //     );
    
//   //     if (hasMoreThanThreeChildren) {
//   //       alert('Each item can have a maximum of 3 children. Please remove extra children.');
//   //       return;
//   //     } else {
//   //       // Set parent_id for each child item using the recursive function
//   //       const itemsWithParentId = setParentIdRecursively(newItems.items, null);
    
//   //       setOrder({ items: itemsWithParentId });
//   //     }
//   //   }
  
//   //   // Log the updated items
//   //   console.log(order);
//   // };
  
//   // const onChangeItem = (newItems) => {
//   //   // Check if any item has more than 3 children
//   //   const hasMoreThanThreeChildren = newItems.items.some(
//   //     (item) => item.children.length > 10
//   //   );
  
//   //   if (hasMoreThanThreeChildren) {
//   //     alert('Each item can have a maximum of 3 children. Please remove extra children.');
//   //     return;
//   //   } else {
//   //     // Set parent_id for each child item
//   //     const itemsWithParentId = newItems.items.map((item) => {
//   //       if (item.children.length > 0) {
//   //         // If the item has children, set parent_id for each child
//   //         const childrenWithParentId = item.children.map((child) => {
//   //           if (child.children.length > 0) {
//   //             // If the child has children, set parent_id for each grandchild
//   //             const grandchildrenWithParentId = child.children.map((grandchild) => ({
//   //               ...grandchild,
//   //               parent_id: child.id,
//   //             }));
  
//   //             // Return the child item with updated grandchildren
//   //             return {
//   //               ...child,
//   //               children: grandchildrenWithParentId,
//   //             };
//   //           }
  
//   //           // If the child has no children, set parent_id to null
//   //           return {
//   //             ...child,
//   //             parent_id: item.id,
//   //           };
//   //         });
  
//   //         // Return the parent item with updated children
//   //         return {
//   //           ...item,
//   //           children: childrenWithParentId,
//   //         };
//   //       }
  
//   //       // If the item has no children, set parent_id to null
//   //       return {
//   //         ...item,
//   //         parent_id: null,
//   //       };
//   //     });
  
//   //     setOrder({ items: itemsWithParentId });
//   //   }
  
//   //   // Log the updated items
//   //   console.log(order);
//   // };
  
//   // const [order, setOrder] = useState([]);

//   // const onChangeItem = (newItems) => {
//   //   // Check if any item has more than 3 children
//   //   const hasMoreThanThreeChildren = newItems.items.some(
//   //     (item) => item.children.length > 3
//   //   );
  
//   //   if (hasMoreThanThreeChildren) {
//   //     alert('Each item can have a maximum of 3 children. Please remove extra children.');
//   //     return;
//   //   } else {
//   //     // Set parent_id for each child item
//   //     const itemsWithParentId = newItems.items.map((item) => {
//   //       if (item.children.length > 0) {
//   //         // If the item has children, set parent_id for each child
//   //         const childrenWithParentId = item.children.map((child) => ({
//   //           ...child,
//   //           parent_id: item.id,
//   //         }));
  
//   //         // Return the parent item with updated children
//   //         return {
//   //           ...item,
//   //           children: childrenWithParentId,
//   //         };
//   //       }
  
//   //       // If the item has no children, set parent_id to null
//   //       return {
//   //         ...item,
//   //         parent_id: null,
//   //       };
//   //     });
  
//   //     setOrder({ items: itemsWithParentId });
//   //   }
  
//   //   // Log the updated items
//   //   console.log(order);
//   // };
  


//   // ... (other code)



//   const [isActive, setIsActive] = useState(false);


//   const handleCheckboxChange = () => {

//     setIsActive((prevIsActive) => !prevIsActive);
//   };

//   console.log(isActive)

//   // console.log(order.items.length)
//   // npm run dev -- -H 192.168.0.112


//   const handleClose = () => setModal(false);


 

//   return (

//     <div class="bg-light border-primary shadow-sm border-0 overflow-hidden">
     
//       <Modal

//         className='text-black'
//         size="xl"
//         show={modal}
//         onHide={() => setModal(false)}
//         aria-labelledby="example-modal-sizes-title-lg"
//       >

//         <Modal.Header >
//           <Modal.Title id="example-modal-sizes-title-lg">
//             Menu
//           </Modal.Title>
//           <Button variant="link" className="close" onClick={handleClose}>
//             <FaRegWindowClose></FaRegWindowClose>
//           </Button>

//         </Modal.Header>
//         <Modal.Body>

//           <div>
    
//             <textarea
//               // className="d-none"
//               value={JSON.stringify(order.items ? order.items : items)}
//               rows="10"
//               readOnly
//               style={{ width: "100%" }}
//             />
        
         
            
//             <div class="card-header py-1 custom-card-header clearfix  text-white " style={{ color: '#fff', background: '#4267b2', borderColor: '#4267b2', }}>
//               <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Menu</h5>
//               <div class="card-title font-weight-bold mb-0 card-header-color float-right"> <a href="" class="btn btn-sm btn-info">Back to Admin Panel Settings Create</a></div>
//             </div>
//             <div className="d-lg-flex d-md-flex">

//               <div class="card-body col-md-6" style={{ borderRight: '1px solid black' }}>
//                 <div class="w-100  border-bottom pb-1 d-flex justify-content-between mb-2">
//                   <h5 class="">Menu Item List</h5>
                 
//                 </div>

//                 <div className="App">

//                   {
//                     isLoading ?

//                       <div class="spinner-border" role="status">
//                         <span class="visually-hidden">Loading...</span>
//                       </div>
//                       :

//                       <Nestable items={order.items ? order.items : items} renderItem={renderItem} onChange={onChangeItem} />
//                   }
//                 </div>


//               </div>
           
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// }

// export default AdminTemplateMenu

// 'use client'
// import "./style.css";
// import React, { useEffect, useState } from "react";
// import Nestable from "react-nestable";
// import "react-nestable/dist/styles/index.css";
// import { FaAlignJustify, FaPlus, FaMinus, FaRegTrashAlt, FaPencilAlt, FaTrashAlt, FaInfoCircle, FaTrash, FaSearch, FaRegWindowClose } from "react-icons/fa";
// import { useQuery } from "@tanstack/react-query";
// import Modal from 'react-bootstrap/Modal';
// import { HiTrash } from 'react-icons/hi';
// import '../../../admin_layout/modal/fa.css'
// import Swal from "sweetalert2";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Button } from "bootstrap-4-react/lib/components";
// import axios from "axios";


// // const items = [
// //   { id: 0, text: "Andy" },
// //   {
// //     id: 1,
// //     text: "Harry",
// //     children: [{ id: 2, text: "David" }]
// //   },
// //   { id: 3, text: "Lisa" }
// // ];

// const styles = {
//   position: "relative",
//   fontSize: "20px",
//   border: "1px solid #B6E3F7",
//   borderRadious: "10px",
//   background: "white",
//   color: "#333",
//   cursor: "pointer"
// };

//   const AdminTemplateMenu = ({modal, setModal}) => {


//   const { data: currentPosts = [], isLoading, refetch } = useQuery({
//     queryKey: ['currentPosts'],
//     queryFn: async () => {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/menu_item/all`);
//       const data = await res.json();

//       return data;
//     },
//   });

//   // console.log(items)

//   const [currentPage, setCurrentPage] = useState(1)
//   const [postsPerPage, setPostsPerPage] = useState(20)

//   const lastPostIndex = currentPage * postsPerPage
//   const firstPosIndex = lastPostIndex - postsPerPage
//   const items = currentPosts.slice(firstPosIndex, lastPostIndex)

//   let totalPosts = currentPosts.length
//   let pages = []

//   for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
//     pages.push(i)
//   }

//   // http://192.168.0.112:5002/menu_item/all






//   const [lgShow, setLgShow] = useState(false);
//   // const [modal, setModal] = useState(false);
//   const [icons, setIcons] = useState([])
//   const [inputValues, setInputValues] = useState([])

//   const handleInputChange = (index, event) => {
//     const { name, value } = event.target;
//     const newInputValues = [...inputValues];
//     newInputValues[index][name] = value;
//     setInputValues(newInputValues);
//   };


//   useEffect(() => {
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/faIcons`)
//       .then(res => res.json())
//       .then(data => {
//         setIcons(data)
//       })
//   }, [])

//   const [cart, setCart] = useState([])
//   const handleAddToCart = data => {

//     const newCart = [...cart, data]
//     setCart(newCart)

//   }

//   const iconValue = (cart?.map(c => c?.fa))

//   const handleDeleteClick = () => {
//     setCart([])
//   };

//   useEffect(() => {
//     handleDeleteClick()
//   }, [])

 

//   const [isEditClicked, setIsEditClicked] = useState(false);


//   const [editId, seteditId] = useState([])

//   const handleEditClick = (id) => {
//     seteditId(id)
//     setIsEditClicked(true);
//   };

//   console.log(editId)

//   const [editProfile, setEditProfile] = useState(editId)

//   const handleEditHome = event => {
//     event.preventDefault()

//     // ${process.env.NEXT_PUBLIC_API_URL}:5002/admin_template_table/update/${editId.id}
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin_template_table/update/${editId.id}`, {
//       method: 'PUT',
//       headers: {
//         'content-type': 'application/json'
//       },
//       body: JSON.stringify(editProfile)
//     })
//       .then(Response => Response.json())
//       .then(data => {
//         console.log(data)

//         if (data.changedRows > 0) {
//           refetch()
//           Swal.fire(
//             'Good job!',
//             'You clicked the button!',
//             'success'
//           )
//         }
//         else {
//           Swal.fire(
//             'Good job!',
//             'You clicked the button!',
//             'error'
//           )
//         }

//       })
//   }

//   const handleChange = event => {
//     const field = event.target.name
//     console.log(field)
//     const value = event.target.value
//     console.log(value)
//     const review = { ...editProfile }
//     review[field] = value
//     setEditProfile(review)
//   }



//   const renderItem = ({ item, collapseIcon, handler }) => {
//     const textColor = item.active === '1' ? 'red' : 'black';
//     return (


//       <div style={{ ...styles, color: textColor }}>
//         {
//           collapseIcon &&
//           <button className="btn  rounded-0 btn-sm border border-secondary" style={{
//             padding: '10px 5px', marginTop: '-1px', background: 'linear-gradient(to bottom, #ddd 0%, #bbb 100%)',

//             border: '1px solid #6c757d',
//             important: 'true',
//           }}>
//             {
//               collapseIcon
//             }

//           </button>
//         }
//         {handler}


//         <button className="mr-2" style={{
//           background: 'linear-gradient(to bottom, #ddd 0%, #bbb 100%)',
//           padding: '5px',
//           border: '1px solid #6c757d',
//           important: 'true',
//         }}>

//           <a class="btn btn-secondary rounded-0 btn-sm border border-secondary " style={{ marginTop: '1px' }}>
//             <i class="fas fa-bars"></i>
//           </a>
//         </button>



//         {item?.title_en}
      

//         <button
          
//           class="btn btn-sm btn-danger icon_clear  float-right mt-2 mr-2"
//           type="button"
//           title='Delete'

//           data-input="icon"

//         ><FaTrashAlt ></FaTrashAlt >
//         </button>

//         <button
//           onClick={() => handleEditClick(item)}
//           class="btn btn-sm btn-info icon_clear  float-right mt-2 mr-2"
//           type="button"
//           title='Edit'
//           data-input="icon" ><FaPencilAlt  ></FaPencilAlt >
//         </button>



//       </div>
//     );
//   };


 
//   // const [order, setOrder] = useState([]);

//   // const onChangeItem = (newItems) => {
//   //   // Check if any item has more than 3 children
//   //   const hasMoreThanThreeChildren = newItems.items.some(
//   //     (item) => item.children.length > 3
//   //   );

//   //   if (hasMoreThanThreeChildren) {
//   //     alert('Each item can have a maximum of 3 children. Please remove extra children.');
//   //     return;
//   //   } else {
//   //     // Add parent_id when changing the position of an item
//   //     const itemsWithParentId = newItems.items.map((item) => ({
//   //       ...item,
//   //       parent_id: item.id || null, // Assuming parent_id is initially null
//   //     }));

//   //     setOrder({ items: itemsWithParentId });
//   //   }

//   //   // Log the updated items
//   //   console.log(order);
//   // };
 


//   // ... (other code)



//   const [isActive, setIsActive] = useState(false);


//   const handleCheckboxChange = () => {

//     setIsActive((prevIsActive) => !prevIsActive);
//   };

//   console.log(isActive)

//   // console.log(order.items.length)
//   // npm run dev -- -H 192.168.0.112


//   const handleClose = () => setModal(false);


 

//   return (

//     <div class="bg-light border-primary shadow-sm border-0 overflow-hidden">
     
//       <Modal

//         className='text-black'
//         size="xl"
//         show={modal}
//         onHide={() => setModal(false)}
//         aria-labelledby="example-modal-sizes-title-lg"
//       >

//         <Modal.Header >
//           <Modal.Title id="example-modal-sizes-title-lg">
//             Menu
//           </Modal.Title>
//           <Button variant="link" className="close" onClick={handleClose}>
//             <FaRegWindowClose></FaRegWindowClose>
//           </Button>

//         </Modal.Header>
//         <Modal.Body>

//           <div>
    
//             <textarea
//               // className="d-none"
//               value={JSON.stringify(order.items ? order.items : items)}
//               rows="10"
//               readOnly
//               style={{ width: "100%" }}
//             />
        
         
            
//             <div class="card-header py-1 custom-card-header clearfix  text-white " style={{ color: '#fff', background: '#4267b2', borderColor: '#4267b2', }}>
//               <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Menu</h5>
//               <div class="card-title font-weight-bold mb-0 card-header-color float-right"> <a href="" class="btn btn-sm btn-info">Back to Admin Panel Settings Create</a></div>
//             </div>
//             <div className="d-lg-flex d-md-flex">

//               <div class="card-body col-md-6" style={{ borderRight: '1px solid black' }}>
//                 <div class="w-100  border-bottom pb-1 d-flex justify-content-between mb-2">
//                   <h5 class="">Menu Item List</h5>
                 
//                 </div>

//                 <div className="App">

//                   {
//                     isLoading ?

//                       <div class="spinner-border" role="status">
//                         <span class="visually-hidden">Loading...</span>
//                       </div>
//                       :

//                       <Nestable items={order.items ? order.items : items} renderItem={renderItem} onChange={onChangeItem} />
//                   }
//                 </div>


//               </div>
           
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// }

// export default AdminTemplateMenu


// import { StrictMode } from "react";
// import App from "./page";


// const HomePage = () => {
//   return (
//     <StrictMode>
//       <App />
//     </StrictMode>
//   );
// };

// export default HomePage;



 {/* <div class="card-body">
                    <div class="table-responsive">
                    <table className="table table-bordered table-hover table-striped table-sm">
                     <thead>
                   
                         <tr>
                            {
                             
                             selectedColumns.map((column, i) => (
                               <>
                                <th key={i}>{formatString(column)}</th>
                               </>
                            ))
                            
                        }
                     
                           
                        </tr>
                        
                    </thead>
                    <tbody>
                        {
                        
                        filteredCategorys.map((category, i) => (
                            <tr key={i}>
                              
                               
                              
                                {selectedColumns.map((column, j) => (
                                     <td key={j}>
                                     {column === 'serial' ? (
                                         // Rendering serial number if the column is 'serial'
                                         i + 1
                                     ) : column === 'status_id' ? (
                                         // Special handling for the 'status' column
                                         <>
                                             {category.status_id === 1 && <p>Active</p>}
                                             {category.status_id === 2 && <p>Inactive</p>}
                                             {category.status_id === 3 && <p>Pending</p>}
                                         </>
                                     ) : 
                                     
                                     column === 'action' ? (
                                        // Special handling for the 'status' column
                                        <div className="flex items-center ">





                                        <Link href={`/Admin/category/category_edit/${category.id}?page_group=${page_group}`}>
                                            {
                                                filteredBtnIconEdit?.map((filteredBtnIconEdit =>

                                                    <button
                                                        key={filteredBtnIconEdit.id}
                                                        title='Edit'
                                                        style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                        className={filteredBtnIconEdit?.btn}
                                                    >

                                                        <a
                                                            dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                        ></a>
                                                    </button>

                                                ))
                                            }

                                        </Link>
                                        <Link href={`/Admin/category/category_copy/${category.id}?page_group=${page_group}`}>
                                            {
                                                filteredBtnIconCopy.map((filteredBtnIconEdit =>

                                                    <button
                                                        key={filteredBtnIconEdit.id}
                                                        title='Copy'
                                                        style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                        className={filteredBtnIconEdit?.btn}
                                                    >

                                                        <a
                                                            dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                        ></a>
                                                    </button>

                                                ))
                                            }

                                        </Link>

                                        {
                                            filteredBtnIconDelete.map((filteredBtnIconDelete =>
                                                <button
                                                    key={filteredBtnIconDelete.id}
                                                    title='Delete'
                                                    onClick={() => handleDelete(category.id)}
                                                    style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                    className={filteredBtnIconDelete?.btn}
                                                >
                                                    <a
                                                        dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                    ></a>
                                                </button>

                                            ))
                                        }
                                    </div>
                                    )
                                     :
                                     
                                     (
                                         // Default rendering for other columns
                                         category[column]
                                     )}
                                 </td>
                                ))}
                         
                            </tr>
                        ))}
                    </tbody>
                </table>
                      
                        
                    </div>
                  
                </div> */}

                  {/* <table class="table table-bordered table-hover table-striped table-sm">
                            <thead>
                                
                                <tr>
                                   
                                    { selectedColumns.length > 0 ?
                                        selectedColumns.map((column) => (
                                            <>
                                                <th key={column}>{formatString(column)}</th>
                                            </>
                                        ))

                                        :
                                        <>
                                         <th>Category Name</th>
                                                <th>Status</th>
                                                <th>description</th>
                                                <th>Created By</th>
                                                <th>Created Date</th>
                                                <th>Action</th>
                                        </>


                                    }


                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategorys.length > 0 ?
                                    filteredCategorys.map((category, i) =>

                                        <>
                                            <tr>
                                                <td>{category.category_name}</td>
                                                <td> {
                                                    category.status_id === 1 &&
                                                    <p>active</p>

                                                }

                                                    {
                                                        category.status_id === 2 &&
                                                        <p>Inactive</p>

                                                    }
                                                    {
                                                        category.status_id === 3 &&
                                                        <p>Pending</p>

                                                    }
                                                </td>

                                                <td>
                                                    {category.description}
                                                </td>
                                                <td>{category.created_by}</td>
                                                <td>{category.created_date}</td>
                                                <td className="">
                                                    <div className="flex items-center ">





                                                        <Link href={`/Admin/category/category_edit/${category.id}?page_group=${page_group}`}>
                                                            {
                                                                filteredBtnIconEdit?.map((filteredBtnIconEdit =>

                                                                    <button
                                                                        key={filteredBtnIconEdit.id}
                                                                        title='Edit'
                                                                        style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                        className={filteredBtnIconEdit?.btn}
                                                                    >

                                                                        <a
                                                                            dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                        ></a>
                                                                    </button>

                                                                ))
                                                            }

                                                        </Link>
                                                        <Link href={`/Admin/category/category_copy/${category.id}?page_group=${page_group}`}>
                                                            {
                                                                filteredBtnIconCopy.map((filteredBtnIconEdit =>

                                                                    <button
                                                                        key={filteredBtnIconEdit.id}
                                                                        title='Copy'
                                                                        style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                        className={filteredBtnIconEdit?.btn}
                                                                    >

                                                                        <a
                                                                            dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                        ></a>
                                                                    </button>

                                                                ))
                                                            }

                                                        </Link>

                                                        {
                                                            filteredBtnIconDelete.map((filteredBtnIconDelete =>
                                                                <button
                                                                    key={filteredBtnIconDelete.id}
                                                                    title='Delete'
                                                                    onClick={() => handleDelete(category.id)}
                                                                    style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                    className={filteredBtnIconDelete?.btn}
                                                                >
                                                                    <a
                                                                        dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                    ></a>
                                                                </button>

                                                            ))
                                                        }
                                                    </div>
                                                </td>
                                            </tr>

                                        </>

                                    )
                                    :
                                    categorys.map((category, i) =>

                                        <>
                                            <tr>
                                                <td>{category.category_name}</td>
                                                <td> {
                                                    category.status_id === 1 &&
                                                    <p>active</p>

                                                }

                                                    {
                                                        category.status_id === 2 &&
                                                        <p>Inactive</p>

                                                    }
                                                    {
                                                        category.status_id === 3 &&
                                                        <p>Pending</p>

                                                    }
                                                </td>

                                                <td>
                                                    {category.description}
                                                </td>
                                                <td>{category.created_by}</td>
                                                <td>{category.created_date}</td>
                                                <td className="">
                                                    <div className="flex items-center ">





                                                        <Link href={`/Admin/category/category_edit/${category.id}?page_group=${page_group}`}>
                                                            {
                                                                filteredBtnIconEdit?.map((filteredBtnIconEdit =>

                                                                    <button
                                                                        key={filteredBtnIconEdit.id}
                                                                        title='Edit'
                                                                        style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                        className={filteredBtnIconEdit?.btn}
                                                                    >

                                                                        <a
                                                                            dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                        ></a>
                                                                    </button>

                                                                ))
                                                            }

                                                        </Link>
                                                        <Link href={`/Admin/category/category_copy/${category.id}?page_group=${page_group}`}>
                                                            {
                                                                filteredBtnIconCopy.map((filteredBtnIconEdit =>

                                                                    <button
                                                                        key={filteredBtnIconEdit.id}
                                                                        title='Copy'
                                                                        style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                        className={filteredBtnIconEdit?.btn}
                                                                    >

                                                                        <a
                                                                            dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                        ></a>
                                                                    </button>

                                                                ))
                                                            }

                                                        </Link>

                                                        {
                                                            filteredBtnIconDelete.map((filteredBtnIconDelete =>
                                                                <button
                                                                    key={filteredBtnIconDelete.id}
                                                                    title='Delete'
                                                                    onClick={() => handleDelete(category.id)}
                                                                    style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                    className={filteredBtnIconDelete?.btn}
                                                                >
                                                                    <a
                                                                        dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                    ></a>
                                                                </button>

                                                            ))
                                                        }
                                                    </div>
                                                </td>
                                            </tr>

                                        </>

                                    )
                                }

                            </tbody>
                        </table> */}

// 'use client'
// import { useQuery } from '@tanstack/react-query';
// import React from 'react';
// import Select from 'react-dropdown-select';

// const CategoryList = () => {

//     const { data: categorys = [], isLoading, refetch
//     } = useQuery({
//         queryKey: ['categorys'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_all`)

//             const data = await res.json()
//             return data
//         }
//     })
//     const formatString = (str) => {
//         const words = str?.split('_');

//         const formattedWords = words?.map((word) => {
//             const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//             return capitalizedWord;
//         });

//         return formattedWords?.join(' ');
//     };

//     const columnNames = categorys && categorys.length > 0 ? Object.keys(categorys[0]) : [];


//     console.log('Column Names:', columnNames);
//     const [searchQuery, setSearchQuery] = React.useState('');
//     const [statusFilter, setStatusFilter] = React.useState('');

//     const [filteredCategorys, setFilteredCategorys] = React.useState([]);

//     const [selectedColumns, setSelectedColumns] = React.useState([]);



//     const [selectedOrder, setSelectedOrder] = React.useState('');

//     const handleOrderChange = (e) => {
//         // Update the selected order when the user makes a selection
//         setSelectedOrder(e.target.value);
//     };

//     const handleSearch = () => {
//         // Check if options are selected before updating the table
//         if (selectedColumns.length > 0 || searchQuery !== '' || statusFilter !== '' || selectedOrder !== '') {
//             const query = String(searchQuery).toLowerCase();
//             const filteredCategories = categorys.filter(
//                 (category) =>
//                     String(category.category_name).toLowerCase().includes(query) &&
//                     (statusFilter === '' || category.status_id.toString() === statusFilter) &&
//                     (selectedColumns.length === 0 ||
//                         selectedColumns.some((column) =>
//                             String(category[column]).toLowerCase().includes(query)
//                         ))
//             );
    
//             // Apply sorting based on the selected order
//             const sortedCategories = [...filteredCategories];
//             if (selectedOrder === '1') {
//                 sortedCategories.sort((a, b) => (a.id > b.id ? 1 : -1)); // Ascending order
//             } else if (selectedOrder === '2') {
//                 sortedCategories.sort((a, b) => (a.id < b.id ? 1 : -1)); // Descending order
//             }
    
//             setFilteredCategorys(sortedCategories);
//         } else {
//             // Handle the case when no options are selected
//             // You can show an alert or handle it based on your requirement
//             console.log('Please select options before searching.');
//         }
//     };
    
 
//     const buttonStyles = {
//         color: '#fff',
//         backgroundColor: '#510bc4',
//         backgroundImage: 'none',
//         borderColor: '#4c0ab8',
//     };
//     const handleColumnChange = (selectedItems) => {
//         setSelectedColumns(selectedItems.map((item) => item.value));
//         // handleSearch(); // Update the filtered data when columns change
//     };

//     console.log(filteredCategorys)
//     return (
//         <div>
//             <div class=" border-primary shadow-sm border-0">
//                 <div class="bg-dark card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                     <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Brand Search</h5>
//                     <div class="card-title font-weight-bold mb-0 card-header-color float-right">
//                         <a href="https://atik.urbanitsolution.com/Admin/student/student_create?page_group=student_management" class="btn btn-sm btn-info">Create Student</a>
//                     </div>
//                 </div>
//                 <div class="card-body">
//                     <form class="" method="post" autocomplete="off">
//                         <div class="col-md-9 offset-md-1">
//                             <div class="form-group row student">
//                                 <label class="col-form-label col-md-2">Brand</label>
//                                 <div class="col-md-4">
//                                     <input
//                                         value={searchQuery}
//                                         onChange={(e) => setSearchQuery(e.target.value)}
//                                         type="text" name="student_id" class="form-control form-control-sm  alpha_space student_id" id="student_id" placeholder="Student ID" />
//                                 </div>
//                                 <label class="col-form-label col-md-2">Status</label>
//                                 <div className="col-md-4">
//                                     <select
//                                         name="statusFilter"
//                                         className="form-control form-control-sm integer_no_zero lshift"
//                                         value={statusFilter}
//                                         onChange={(e) => setStatusFilter(e.target.value)}
//                                     >
//                                         <option value="">Select Status</option>
//                                         <option value="1">Active</option>
//                                         <option value="2">Inactive</option>
//                                         <option value="3">Pending</option>
//                                     </select>
//                                 </div>
//                             </div>

//                             <div class="form-group row student">

//                                 <label class="col-form-label col-md-2">Order By</label>
//                                 <div className="col-md-4">
//                                     <select
//                                         name="statusFilter"
//                                         className="form-control form-control-sm integer_no_zero lshift"
//                                         value={selectedOrder}
//                                         onChange={handleOrderChange}
//                                     >
//                                         <option value="">Select Order</option>
//                                         <option value="1">Ascending </option>
//                                         <option value="2">Descending </option>

//                                     </select>
//                                 </div>
//                                 <label class="col-form-label col-md-2">Extra Column</label>
//                                 <div class="col-md-4">
//                                     <input type="text" name="student_id" class="form-control form-control-sm  alpha_space student_id" id="student_id" placeholder="Student ID" />
//                                 </div>
//                             </div>
                          

//                             <div className='mb-5 mt-0'>
//                                 <p>Design:</p>
//                                 <Select
//                                     name='select'
//                                     labelField='label'
//                                     valueField='value'
//                                     options={columnNames.map(column => ({ label: formatString(column), value: column }))}
//                                     multi
//                                     onChange={handleColumnChange}
                                    
//                                 />
//                             </div>


//                         </div>
//                         <div class="form-group row">
//                             <div class="offset-md-2 col-md-6 float-left">
//                                 <input type="button" onClick={handleSearch} name="search" class="btn btn-sm btn-info search_btn mr-2" value="Search" />
//                                 <input type="button" name="search" class="btn btn-sm btn-success print_btn mr-2" value="Print" />
//                                 <input type="button" style={buttonStyles} name="search" class="btn btn-sm btn-indigo pdf_btn mr-2" value="Download PDF" />

//                                 <input type="button" name="search" class="btn btn-sm btn-secondary excel_btn mr-2" value="Download Excel " />
//                             </div>
//                         </div>
//                     </form>
//                     <div class="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
//                         <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
//                     </div>

//                 </div>
//             </div>


//             <div>All data list</div>
//             <div class="table-responsive">
//                 <table className="table table-bordered table-hover table-striped table-sm">
//                     <thead>
//                         <tr>
//                             {selectedColumns.map((column, i) => (
//                                 <th key={i}>{formatString(column)}</th>
//                             ))}
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredCategorys.map((category, i) => (
//                             <tr key={i}>
//                                 {selectedColumns.map((column, j) => (
//                                     <td key={j}>
//                                         {column === 'status' ? (
//                                             // Special handling for the 'status' column
//                                             <>
//                                                 {category.status_id === 1 && <p>Active</p>}
//                                                 {category.status_id === 2 && <p>Inactive</p>}
//                                                 {category.status_id === 3 && <p>Pending</p>}
//                                             </>
//                                         ) : (
//                                             // Default rendering for other columns
//                                             category[column]
//                                         )}
//                                     </td>
//                                 ))}
//                                 <td className=""></td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default CategoryList;

 {/* <div className='mb-5 mt-0'>
                                    <p>Design:</p>
                                    <Select
                                        name='select'
                                        labelField='label'
                                        valueField='value'
                                        options={[
                                            { label: 'Serial', value: 'serial' }, // Serial option
                                            { label: 'Action', value: 'action' }, // Serial option
                                            ...filteredColumns.map(column => ({ label: formatString(column), value: column }))
                                        ]}
                                        // options={[
                                        //     { label: 'Serial', value: 'serial' }, // Serial option
                                        //     { label: 'Action', value: 'action' }, // Serial option
                                        //     ...columnNames.map(column => ({ label: formatString(column), value: column }))
                                        // ]}
                                        multi
                                        onChange={handleColumnChange}
                                    />
                                </div> */}



    // const handleSearch = () => {
    //     const query = String(searchQuery).toLowerCase();
    //     const filteredCategories = categorys.filter(
    //         (category) =>
    //             String(category.category_name).toLowerCase().includes(query) &&
    //             (statusFilter === '' || category.status_id.toString() === statusFilter) &&
    //             (selectedColumns.length === 0 ||
    //                 selectedColumns.some((column) =>
    //                     String(category[column]).toLowerCase().includes(query)
    //                 ))
    //     );

    //     // Apply sorting based on the selected order
    //     const sortedCategories = [...filteredCategories];
    //     if (selectedOrder === '1') {
    //         sortedCategories.sort((a, b) => (a.id > b.id ? 1 : -1)); // Ascending order
    //     } else if (selectedOrder === '2') {
    //         sortedCategories.sort((a, b) => (a.id < b.id ? 1 : -1)); // Descending order
    //     }

    //     setFilteredCategorys(sortedCategories);
    // };


    // const downloadPdfs = async () => {

//     const doc = new jsPDF();
    
//     // Filter out the 'action' column from selectedColumns
//     const columnsToDisplay = selectedColumns.filter(column => column !== 'action');
    
//     // Prepare head and body data for autoTable
//     const headData = columnsToDisplay.map(column => formatString(column));

//     // Define a function to handle image loading errors
//     const handleImageError = (error, url) => {
//         console.error(`Error loading image at ${url}:`, error);
//         // You can add custom error handling here, such as displaying an error message or skipping the image
//     };



//     // Map over each search result to fetch image and create body data
//     for (let i = 0; i < searchResults.length; i++) {

//         const category = searchResults[i];

//         const rowData = [];

//         for (let j = 0; j < columnsToDisplay.length; j++) {

//             const column = columnsToDisplay[j];

//             let cellData;

//             if (column === 'serial') {
//                 cellData = i + 1; // Rendering serial number

//             } else if (column === 'file_path') {
//                 // Load the image
//                 const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}:5003/${category.file_path}`;

//                 try {

//                     const img = await loadImage(imageUrl);
//                     console.log(img)
//                     // // Add image to PDF
//                     const imgWidth = 10; // Adjust width as needed
//                     const imgHeight = 10; // Maintain aspect ratio
//                     // doc.addImage(img, 'JPEG', 20, 10, imgWidth, imgHeight); // Adjust position and size as needed
//                     cellData.addImage(img, 'JPEG', 20, 10, imgWidth, imgHeight); // Since the image is added separately, return empty string

//                 } catch (error) {
//                     handleImageError(error, imageUrl);
//                     cellData = 'Image Error'; // Placeholder for error
//                 }
//             } else if (column === 'status_id') {
//                 // Handle status ID
//                 const statusId = category.status_id;
//                 if (statusId === 1) {
//                     cellData = 'Active';
//                 } else if (statusId === 2) {
//                     cellData = 'Inactive';
//                 } else if (statusId === 3) {
//                     cellData = 'Pending';
//                 } else {
//                     cellData = 'Unknown';
//                 }
//             } else {
//                 cellData = category[column];
//             }
//             rowData.push(cellData);
//         }
//         doc.autoTable({
//             head: [headData],
//             body: [rowData],
//         });
//         // Add a page break if there are more search results
//         if (i < searchResults.length - 1) {
//             doc.addPage();
//         }
//     }

//     // Download PDF
//     doc.save('filtered_category_list.pdf');
// };

// Function to load an image asynchronously
  // const downloadPd = () => {
    //     // Create a new window with the filtered data to print
    //     const printWindow = window.open('', '_blank');
    //     printWindow.document.write('<html><head><title>Filtered Category List</title></head><body>');
    //     printWindow.document.write('<h1>Filtered Category List</h1>');
    
    //     // Render the filtered data in a table
    //     printWindow.document.write('<table border="1">');
    //     printWindow.document.write('<thead><tr>');
    //     selectedColumns.forEach(column => {
    //         printWindow.document.write('<th>' + formatString(column) + '</th>');
    //     });
    //     printWindow.document.write('</tr></thead>');
    //     printWindow.document.write('<tbody>');
    //     filteredCategorys.forEach(color => {
    //         printWindow.document.write('<tr>');
    //         selectedColumns.forEach(column => {
    //             printWindow.document.write('<td>' + (column === 'serial' ? filteredCategorys.indexOf(color) + 1 : color[column]) + '</td>');
    //         });
    //         printWindow.document.write('</tr>');
    //     });
    //     printWindow.document.write('</tbody></table>');
    //     printWindow.document.write('</body></html>');
    //     printWindow.document.close();
    
    //     // Print the window
    //     printWindow.print();
    // };
    // const downloadPd = () => {
    //     // Create a new window for editing
    //     const editWindow = window.open('', '_blank');
    //     editWindow.document.write('<html><head><title>Edit Filtered Category List</title></head><body>');
    //     editWindow.document.write('<h1>Edit Filtered Category List</h1>');
    
    //     // Render the filtered data in a table for editing
    //     editWindow.document.write('<table border="1">');
    //     editWindow.document.write('<thead><tr>');
    //     selectedColumns.forEach(column => {
    //         editWindow.document.write('<th>' + formatString(column) + '</th>');
    //     });
    //     editWindow.document.write('</tr></thead>');
    //     editWindow.document.write('<tbody>');
    //     filteredCategorys.forEach(color => {
    //         editWindow.document.write('<tr>');
    //         selectedColumns.forEach(column => {
    //             editWindow.document.write('<td contenteditable="true">');
    //             if (column === 'file_path') {
    //                 // Special handling for the 'File Path' column to display images
    //                 editWindow.document.write('<img src="' + color[column] + '" style="max-width: 100px;" alt="Image"/>');
    //             } else if (column === 'serial') {
    //                 // Rendering serial number if the column is 'serial'
    //                 editWindow.document.write(filteredCategorys.indexOf(color) + 1);
    //             } else {
    //                 // Default rendering for other columns
    //                 editWindow.document.write(color[column]);
    //             }
    //             editWindow.document.write('</td>');
    //         });
    //         editWindow.document.write('</tr>');
    //     });
    //     editWindow.document.write('</tbody></table>');
    //     editWindow.document.write('</body></html>');
    //     editWindow.document.close();
    
    //     // Print the editing window
    //     editWindow.print();
    // };
    
    // const downloadPd = () => {
    //     const extraColumnValue = document.getElementById('student_id').value; // Get the value of the extra column input field
    //     const doc = new jsPDF();
    //     doc.autoTable({
    //         head: [selectedColumns.map(column => formatString(column)).concat('Extra Column')], // Include the extra column in the header
    //         body: filteredCategorys.map(category => selectedColumns.map(column => category[column]).concat(extraColumnValue)) // Include the extra column value in the body for each row
    //     });
    
    //     // Download PDF
    //     doc.save('filtered_category_list.pdf');
    // };

    // const generatePDF = () => {
    //     // Retrieve selected values
        
    //     const pageSize = document.getElementById('print_size').value;
    //     const layout = document.getElementById('print_layout').value;
    //     const fontSize = document.querySelector('.student_type').value;
    //     const zoomSize = document.getElementById('zoom_size').value;
    
    //     // Modify print settings
    //     const printSettings = `size=${pageSize.toLowerCase()} ${layout.toLowerCase()}, font=${fontSize}`;
    
    //     // Get the value of the extra column input field
    //     const extraColumnValue = parseInt(document.getElementById('extra_column').value);
    
    //     // Create a new window for editing
    //     const editWindow = window.open('', '_blank');
    //     editWindow.document.write('<html><head><title>Brand List</title></head><body>');
    //     editWindow.document.write('<h1>Brand List</h1>');
    
    //     // Render the filtered data in a table for editing
    //     editWindow.document.write('<table border="1">');
    //     editWindow.document.write('<thead><tr>');
    
    //     // Render headers for selected columns
    //     const editableHeaders = []; // Array to store headers for editable columns
    //     selectedColumns.forEach(column => {
    //         if (column !== 'action') {
    //             // Display 'Status' if the column name is 'status_id'
    //             const columnHeader = column === 'status_id' ? 'Status' : formatString(column);
    //             editWindow.document.write('<th>' + columnHeader + '</th>');
    
    //             // Push header to editableHeaders if it's an extra column
    //             if (column.startsWith('extra')) {
    //                 editableHeaders.push('<th contenteditable="true">' + columnHeader + '</th>');
    //             }
    //         }
    //     });
    
    //     // Add Extra Column headers with editable input fields
    //     for (let i = 1; i <= extraColumnValue; i++) {
    //         editWindow.document.write(editableHeaders[i - 1] || '<th contenteditable="true">Extra Column ' + i + '</th>');
    //     }
    
    //     editWindow.document.write('</tr></thead>');
    //     editWindow.document.write('<tbody>');
    
    //     // Render rows of data
    //     filteredCategorys.forEach((category, index) => {
    //         editWindow.document.write('<tr>');
    
    //         // Render cells for selected columns
    //         selectedColumns.forEach(column => {
    //             if (column !== 'action') {
    //                 editWindow.document.write('<td' + (column.startsWith('extra') ? ' contenteditable="true"' : '') + '>');
    
    //                 if (column === 'file_path') {
    //                     // Special handling for the 'File Path' column to display images
    //                     editWindow.document.write(`<img src="${process.env.NEXT_PUBLIC_API_URL}:5003/${category.file_path}" style="max-width: 100px;" alt="Image"/>`);
    
    //                 } else if (column === 'serial') {
    //                     // Rendering serial number if the column is 'serial'
    //                     editWindow.document.write(index + 1);
    //                 } else if (column === 'status_id') {
    //                     // Display status based on status_id value
    //                     let statusText = '';
    //                     switch (category[column]) {
    //                         case 1:
    //                             statusText = 'Active';
    //                             break;
    //                         case 2:
    //                             statusText = 'Inactive';
    //                             break;
    //                         case 3:
    //                             statusText = 'Pending';
    //                             break;
    //                         default:
    //                             statusText = 'Unknown';
    //                     }
    //                     editWindow.document.write(statusText);
    //                 } else {
    //                     // Default rendering for other columns
    //                     editWindow.document.write(category[column]);
    //                 }
    //                 editWindow.document.write('</td>');
    //             }
    //         });
    
    //         // Render cells for extra columns
    //         for (let i = 0; i < extraColumnValue; i++) {
    //             editWindow.document.write('<td contenteditable="true"></td>');
    //         }
    
    //         editWindow.document.write('</tr>');
    //     });
    
    //     editWindow.document.write('</tbody></table>');
    //     editWindow.document.write('</body></html>');
    //     editWindow.document.close();
    
    //     // Set print settings
    //     editWindow.document.getElementsByTagName('body')[0].style = `zoom: ${zoomSize};`;
    //     editWindow.document.getElementsByTagName('body')[0].setAttribute('onload', 'window.print()');
    
    //     // Create PDF
    //     const doc = new jsPDF();
    //     // Include the extra columns in the header
    //     const headColumns = [...selectedColumns.map(column => column === 'status_id' ? 'Status' : formatString(column))];
    //     for (let i = 1; i <= extraColumnValue; i++) {
    //         headColumns.push("Extra Column " + i);
    //     }
    //     doc.autoTable({
    //         head: [headColumns],
    //         body: filteredCategorys.map(category => {
    //             // Include the extra column values in the body for each row
    //             const row = selectedColumns.filter(column => column !== 'action').map(column => {
    //                 if (column === 'status_id') {
    //                     // Convert status_id to corresponding status text
    //                     switch (category[column]) {
    //                         case 1:
    //                             return 'Active';
    //                         case 2:
    //                             return 'Inactive';
    //                         case 3:
    //                             return 'Pending';
    //                         default:
    //                             return 'Unknown';
    //                     }
    //                 } else {
    //                     return category[column];
    //                 }
    //             });
    //             for (let i = 0; i < extraColumnValue; i++) {
    //                 row.push(""); // Push empty strings for extra columns
    //             }
    //             return row;
    //         })
    //     });
    
    //     // Download PDF
    //     doc.save('filtered_category_list.pdf');
    // };
    
    
   
    
    
    // const extraColumnValue = parseInt(document.getElementById('extra_column').value);
    
    // const generatePDF = () => {
    //     const extraColumnValue = parseInt(document.getElementById('extra_column').value);
    //     const printSize = document.getElementById('print_size').value;
    //     const printLayout = document.getElementById('print_layout').value; // Get selected print layout
    
    //     let pageSize;
    //     switch (printSize) {
    //         case 'legal':
    //             pageSize = { width: 215.9, height: 355.6 }; // Legal size in mm
    //             break;
    //         case 'A4':
    //             pageSize = { width: 210, height: 297 }; // A4 size in mm
    //             break;
    //         case 'A3':
    //             pageSize = { width: 297, height: 420 }; // A3 size in mm
    //             break;
    //         default:
    //             pageSize = { width: 210, height: 297 }; // Default to A4 size
    //             break;
    //     }
    
    //     // Set orientation based on print layout selection
    //     const orientation = printLayout === 'Landscape' ? 'landscape' : 'portrait';
    
    //     // Create a new window for editing with specific dimensions
    //     const editWindow = window.open('', '_blank', `width=${pageSize.width},height=${pageSize.height}`);
    //     editWindow.document.write('<html><head><title>Brand List</title>');
    //     editWindow.document.write('<style>@media print { @page { size: ' + printSize + '; orientation: ' + orientation + '; }}</style>'); // Set print size and layout for editing window
    //     editWindow.document.write('</head><body>');
    //     editWindow.document.write('<h1>Brand List</h1>');
    
    //     // Render the filtered data in a table for editing
    //     editWindow.document.write('<table border="1">');
    //     editWindow.document.write('<thead><tr>');
    
    //     // Render headers for selected columns
    //     const editableHeaders = []; // Array to store headers for editable columns
    //     selectedColumns.forEach(column => {
    //         if (column !== 'action') {
    //             // Display 'Status' if the column name is 'status_id'
    //             const columnHeader = column === 'status_id' ? 'Status' : formatString(column);
    //             editWindow.document.write('<th>' + columnHeader + '</th>');
    
    //             // Push header to editableHeaders if it's an extra column
    //             if (column.startsWith('extra')) {
    //                 editableHeaders.push('<th contenteditable="true">' + columnHeader + '</th>');
    //             }
    //         }
    //     });
    
    //     // Add Extra Column headers with editable input fields
    //     for (let i = 1; i <= extraColumnValue; i++) {
    //         editWindow.document.write(editableHeaders[i - 1] || '<th contenteditable="true">Extra Column ' + i + '</th>');
    //     }
    
    //     editWindow.document.write('</tr></thead>');
    //     editWindow.document.write('<tbody>');
    
    //     // Render rows of data
    //     filteredCategorys.forEach((category, index) => {
    //         editWindow.document.write('<tr>');
    
    //         // Render cells for selected columns
    //         selectedColumns.forEach(column => {
    //             if (column !== 'action') {
    //                 editWindow.document.write('<td' + (column.startsWith('extra') ? ' contenteditable="true"' : '') + '>');
    
    //                 if (column === 'file_path') {
    //                     // Special handling for the 'File Path' column to display images
    //                     editWindow.document.write(`<img src="${process.env.NEXT_PUBLIC_API_URL}:5003/${category.file_path}" style="max-width: 100px;" alt="Image"/>`);
    
    //                 } else if (column === 'serial') {
    //                     // Rendering serial number if the column is 'serial'
    //                     editWindow.document.write(index + 1);
    //                 } else if (column === 'status_id') {
    //                     // Display status based on status_id value
    //                     let statusText = '';
    //                     switch (category[column]) {
    //                         case 1:
    //                             statusText = 'Active';
    //                             break;
    //                         case 2:
    //                             statusText = 'Inactive';
    //                             break;
    //                         case 3:
    //                             statusText = 'Pending';
    //                             break;
    //                         default:
    //                             statusText = 'Unknown';
    //                     }
    //                     editWindow.document.write(statusText);
    //                 } else {
    //                     // Default rendering for other columns
    //                     editWindow.document.write(category[column]);
    //                 }
    //                 editWindow.document.write('</td>');
    //             }
    //         });
    
    //         // Render cells for extra columns
    //         for (let i = 0; i < extraColumnValue; i++) {
    //             editWindow.document.write('<td contenteditable="true"></td>');
    //         }
    
    //         editWindow.document.write('</tr>');
    //     });
    
    //     editWindow.document.write('</tbody></table>');
    //     editWindow.document.write('</body></html>');
    //     editWindow.document.close();
    
    //     // Print the editing window
    //     editWindow.print();
    
    //     // Create PDF
    //     const doc = new jsPDF({
    //         orientation: orientation, // Set orientation based on print layout
    //         unit: 'mm',
    //         format: printSize // Set PDF format based on selected print size
    //     });
    
    //     // Include the extra columns in the header
    //     const headColumns = [...selectedColumns.map(column => column === 'status_id' ? 'Status' : formatString(column))];
    //     for (let i = 1; i <= extraColumnValue; i++) {
    //         headColumns.push("Extra Column " + i);
    //     }
    //     doc.autoTable({
    //         head: [headColumns],
    //         body: filteredCategorys.map(category => {
    //             // Include the extra column values in the body for each row
    //             const row = selectedColumns.filter(column => column !== 'action').map(column => {
    //                 if (column === 'status_id') {
    //                     // Convert status_id to corresponding status text
    //                     switch (category[column]) {
    //                         case 1:
    //                             return 'Active';
    //                         case 2:
    //                             return 'Inactive';
    //                         case 3:
    //                             return 'Pending';
    //                         default:
    //                             return 'Unknown';
    //                     }
    //                 } else {
    //                     return category[column];
    //                 }
    //             });
    //             for (let i = 0; i < extraColumnValue; i++) {
    //                 row.push(""); // Push empty strings for extra columns
    //             }
    //             return row;
    //         })
    //     });
    
    //     // Download PDF
    //     doc.save('filtered_category_list.pdf');
    // };
    
            
        
        
    
    // const generatePDF = () => {
    //     // Get the selected font size value
    //     const selectedFontSize = document.querySelector('.font_size').value;
    
    //     // Get the numeric part of the selected font size value
    //     const fontSize = parseInt(selectedFontSize.split('-')[1]);
    
    //     // Get the value of the extra column input field
    //     const extraColumnValue = parseInt(document.getElementById('extra_column').value);
    
    //     // Create a new window for editing
    //     const editWindow = window.open('', '_blank');
    //     editWindow.document.write('<html><head><title style="font-size:' + fontSize + 'px;">Brand List</title></head><body>');
    //     editWindow.document.write('<h1 style="font-size:' + fontSize + 'px;">Brand List</h1>');
    
    //     // Render the filtered data in a table for editing
    //     editWindow.document.write('<table border="1">');
    //     editWindow.document.write('<thead><tr>');
    
    //     // Render headers for selected columns
    //     const editableHeaders = []; // Array to store headers for editable columns
    //     selectedColumns.forEach(column => {
    //         if (column !== 'action') {
    //             // Display 'Status' if the column name is 'status_id'
    //             const columnHeader = column === 'status_id' ? 'Status' : formatString(column);
    //             editWindow.document.write('<th style="font-size:' + fontSize + 'px;">' + columnHeader + '</th>');
    
    //             // Push header to editableHeaders if it's an extra column
    //             if (column.startsWith('extra')) {
    //                 editableHeaders.push('<th style="font-size:' + fontSize + 'px;" contenteditable="true">' + columnHeader + '</th>');
    //             }
    //         }
    //     });
    
    //     // Add Extra Column headers with editable input fields
    //     for (let i = 1; i <= extraColumnValue; i++) {
    //         editWindow.document.write(editableHeaders[i - 1] || '<th style="font-size:' + fontSize + 'px;" contenteditable="true">Extra Column ' + i + '</th>');
    //     }
    
    //     editWindow.document.write('</tr></thead>');
    //     editWindow.document.write('<tbody>');
    
    //     // Render rows of data
    //     filteredCategorys.forEach((category, index) => {
    //         editWindow.document.write('<tr>');
    
    //         // Render cells for selected columns
    //         selectedColumns.forEach(column => {
    //             if (column !== 'action') {
    //                 editWindow.document.write('<td' + (column.startsWith('extra') ? ' contenteditable="true"' : '') + ' style="font-size:' + fontSize + 'px;">');
    
    //                 if (column === 'file_path') {
    //                     // Special handling for the 'File Path' column to display images
    //                     editWindow.document.write(`<img src="${process.env.NEXT_PUBLIC_API_URL}:5003/${category.file_path}" style="max-width: 100px;" alt="Image"/>`);
    
    //                 } else if (column === 'serial') {
    //                     // Rendering serial number if the column is 'serial'
    //                     editWindow.document.write(index + 1);
    //                 } else if (column === 'status_id') {
    //                     // Display status based on status_id value
    //                     let statusText = '';
    //                     switch (category[column]) {
    //                         case 1:
    //                             statusText = 'Active';
    //                             break;
    //                         case 2:
    //                             statusText = 'Inactive';
    //                             break;
    //                         case 3:
    //                             statusText = 'Pending';
    //                             break;
    //                         default:
    //                             statusText = 'Unknown';
    //                     }
    //                     editWindow.document.write(statusText);
    //                 } else {
    //                     // Default rendering for other columns
    //                     editWindow.document.write(category[column]);
    //                 }
    //                 editWindow.document.write('</td>');
    //             }
    //         });
    
    //         // Render cells for extra columns
    //         for (let i = 0; i < extraColumnValue; i++) {
    //             editWindow.document.write('<td style="font-size:' + fontSize + 'px;" contenteditable="true"></td>');
    //         }
    
    //         editWindow.document.write('</tr>');
    //     });
    
    //     editWindow.document.write('</tbody></table>');
    //     editWindow.document.write('</body></html>');
    //     editWindow.document.close();
    
    //     // Print the editing window
    //     editWindow.print();
    
    //     // Create PDF
    //     const doc = new jsPDF();
    //     // Include the extra columns in the header
    //     const headColumns = [...selectedColumns.map(column => column === 'status_id' ? 'Status' : formatString(column))];
    //     for (let i = 1; i <= extraColumnValue; i++) {
    //         headColumns.push("Extra Column " + i);
    //     }
    //     doc.autoTable({
    //         head: [headColumns],
    //         body: filteredCategorys.map(category => {
    //             // Include the extra column values in the body for each row
    //             const row = selectedColumns.filter(column => column !== 'action').map(column => {
    //                 if (column === 'status_id') {
    //                     // Convert status_id to corresponding status text
    //                     switch (category[column]) {
    //                         case 1:
    //                             return 'Active';
    //                         case 2:
    //                             return 'Inactive';
    //                         case 3:
    //                             return 'Pending';
    //                         default:
    //                             return 'Unknown';
    //                     }
    //                 } else {
    //                     return category[column];
    //                 }
    //             });
    //             for (let i = 0; i < extraColumnValue; i++) {
    //                 row.push(""); // Push empty strings for extra columns
    //             }
    //             return row;
    //         })
    //     });
    
    //     // Download PDF
    //     doc.save('filtered_category_list.pdf');
    // };

    // const generatePDF = () => {
    //     // Get the selected zoom size value
    //     const selectedZoom = document.querySelector('.zoom_size').value;

    //     // Convert zoom value to a numeric multiplier
    //     const zoomMultiplier = parseFloat(selectedZoom) / 100;

    //     // Get the selected font size value
    //     const selectedFontSize = document.querySelector('.font_size').value;

    //     // Get the numeric part of the selected font size value
    //     const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;

    //     // Get the value of the extra column input field
    //     const extraColumnValue = parseInt(document.getElementById('extra_column').value);

    //     // Get the selected print layout (Landscape or Portrait)
    //     const selectedLayout = document.getElementById('print_layout').value;

    //     // Determine orientation based on the selected layout
    //     const orientation = selectedLayout === 'Landscape' ? 'landscape' : 'portrait';

    //     // Create a new window for editing
    //     const editWindow = window.open('', '_blank');
    //     editWindow.document.write('<html><head><title style="font-size:' + fontSize + 'px;">Brand List</title></head><body>');
    //     editWindow.document.write('<h1 style="font-size:' + fontSize + 'px;">Brand List</h1>');

    //     // Render the filtered data in a table for editing
    //     editWindow.document.write('<table border="1">');
    //     editWindow.document.write('<thead><tr>');

    //     // Render headers for selected columns
    //     const editableHeaders = []; // Array to store headers for editable columns
    //     selectedColumns.forEach(column => {
    //         if (column !== 'action') {
    //             // Display 'Status' if the column name is 'status_id'
    //             const columnHeader = column === 'status_id' ? 'Status' : formatString(column);
    //             editWindow.document.write('<th style="font-size:' + fontSize + 'px;">' + columnHeader + '</th>');

    //             // Push header to editableHeaders if it's an extra column
    //             if (column.startsWith('extra')) {
    //                 editableHeaders.push('<th style="font-size:' + fontSize + 'px;" contenteditable="true">' + columnHeader + '</th>');
    //             }
    //         }
    //     });

    //     // Add Extra Column headers with editable input fields
    //     for (let i = 1; i <= extraColumnValue; i++) {
    //         editWindow.document.write(editableHeaders[i - 1] || '<th style="font-size:' + fontSize + 'px;" contenteditable="true">Extra Column ' + i + '</th>');
    //     }

    //     editWindow.document.write('</tr></thead>');
    //     editWindow.document.write('<tbody>');

    //     // Render rows of data
    //     filteredCategorys.forEach((category, index) => {
    //         editWindow.document.write('<tr>');

    //         // Render cells for selected columns
    //         selectedColumns.forEach(column => {
    //             if (column !== 'action') {
    //                 editWindow.document.write('<td' + (column.startsWith('extra') ? ' contenteditable="true"' : '') + ' style="font-size:' + fontSize + 'px;">');

    //                 if (column === 'file_path') {
    //                     // Special handling for the 'File Path' column to display images
    //                     editWindow.document.write(`<img src="${process.env.NEXT_PUBLIC_API_URL}:5003/${category.file_path}" style="max-width: 100px;" alt="Image"/>`);

    //                 } else if (column === 'serial') {
    //                     // Rendering serial number if the column is 'serial'
    //                     editWindow.document.write(index + 1);
    //                 } else if (column === 'status_id') {
    //                     // Display status based on status_id value
    //                     let statusText = '';
    //                     switch (category[column]) {
    //                         case 1:
    //                             statusText = 'Active';
    //                             break;
    //                         case 2:
    //                             statusText = 'Inactive';
    //                             break;
    //                         case 3:
    //                             statusText = 'Pending';
    //                             break;
    //                         default:
    //                             statusText = 'Unknown';
    //                     }
    //                     editWindow.document.write(statusText);
    //                 } else {
    //                     // Default rendering for other columns
    //                     editWindow.document.write(category[column]);
    //                 }
    //                 editWindow.document.write('</td>');
    //             }
    //         });

    //         // Render cells for extra columns
    //         for (let i = 0; i < extraColumnValue; i++) {
    //             editWindow.document.write('<td style="font-size:' + fontSize + 'px;" contenteditable="true"></td>');
    //         }

    //         editWindow.document.write('</tr>');
    //     });

    //     editWindow.document.write('</tbody></table>');
    //     editWindow.document.write('</body></html>');
    //     editWindow.document.close();

    //     // Print the editing window
    //     editWindow.print();

    //     // Create PDF
    //     const doc = new jsPDF({
    //         orientation: orientation, // Adjust orientation based on selected layout
    //         unit: 'mm',
    //         format: [297 * zoomMultiplier, 210 * zoomMultiplier] // A4 size
    //     });

    //     // Include the extra columns in the header
    //     const headColumns = [...selectedColumns.map(column => column === 'status_id' ? 'Status' : formatString(column))];
    //     for (let i = 1; i <= extraColumnValue; i++) {
    //         headColumns.push("Extra Column " + i);
    //     }
    //     doc.autoTable({
    //         head: [headColumns],
    //         body: filteredCategorys.map(category => {
    //             // Include the extra column values in the body for each row
    //             const row = selectedColumns.filter(column => column !== 'action').map(column => {
    //                 if (column === 'status_id') {
    //                     // Convert status_id to corresponding status text
    //                     switch (category[column]) {
    //                         case 1:
    //                             return 'Active';
    //                         case 2:
    //                             return 'Inactive';
    //                         case 3:
    //                             return 'Pending';
    //                         default:
    //                             return 'Unknown';
    //                     }
    //                 } else {
    //                     return category[column];
    //                 }
    //             });
    //             for (let i = 0; i < extraColumnValue; i++) {
    //                 row.push(""); // Push empty strings for extra columns
    //             }
    //             return row;
    //         })
    //     });

    //     // Download PDF
    //     doc.save('filtered_category_list.pdf');
    // };

    // const generatePDF = () => {
    //     // Get the selected zoom size value
    //     const selectedZoom = document.querySelector('.zoom_size').value;

    //     // Convert zoom value to a numeric multiplier
    //     const zoomMultiplier = parseFloat(selectedZoom) / 100;

    //     // Get the selected font size value
    //     const selectedFontSize = document.querySelector('.font_size').value;

    //     // Get the numeric part of the selected font size value
    //     const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;

    //     // Get the value of the extra column input field
    //     const extraColumnValue = parseInt(document.getElementById('extra_column').value);

    //     // Create a new window for editing
    //     const editWindow = window.open('', '_blank');
    //     editWindow.document.write('<html><head><title style="font-size:' + fontSize + 'px;">Brand List</title></head><body>');
    //     editWindow.document.write('<h1 style="font-size:' + fontSize + 'px;">Brand List</h1>');

    //     // Render the filtered data in a table for editing
    //     editWindow.document.write('<table border="1">');
    //     editWindow.document.write('<thead><tr>');

    //     // Render headers for selected columns
    //     const editableHeaders = []; // Array to store headers for editable columns
    //     selectedColumns.forEach(column => {
    //         if (column !== 'action') {
    //             // Display 'Status' if the column name is 'status_id'
    //             const columnHeader = column === 'status_id' ? 'Status' : formatString(column);
    //             editWindow.document.write('<th style="font-size:' + fontSize + 'px;">' + columnHeader + '</th>');

    //             // Push header to editableHeaders if it's an extra column
    //             if (column.startsWith('extra')) {
    //                 editableHeaders.push('<th style="font-size:' + fontSize + 'px;" contenteditable="true">' + columnHeader + '</th>');
    //             }
    //         }
    //     });

    //     // Add Extra Column headers with editable input fields
    //     for (let i = 1; i <= extraColumnValue; i++) {
    //         editWindow.document.write(editableHeaders[i - 1] || '<th style="font-size:' + fontSize + 'px;" contenteditable="true">Extra Column ' + i + '</th>');
    //     }

    //     editWindow.document.write('</tr></thead>');
    //     editWindow.document.write('<tbody>');

    //     // Render rows of data
    //     filteredCategorys.forEach((category, index) => {
    //         editWindow.document.write('<tr>');

    //         // Render cells for selected columns
    //         selectedColumns.forEach(column => {
    //             if (column !== 'action') {
    //                 editWindow.document.write('<td' + (column.startsWith('extra') ? ' contenteditable="true"' : '') + ' style="font-size:' + fontSize + 'px;">');

    //                 if (column === 'file_path') {
    //                     // Special handling for the 'File Path' column to display images
    //                     editWindow.document.write(`<img src="${process.env.NEXT_PUBLIC_API_URL}:5003/${category.file_path}" style="max-width: 100px;" alt="Image"/>`);

    //                 } else if (column === 'serial') {
    //                     // Rendering serial number if the column is 'serial'
    //                     editWindow.document.write(index + 1);
    //                 } else if (column === 'status_id') {
    //                     // Display status based on status_id value
    //                     let statusText = '';
    //                     switch (category[column]) {
    //                         case 1:
    //                             statusText = 'Active';
    //                             break;
    //                         case 2:
    //                             statusText = 'Inactive';
    //                             break;
    //                         case 3:
    //                             statusText = 'Pending';
    //                             break;
    //                         default:
    //                             statusText = 'Unknown';
    //                     }
    //                     editWindow.document.write(statusText);
    //                 } else {
    //                     // Default rendering for other columns
    //                     editWindow.document.write(category[column]);
    //                 }
    //                 editWindow.document.write('</td>');
    //             }
    //         });

    //         // Render cells for extra columns
    //         for (let i = 0; i < extraColumnValue; i++) {
    //             editWindow.document.write('<td style="font-size:' + fontSize + 'px;" contenteditable="true"></td>');
    //         }

    //         editWindow.document.write('</tr>');
    //     });

    //     editWindow.document.write('</tbody></table>');
    //     editWindow.document.write('</body></html>');
    //     editWindow.document.close();

    //     // Print the editing window
    //     editWindow.print();

    //     // Create PDF
    //     const doc = new jsPDF({
    //         orientation: 'landscape', // Adjust orientation if needed
    //         unit: 'mm',
    //         format: [297 * zoomMultiplier, 210 * zoomMultiplier] // A4 size
    //     });

    //     // Include the extra columns in the header
    //     const headColumns = [...selectedColumns.map(column => column === 'status_id' ? 'Status' : formatString(column))];
    //     for (let i = 1; i <= extraColumnValue; i++) {
    //         headColumns.push("Extra Column " + i);
    //     }
    //     doc.autoTable({
    //         head: [headColumns],
    //         body: filteredCategorys.map(category => {
    //             // Include the extra column values in the body for each row
    //             const row = selectedColumns.filter(column => column !== 'action').map(column => {
    //                 if (column === 'status_id') {
    //                     // Convert status_id to corresponding status text
    //                     switch (category[column]) {
    //                         case 1:
    //                             return 'Active';
    //                         case 2:
    //                             return 'Inactive';
    //                         case 3:
    //                             return 'Pending';
    //                         default:
    //                             return 'Unknown';
    //                     }
    //                 } else {
    //                     return category[column];
    //                 }
    //             });
    //             for (let i = 0; i < extraColumnValue; i++) {
    //                 row.push(""); // Push empty strings for extra columns
    //             }
    //             return row;
    //         })
    //     });

    //     // Download PDF
    //     doc.save('filtered_category_list.pdf');
    // };


    // const generatePDF = () => {
    //     // Get the value of the extra column input field
    //     const extraColumnValue = parseInt(document.getElementById('extra_column').value);

    //     // Create a new window for editing
    //     const editWindow = window.open('', '_blank');
    //     editWindow.document.write('<html><head><title>Brand List</title></head><body>');
    //     editWindow.document.write('<h1>Brand List</h1>');

    //     // Render the filtered data in a table for editing
    //     editWindow.document.write('<table border="1">');
    //     editWindow.document.write('<thead><tr>');

    //     // Render headers for selected columns
    //     const editableHeaders = []; // Array to store headers for editable columns
    //     selectedColumns.forEach(column => {
    //         if (column !== 'action') {
    //             // Display 'Status' if the column name is 'status_id'
    //             const columnHeader = column === 'status_id' ? 'Status' : formatString(column);
    //             editWindow.document.write('<th>' + columnHeader + '</th>');

    //             // Push header to editableHeaders if it's an extra column
    //             if (column.startsWith('extra')) {
    //                 editableHeaders.push('<th contenteditable="true">' + columnHeader + '</th>');
    //             }
    //         }
    //     });

    //     // Add Extra Column headers with editable input fields
    //     for (let i = 1; i <= extraColumnValue; i++) {
    //         editWindow.document.write(editableHeaders[i - 1] || '<th contenteditable="true">Extra Column ' + i + '</th>');
    //     }

    //     editWindow.document.write('</tr></thead>');
    //     editWindow.document.write('<tbody>');

    //     // Render rows of data
    //     filteredCategorys.forEach((category, index) => {
    //         editWindow.document.write('<tr>');

    //         // Render cells for selected columns
    //         selectedColumns.forEach(column => {
    //             if (column !== 'action') {
    //                 editWindow.document.write('<td' + (column.startsWith('extra') ? ' contenteditable="true"' : '') + '>');

    //                 if (column === 'file_path') {
    //                     // Special handling for the 'File Path' column to display images
    //                     editWindow.document.write(`<img src="${process.env.NEXT_PUBLIC_API_URL}:5003/${category.file_path}" style="max-width: 100px;" alt="Image"/>`);

    //                 } else if (column === 'serial') {
    //                     // Rendering serial number if the column is 'serial'
    //                     editWindow.document.write(index + 1);
    //                 } else if (column === 'status_id') {
    //                     // Display status based on status_id value
    //                     let statusText = '';
    //                     switch (category[column]) {
    //                         case 1:
    //                             statusText = 'Active';
    //                             break;
    //                         case 2:
    //                             statusText = 'Inactive';
    //                             break;
    //                         case 3:
    //                             statusText = 'Pending';
    //                             break;
    //                         default:
    //                             statusText = 'Unknown';
    //                     }
    //                     editWindow.document.write(statusText);
    //                 } else {
    //                     // Default rendering for other columns
    //                     editWindow.document.write(category[column]);
    //                 }
    //                 editWindow.document.write('</td>');
    //             }
    //         });

    //         // Render cells for extra columns
    //         for (let i = 0; i < extraColumnValue; i++) {
    //             editWindow.document.write('<td contenteditable="true"></td>');
    //         }

    //         editWindow.document.write('</tr>');
    //     });

    //     editWindow.document.write('</tbody></table>');
    //     editWindow.document.write('</body></html>');
    //     editWindow.document.close();

    //     // Print the editing window
    //     editWindow.print();

    //     // Create PDF
    //     const doc = new jsPDF();
    //     // Include the extra columns in the header
    //     const headColumns = [...selectedColumns.map(column => column === 'status_id' ? 'Status' : formatString(column))];
    //     for (let i = 1; i <= extraColumnValue; i++) {
    //         headColumns.push("Extra Column " + i);
    //     }
    //     doc.autoTable({
    //         head: [headColumns],
    //         body: filteredCategorys.map(category => {
    //             // Include the extra column values in the body for each row
    //             const row = selectedColumns.filter(column => column !== 'action').map(column => {
    //                 if (column === 'status_id') {
    //                     // Convert status_id to corresponding status text
    //                     switch (category[column]) {
    //                         case 1:
    //                             return 'Active';
    //                         case 2:
    //                             return 'Inactive';
    //                         case 3:
    //                             return 'Pending';
    //                         default:
    //                             return 'Unknown';
    //                     }
    //                 } else {
    //                     return category[column];
    //                 }
    //             });
    //             for (let i = 0; i < extraColumnValue; i++) {
    //                 row.push(""); // Push empty strings for extra columns
    //             }
    //             return row;
    //         })
    //     });

    //     // Download PDF
    //     doc.save('filtered_category_list.pdf');
    // };



    // const handleSearch = () => {
    //     console.log("Search button clicked.");
    //     // Check if options are selected before updating the table
    //     if (selectedColumns.length > 0 || searchQuery == '' || statusFilter !== '' || selectedOrder !== '') {
    //         console.log("Search button clicked. 1")
    //         const query = String(searchQuery).toLowerCase();
    //         const filteredCategories = warrantys.filter(
    //             (category) =>
    //                 String(category.warranty_name).toLowerCase().includes(query) &&
    //                 (statusFilter === '' || category.status_id.toString() === statusFilter) &&
    //                 (selectedColumns.length === 0 ||
    //                     selectedColumns.some((column) =>
    //                         String(category[column]).toLowerCase().includes(query)
    //                     ))
    //         );
    //         console.log("Search button clicked. 2")
    //         // Apply sorting based on the selected order
    //         const sortedCategories = [...filteredCategories];
    //         if (selectedOrder === '1') {
    //             console.log("Search button clicked. 3")
    //             sortedCategories.sort((a, b) => (a.id > b.id ? 1 : -1)); // Ascending order
    //         } else if (selectedOrder === '2') {
    //             sortedCategories.sort((a, b) => (a.id < b.id ? 1 : -1)); // Descending order
    //         }

    //         setFilteredCategorys(sortedCategories);
    //     } else {
    //         // Handle the case when no options are selected
    //         // You can show an alert or handle it based on your requirement
    //         console.log('Please select options before searching.');
    //     }
    // };

      // Assuming this is inside your brand_search function
  // brand_search: async (req, res) => {
  //   try {
  //       console.log("Search button clicked.");
  //       // Extract necessary data from request
  //       const { selectedColumns, searchQuery, statusFilter, selectedOrder } = req.body;

  //       // Check if options are selected before updating the table
  //       if (selectedColumns?.length > 0 || searchQuery == '' || statusFilter !== '' || selectedOrder !== '') {
  //           console.log("Search button clicked. 1");
  //           const query = searchQuery?.toLowerCase();
  //           let sql = `SELECT * FROM brand WHERE LOWER(brand_name) LIKE '%${query}%'`;

  //           if (statusFilter !== '') {
  //               sql += ` AND status_id = ${statusFilter}`;
  //           }

  //           // You might need to adjust the column names according to your schema
  //           // if (selectedColumns?.length > 0) {
  //           //     sql += ` AND (${selectedColumns.map(column => `LOWER(${column}) LIKE '%${query}%'`).join(' OR ')})`;
  //           // }

  //           if (selectedOrder === '1') {
  //               sql += ' ORDER BY id ASC'; // Ascending order
  //           } else if (selectedOrder === '2') {
  //               sql += ' ORDER BY id DESC'; // Descending order
  //           }

  //           console.log("SQL Query:", sql);

  //           // Execute the constructed SQL query
  //           connection.query(sql, (error, results, fields) => {
  //               if (error) {
  //                   console.error("Error occurred during search:", error);
  //                   // Handle error
  //                   res.status(500).json({ error: "An error occurred during search." });
  //               } else {
  //                   console.log("Search results:", results);
  //                   // Handle results, e.g., setFilteredCategorys(results);
  //                   res.status(200).json({ results });
  //               }
  //           });
  //       } else {
  //           // Handle the case when no options are selected
  //           // You can show an alert or handle it based on your requirement
  //           console.log('Please select options before searching.');
  //           res.status(400).json({ error: "Please select options before searching." });
  //       }
  //   } catch (error) {
  //       console.error("An error occurred:", error);
  //       res.status(500).json({ error: "An error occurred." });
  //   }
  // },
  // brand_search: async (req, res) => {
  //   try {
  //       console.log("Search button clicked.");
  
  //       // Extract necessary data from request
  //       const { selectedColumns, searchQuery, statusFilter, selectedOrder, fromDate, toDate } = req.body;
  //       const page = parseInt(req.query.page) || 1; // Parse page as integer, default to 1 if not provided
  //    // Get page number from query parameters
  //       const limit = 10; // Define the number of results per page
  //       const offset = (page - 1) * limit; // Calculate the offset
  
  //       // Construct the base SQL query
  //       let sql = `SELECT * FROM brand WHERE 1`;
  
  //       // Add search query condition
  //       if (searchQuery) {
  //           const query = searchQuery.toLowerCase();
  //           sql += ` AND LOWER(brand_name) LIKE '%${query}%'`;
  //       }
  
  //       // Add status filter condition
  //       if (statusFilter !== '') {
  //           sql += ` AND status_id = ${statusFilter}`;
  //       }
  
  //       // Add date range condition
  //       if (fromDate && toDate) {
  //           sql += ` AND created_date BETWEEN '${fromDate}' AND '${toDate}'`;
  //       }
  
  //       // Add column sorting
  //       if (selectedOrder === '1') {
  //           sql += ' ORDER BY id ASC'; // Ascending order
  //       } else if (selectedOrder === '2') {
  //           sql += ' ORDER BY id DESC'; // Descending order
  //       }
  
  //       // Add pagination
  //       sql += ` LIMIT ${limit} OFFSET ${offset}`;
  
  //       console.log("SQL Query:", sql);
  
  //       // Execute the constructed SQL query
  //       connection.query(sql, (error, results, fields) => {
  //           if (error) {
  //               console.error("Error occurred during search:", error);
  //               res.status(500).json({ error: "An error occurred during search." });
  //           } else {
  //               console.log("Search results:", results);
  //               // Send the results along with pagination info
  //               res.status(200).json({ results });
  //           }
  //       });
  //   } catch (error) {
  //       console.error("An error occurred:", error);
  //       res.status(500).json({ error: "An error occurred." });
  //   }
  // },

    // brand_list_paigination: async (req, res) => {
  //   const pageNo = Number(req.params.pageNo);
  //   const perPage = Number(req.params.perPage);
  //   const { searchQuery, statusFilter, fromDate, toDate } = req.query; // Extract query parameters from URL
  
  //   try {
  //     const skipRows = (pageNo - 1) * perPage;
  //     let sql = "SELECT * FROM brand WHERE 1";
  //     const queryParams = [];

  //     // Add search query condition
  //     if (searchQuery) {
  //       const query = searchQuery.toLowerCase();
  //       sql += ` AND LOWER(brand_name) LIKE ?`;
  //       queryParams.push(`%${query}%`);
  //     }

  //     // Add status filter condition
  //     if (statusFilter) {
  //       sql += ` AND status_id = ?`;
  //       queryParams.push(statusFilter);
  //     }
  
  //     // Add date range condition
  //     if (fromDate && toDate) {
  //       sql += ` AND created_date BETWEEN ? AND ?`;
  //       queryParams.push(fromDate, toDate);
  //     }
  
  //     // Add pagination
  //     sql += " LIMIT ?, ?";
  //     queryParams.push(skipRows, perPage);

  //     connection.query(sql, queryParams, (error, result) => {
  //       if (!error) {
  //         res.send(result);
  //       } else {
  //         console.log("Error occurred during pagination search:", error);
  //         res.status(500).json({ error: "An error occurred during pagination search." });
  //       }
  //     });
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //     res.status(500).json({ error: "An error occurred." });
  //   }
  // },
//   brand_search: async (req, res) => {
//     try {
//         console.log("Search button clicked.");
//         // Extract necessary data from request
//         const { selectedColumns, searchQuery, statusFilter, selectedOrder } = req.body;

//         // Check if options are selected before updating the table
//         if (selectedColumns?.length > 0 || searchQuery == '' || statusFilter !== '' || selectedOrder !== '') {
//             console.log("Search button clicked. 1");
//             const query = searchQuery?.toLowerCase();
//             let sql = `SELECT * FROM brand WHERE LOWER(brand_name) LIKE '%${query}%'`;

//             if (statusFilter !== '') {
//                 sql += ` AND status_id = ${statusFilter}`;
//             }

//             // You might need to adjust the column names according to your schema
//             if (selectedColumns?.length > 0) {
//                 sql += ` AND (${selectedColumns.map(column => `LOWER(${column}) LIKE '%${query}%'`).join(' OR ')})`;
//             }

//             if (selectedOrder === '1') {
//                 sql += ' ORDER BY id ASC'; // Ascending order
//             } else if (selectedOrder === '2') {
//                 sql += ' ORDER BY id DESC'; // Descending order
//             }

//             console.log("SQL Query:", sql);

//             // Execute the constructed SQL query
//             connection.query(sql, (error, results, fields) => {
//                 if (error) {
//                     console.error("Error occurred during search:", error);
//                     // Handle error
//                     res.status(500).json({ error: "An error occurred during search." });
//                 } else {
//                     console.log("Search results:", results);
//                     // Handle results, e.g., setFilteredCategorys(results);
//                     res.status(200).json({ results });
//                 }
//             });
//         } else {
//             // Handle the case when no options are selected
//             // You can show an alert or handle it based on your requirement
//             console.log('Please select options before searching.');
//             res.status(400).json({ error: "Please select options before searching." });
//         }
//     } catch (error) {
//         console.error("An error occurred:", error);
//         res.status(500).json({ error: "An error occurred." });
//     }
// },
// const generatePDF = () => {
//     // Get the value of the extra column input field
//     const extraColumnValue = parseInt(document.getElementById('extra_column').value);

//     // Create a new window for editing
//     const editWindow = window.open('', '_blank');
//     editWindow.document.write('<html><head><title>Brand List</title></head><body>');
//     editWindow.document.write('<h1>Brand List</h1>');

//     // Render the filtered data in a table for editing
//     editWindow.document.write('<table border="1">');
//     editWindow.document.write('<thead><tr>');

//     // Render headers for selected columns
//     selectedColumns.forEach(column => {
//         if (column !== 'action') {
//             // Display 'Status' if the column name is 'status_id'
//             const columnHeader = column === 'status_id' ? 'Status' : formatString(column);
//             editWindow.document.write('<th>' + columnHeader + '</th>');
//         }
//     });

//     // Add Extra Column headers with editable input fields
//     for (let i = 1; i <= extraColumnValue; i++) {
//         editWindow.document.write('<th contenteditable="true">Extra Column ' + i + '</th>');
//     }

//     editWindow.document.write('</tr></thead>');
//     editWindow.document.write('<tbody>');

//     // Render rows of data
//     searchResults.forEach((category, index) => {
//         editWindow.document.write('<tr>');

//         // Render cells for selected columns
//         selectedColumns.forEach(column => {
//             if (column !== 'action') {
//                 editWindow.document.write('<td contenteditable="true">');
//                 if (column === 'file_path') {
                    
//                     // Special handling for the 'File Path' column to display images
//                     editWindow.document.write(`<img src="${process.env.NEXT_PUBLIC_API_URL}:5003/${category.file_path}" style="max-width: 100px;" alt="Image"/>`);

//                 } else if (column === 'serial') {
//                     // Rendering serial number if the column is 'serial'
//                     editWindow.document.write(index + 1);
//                 } else if (column === 'status_id') {
//                     // Display status based on status_id value
//                     let statusText = '';
//                     switch (category[column]) {
//                         case 1:
//                             statusText = 'Active';
//                             break;
//                         case 2:
//                             statusText = 'Inactive';
//                             break;
//                         case 3:
//                             statusText = 'Pending';
//                             break;
//                         default:
//                             statusText = 'Unknown';
//                     }
//                     editWindow.document.write(statusText);
//                 } else {
//                     // Default rendering for other columns
//                     editWindow.document.write(category[column]);
//                 }
//                 editWindow.document.write('</td>');
//             }
//         });

//         // Render cells for extra columns
//         for (let i = 0; i < extraColumnValue; i++) {
//             editWindow.document.write('<td contenteditable="true"></td>');
//         }

//         editWindow.document.write('</tr>');
//     });

//     editWindow.document.write('</tbody></table>');
//     editWindow.document.write('</body></html>');
//     editWindow.document.close();

//     // Print the editing window
//     editWindow.print();

//     // Create PDF
//     const doc = new jsPDF();
//     // Include the extra columns in the header
//     const headColumns = [...selectedColumns.map(column => column === 'status_id' ? 'Status' : formatString(column))];
//     for (let i = 1; i <= extraColumnValue; i++) {
//         headColumns.push("Extra Column " + i);
//     }
//     doc.autoTable({
//         head: [headColumns],
//         body: searchResults.map(category => {
//             // Include the extra column values in the body for each row
//             const row = selectedColumns.filter(column => column !== 'action').map(column => {
//                 if (column === 'status_id') {
//                     // Convert status_id to corresponding status text
//                     switch (category[column]) {
//                         case 1:
//                             return 'Active';
//                         case 2:
//                             return 'Inactive';
//                         case 3:
//                             return 'Pending';
//                         default:
//                             return 'Unknown';
//                     }
//                 } else {
//                     return category[column];
//                 }
//             });
//             for (let i = 0; i < extraColumnValue; i++) {
//                 row.push(""); // Push empty strings for extra columns
//             }
//             return row;
//         })
//     });

//     // Download PDF
//     doc.save('filtered_category_list.pdf');
// };



// const generatePDF = () => {
//     // Get the value of the extra column input field
//     const extraColumnValue = parseInt(document.getElementById('extra_column').value);

//     // Create a new window for editing
//     const editWindow = window.open('', '_blank');
//     editWindow.document.write('<html><head><title>Edit Filtered Category List</title></head><body>');
//     editWindow.document.write('<h1>Edit Filtered Category List</h1>');

//     // Render the filtered data in a table for editing
//     editWindow.document.write('<table border="1">');
//     editWindow.document.write('<thead><tr>');

//     // Render headers for selected columns
//     selectedColumns.forEach(column => {
//         if (column !== 'action') {
//             editWindow.document.write('<th>' + formatString(column) + '</th>');
//         }
//     });

//     // Add Extra Column headers with editable input fields
//     for (let i = 1; i <= extraColumnValue; i++) {
//         editWindow.document.write('<th contenteditable="true">Extra Column ' + i + '</th>');
//     }

//     editWindow.document.write('</tr></thead>');
//     editWindow.document.write('<tbody>');

//     // Render rows of data
//     searchResults.forEach((category, index) => {
//         editWindow.document.write('<tr>');

//         // Render cells for selected columns
//         selectedColumns.forEach(column => {
//             if (column !== 'action') {
//                 editWindow.document.write('<td contenteditable="true">');
//                 if (column === 'file_path') {
//                     // Special handling for the 'File Path' column to display images
//                     editWindow.document.write('<img src="' + category[column] + '" style="max-width: 100px;" alt="Image"/>');
//                 } else if (column === 'serial') {
//                     // Rendering serial number if the column is 'serial'
//                     editWindow.document.write(index + 1);
//                 } else {
//                     // Default rendering for other columns
//                     editWindow.document.write(category[column]);
//                 }
//                 editWindow.document.write('</td>');
//             }
//         });

//         // Render cells for extra columns
//         for (let i = 0; i < extraColumnValue; i++) {
//             editWindow.document.write('<td contenteditable="true"></td>');
//         }

//         editWindow.document.write('</tr>');
//     });

//     editWindow.document.write('</tbody></table>');
//     editWindow.document.write('</body></html>');
//     editWindow.document.close();

//     // Print the editing window
//     editWindow.print();

//     // Create PDF
//     const doc = new jsPDF();
//     // Include the extra columns in the header
//     const headColumns = [...selectedColumns.map(column => formatString(column))];
//     for (let i = 1; i <= extraColumnValue; i++) {
//         headColumns.push("Extra Column " + i);
//     }
//     doc.autoTable({
//         head: [headColumns],
//         body: searchResults.map(category => {
//             // Include the extra column values in the body for each row
//             const row = selectedColumns.filter(column => column !== 'action').map(column => category[column]);
//             for (let i = 0; i < extraColumnValue; i++) {
//                 row.push(""); // Push empty strings for extra columns
//             }
//             return row;
//         })
//     });

//     // Download PDF
//     doc.save('filtered_category_list.pdf');
// };

// const handleExcelDownload = () => {
//     setLoading(true);
//     const column = columnListSelectedArray
//     const worksheet = XLSX.utils.json_to_sheet(searchResults);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//     XLSX.writeFile(workbook, 'search_results.xlsx');
//     setLoading(false);
// };
// const handleExcelDownload = () => {
//     setLoading(true);


//     const totalColumns = selectedColumns.length;

//     const worksheet = XLSX.utils.json_to_sheet(searchResults);

//     // Calculate width for each column
//     const columnWidth = 100 / totalColumns;

//     // Set width for each column
//     const columnWidths = [];
//     for (let i = 0; i < totalColumns; i++) {
//         columnWidths.push({ wpx: columnWidth * totalColumns }); // Multiplying by 640 to convert percentage width to Excel's pixel width
//     }
//     worksheet['!cols'] = columnWidths;

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//     XLSX.writeFile(workbook, 'search_results.xlsx');

//     setLoading(false);
// };







// ---------------------Miraj

// const downloadPdfs = () => {
//     const doc = new jsPDF();
    
//     // Filter out the 'action' column from selectedColumns
//     const columnsToDisplay = selectedColumns.filter(column => column !== 'action');
    
//     // Prepare head and body data for autoTable
//     const headData = columnsToDisplay.map(column => formatString(column));

//     const bodyData = searchResults.map((category, i) => {
//         const rowData = columnsToDisplay.map(column => {
//             if (column === 'serial') {
//                 return i + 1; // Rendering serial number
//             } 
            
//             else if (column === 'file_path') {
//                 // Return the URL of the image directly
//                 const imgData = `${process.env.NEXT_PUBLIC_API_URL}:5003/${category.file_path}`;
//                 return loadImage( imgData)
               
//             } 
            
//             else if (column === 'status_id') {
//                 // Handle status ID
//                 const statusId = category.status_id;
//                 if (statusId === 1) {
//                     return 'Active';
//                 } else if (statusId === 2) {
//                     return 'Inactive';
//                 } else if (statusId === 3) {
//                     return 'Pending';
//                 } else {
//                     return 'Unknown';
//                 }
//             } else {
//                 return category[column];
//             }
//         });

//         return rowData;
//     });

//     // Generate autoTable
//     doc.autoTable({
//         head: [headData],
//         body: bodyData,

//     });

//     // Download PDF
//     doc.save('filtered_category_list.pdf');
// }

// ---------------------Miraj



// Main
// const generatePDF = () => {
//   // Get the selected zoom size value
//   const selectedZoom = document.querySelector('.zoom_size').value;

//   // Convert zoom value to a numeric multiplier
//   let zoomMultiplier = 100; // Default zoom multiplier
//   if (selectedZoom !== '') {
//       zoomMultiplier = parseFloat(selectedZoom) / 100;
//   }

//   // Get the selected font size value
//   const selectedFontSize = document.querySelector('.font_size').value;

//   // Get the numeric part of the selected font size value
//   const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;

//   // Get the value of the extra column input field
//   const extraColumnValue = parseInt(document.getElementById('extra_column').value);

//   // Get the selected print layout (Landscape or Portrait)
//   const selectedLayout = document.getElementById('print_layout').value;

//   // Determine orientation based on the selected layout
//   const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

//   // Get the selected print size (A4, A3, Legal)
//   const selectedPrintSize = document.getElementById('print_size').value;
//   console.log(zoomMultiplier, 'zoomMultiplier')
//   // Set the page dimensions based on the selected print size
//   // Set the page dimensions based on the selected print size
//   let pageWidth, pageHeight;
//   switch (selectedPrintSize) {
//       case 'A4':
//           pageWidth = 210 * zoomMultiplier;
//           pageHeight = 297 * zoomMultiplier;
//           break;
//       case 'A3':
//           pageWidth = 297 * zoomMultiplier;
//           pageHeight = 420 * zoomMultiplier;
//           break;
//       case 'legal':
//           pageWidth = 216 * zoomMultiplier; // Width for Legal size
//           pageHeight = 356 * zoomMultiplier; // Height for Legal size
//           break;
//       default:
//           // Default to A4 size
//           pageWidth = 210 * zoomMultiplier;
//           pageHeight = 297 * zoomMultiplier;
//           break;
//   }


//   console.log("Page Width:", pageWidth);
//   console.log("Page Height:", pageHeight);
//   if (isNaN(pageWidth) || isNaN(pageHeight) || pageWidth <= 0 || pageHeight <= 0) {
//       console.error("Invalid page dimensions. Please check calculations.");
//       return;
//   }


//   // Create a new window for editing
//   const editWindow = window.open('', '_blank');

//   editWindow.document.write('<html><head><title>Brand List</title><style> @page { size: ' + selectedPrintSize + ' ' + orientation + '; } @media print { @page { size: ' + selectedPrintSize + ' ' + orientation + '; } }</style></head><body>');


//   // editWindow.document.write('<html><head><title>Brand List</title></head><style> @page { size: ' + orientation + '; }</style><body>');

//   editWindow.document.write('<h1 style="text-align: center">Color List</h1>');


//   // Render the filtered data in a table for editing
//   editWindow.document.write('<table style="width: 100%"  border="1">');
//   editWindow.document.write('<thead><tr>');

//   // Render headers for selected columns
//   const editableHeaders = []; // Array to store headers for editable columns
//   selectedColumns.forEach(column => {
//       if (column !== 'action') {
//           // Display 'Status' if the column name is 'status_id'
//           const columnHeader = column === 'status_id' ? 'Status' : formatString(column);
//           editWindow.document.write('<th style="font-size:' + fontSize + 'px;"><h2>' + columnHeader + '</h2></th>');

//           // Push header to editableHeaders if it's an extra column
//           if (column.startsWith('extra')) {
//               editableHeaders.push('<th style="font-size:' + fontSize + 'px;" contenteditable="true"><h2>' + columnHeader + '</h2></th>');
//           }
//       }
//   });

//   // Add Extra Column headers with editable input fields
//   for (let i = 1; i <= extraColumnValue; i++) {
//       editWindow.document.write(editableHeaders[i - 1] || '<th style="font-size:' + fontSize + 'px;" contenteditable="true">Column ' + i + '</th>');
//   }

//   editWindow.document.write('</tr></thead>');
//   editWindow.document.write('<tbody>');

//   // Render rows of data
//   filteredCategorys.forEach((category, index) => {
//       editWindow.document.write('<tr>');

//       // Render cells for selected columns
//       selectedColumns.forEach(column => {
//           if (column !== 'action') {
//               editWindow.document.write('<td' + (column.startsWith('extra') ? ' contenteditable="true"' : '') + ' style="font-size:' + fontSize + 'px;">');

//               if (column === 'file_path') {
//                   // Special handling for the 'File Path' column to display images
//                   editWindow.document.write(`<img src="${process.env.NEXT_PUBLIC_API_URL}:5003/${category.file_path}" style="max-width: 100px;" alt="Image"/>`);

//               } else if (column === 'serial') {
//                   // Rendering serial number if the column is 'serial'
//                   editWindow.document.write(index + 1);
//               } else if (column === 'status_id') {
//                   // Display status based on status_id value
//                   let statusText = '';
//                   switch (category[column]) {
//                       case 1:
//                           statusText = 'Active';
//                           break;
//                       case 2:
//                           statusText = 'Inactive';
//                           break;
//                       case 3:
//                           statusText = 'Pending';
//                           break;
//                       default:
//                           statusText = 'Unknown';
//                   }
//                   editWindow.document.write(statusText);
//               } else {
//                   // Default rendering for other columns
//                   editWindow.document.write(category[column]);
//               }
//               editWindow.document.write('</td>');
//           }
//       });

//       // Render cells for extra columns
//       for (let i = 0; i < extraColumnValue; i++) {
//           editWindow.document.write('<td style="font-size:' + fontSize + 'px;" contenteditable="true"></td>');
//       }

//       editWindow.document.write('</tr>');
//   });

//   editWindow.document.write('</tbody></table>');
//   editWindow.document.write('</body></html>');
//   editWindow.document.close();

//   // Print the editing window
//   editWindow.print();



// };

// main


// // Endpoint to post data to Facebook
// app.post('/postToFacebook', async (req, res) => {
//   const data = req.body;

//   // Your Facebook Page Access Token
//   const accessToken = 'EAAND6HgZAf8UBOZBB718ljX4IRETfRWu1DDvdNZAzw7QUZBrSDdzlm5L309fZA8JKsKh4G9ALMOK3mA01b7yJCeZCjO2Uw8vRuETaiDfreTRstgJw3PqYchkGmiHeM216mAc8eQxZB85y0wL8lqmIlbMJHU52TX1m4fUl5HelU4d2jMxXKfYLOFZADu32XsigRlbYbAQpxmI0BShiuzLpylv36HKckLzk6xfAxSXUinXlUVkFpcZB5K4EPHGmRbt1TKAZD';
//   const app_id = '919090656542661'

//   try {

//     const response = await axios.post(
//       `https://graph.facebook.com/v18.0/${app_id}/feed`,
//       {
//         message: data.message,
//         access_token: accessToken,
//         link: data.link,
//         image: data.image,
//         description: data.description
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );


//     // Handle the Facebook API response
//     console.log('Facebook API response:', response.data);
//     res.json({ success: true, facebookResponse: response.data });
//   }
//   catch (error) {
//     console.error('Error posting to Facebook:', error);
//     console.error('Error posting to Facebook:', error.response ? error.response.data : error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }

// });
// app.put('/brands/:id', (req, res) => {
//   const { brand_name, status_id, file_path, description, modified_by } = req.body;
//   const brandId = req.params.id;

//   const query = `
//     UPDATE brand
//     SET brand_name = ?,
//         status_id = ?,
//         file_path = ?,
//         description = ?,
//         modified_by = ?
//     WHERE id = ?
//   `;

//   const values = [brand_name, status_id, file_path, description, modified_by, brandId];

//   db.query(query, values, (error, results) => {
//     if (error) {
//       console.error('Error updating brand:', error);
//       res.status(500).json({ error: 'Error updating brand' });
//     } else {
//       console.log('Brand updated successfully:', results);
//       res.status(200).json({ message: 'Brand updated successfully' });
//     }
//   });
// });

// 'use client'
// import React, { useEffect, useState } from 'react';
// import '../../../../(view)/admin_layout/modal/fa.css'
// import axios from 'axios';
// import Link from 'next/link';
// import { FaTimes, FaUpload } from 'react-icons/fa';


// const BrandCreate = () => {

// const [status, setStatus] = useState([])
// useEffect(() => {
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
//     .then(res => res.json())
//     .then(data => setStatus(data))
// }, [])

// console.log(status)

//     function getCurrentDateTime() {
//         const now = new Date();
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, '0');
//         const day = String(now.getDate()).padStart(2, '0');
//         const hours = String(now.getHours()).padStart(2, '0');
//         const minutes = String(now.getMinutes()).padStart(2, '0');
//         // const seconds = String(now.getSeconds()).padStart(2, '0');

//         return `${year}/${month}/${day}/${hours}/${minutes}`;
//     }

//     const [numToAdd, setNumToAdd] = useState(1);
//     const [fields, setFields] = useState([{ brand_name: '', status_id: '', file_path: '', description: '' }]);

//     // const [selectedFile, setSelectedFile] = useState(null);

//     // const handleFileChange = (e) => {
//     //     const files = e.target.files[0];
//     //     setSelectedFile(files);
//     //     upload(files);

//     // };



//     const [pathOfFile, setPathOfFile] = useState([])

//     // const upload = (file, index) => {
//     //     const formData = new FormData();
//     //     formData.append('files', file);
//     //     const updatedFilePath = `${`images/${getCurrentDateTime()}/${selectedFile ? selectedFile?.name : ''}`}`
//     //     setPathOfFile(updatedFilePath)
//     //     axios.post('http://localhost:5003/upload', formData)
//     //         .then(res => { console.log(res) })
//     //         .catch(er => console.log(er))
//     // };

//     // console.log(pathOfFile)

//     const [selectedFile, setSelectedFile] = useState(Array(fields.length).fill(null));

//     const handleFileChange = (index, e) => {
//         let files = e.target.files[0];
//         console.log(files)
//         const newSelectedFiles = [...selectedFile];
//         newSelectedFiles[index] = files;
//         setSelectedFile(newSelectedFiles);
//         upload(files, index);
//     };

//     console.log( `${`images/${getCurrentDateTime()}/${selectedFile ? selectedFile[0]?.name : ''}`}` )
//     console.log( selectedFile[0]?.name  )
//     console.log( selectedFile?.map(file => file?.name) )


//     const upload = (file, index) => {
//         const formData = new FormData();
//         formData.append('files', file);
//         console.log(file)
//         const updatedFilePath = `${`images/${getCurrentDateTime()}/${file ? file.name : ''}`}`;
//         setPathOfFile(updatedFilePath);
//         axios.post('http://localhost:5003/upload', formData)
//             .then(res => {
//                 console.log(res);
//             })
//             .catch(er => console.log(er));
//     };

//     console.log(pathOfFile)


//     // const upload = () => {
//     // 	const formData = new FormData()
//     // 	formData.append('files', selectedFile)

//     // 	axios.post('http://localhost:5003/upload', formData)
//     // 		.then(res => { })
//     // 		.catch(er => console.log(er))
//     // }

//     const handleChange = (index, event) => {
//         const newFields = [...fields];
//         if (event.target.type === 'file') {
//             newFields[index][event.target.name] = event.target.files[0];
//         } else {
//             newFields[index][event.target.name] = event.target.value;
//         }
//         setFields(newFields);
//     };

//     const handleAddMore = () => {
//         const numToAddInt = parseInt(numToAdd);
//         if (!isNaN(numToAddInt) && numToAddInt > 0) {
//             const newInputValues = [...fields];
//             for (let i = 0; i < numToAddInt; i++) {
//                 newInputValues.push({
//                     brand_name: '',
//                     status_id: '',
//                     file_path: '',
//                     description: ''
//                 });
//             }
//             setFields(newInputValues);
//             setNumToAdd(1);
//         }
//     };

//     // const handleRemoveField = (index) => {
//     //     const newFields = [...fields];
//     //     newFields.splice(index, 1);
//     //     setFields(newFields);
//     // };
//     const handleRemoveField = (index) => {
//         const confirmDelete = window.confirm('Are you sure you want to delete this?');
//         if (confirmDelete) {
//             const newFields = [...fields];
//             const newSelectedFiles = [...selectedFile];

//             // Remove the form from the fields state
//             newFields.splice(index, 1);

//             // Remove the associated file from the selectedFile state
//             newSelectedFiles.splice(index, 1);

//             setFields(newFields);
//             setSelectedFile(newSelectedFiles);
//         }
//     };


//     const created = localStorage.getItem('userId')


//     const handleSubmit = (event) => {
//         event.preventDefault();


//         const form = event.target
//         for (let index = 0; index < fields.length; index++) {
//             const brand_name = form.brand_name.value || form?.brand_name[index]?.value
//             const status_id = form.status_id.value  || form?.status_id[index]?.value
//             const file_path = form.file_path.value  || form?.file_path[index]?.value
//             const description = form.description.value || form?.description[index]?.value

//             // Add your form submission logic here using the 'fields' state.

//             const addValue = {
//                 brand_name, 
//                 status_id,
//                 file_path: file_path ,
//                 description, 
//                 created_by: created
//             }
//             console.log(addValue.file_path)
//             console.log(addValue)
//             // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/brand/brand_create
//             fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/brand/brand_create`, {
//                 method: 'POST',
//                 headers: {
//                     'content-type': 'application/json',
//                 },
//                 body: JSON.stringify(addValue),
//             })
//                 .then((Response) => Response.json())
//                 .then((data) => {

//                     console.log(data);
//                     console.log(addValue);
//                 })
//                 .catch((error) => console.error(error));
//         }
//     }

//     const page_group = localStorage.getItem('pageGroup')
//     const handleRemoveImage = (index) => {
//         const confirmDelete = window.confirm('Are you sure you want to delete this?');
//         if (confirmDelete) {
//             const newSelectedFiles = [...selectedFile];
//             newSelectedFiles[index] = null;
//             setSelectedFile(newSelectedFiles);
//             const filePathToDelete = `${`images/${getCurrentDateTime()}/${selectedFile ? selectedFile[index].name : ''}`}`;
//             if (filePathToDelete) {
//                 axios.delete(`http://localhost:5003/${filePathToDelete}`)
//                     .then(res => {
//                         console.log(`File ${filePathToDelete} deleted successfully`);
//                     })
//                     .catch(err => {
//                         console.error(`Error deleting file ${filePathToDelete}:`, err);
//                     });
//             }
//         }
//     };


//     return (
//         <div className="card-default">
//         <div className="card-header custom-card-header py-1 bg-dark clearfix bg-gradient-primary text-white">
//             <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Create Brand</h5>
//             <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
//                 <Link href={`/Admin/brand/brand_all?page_group=${page_group}`} className="btn btn-sm btn-info">Back to Brand List</Link>
//             </div>
//         </div>
//         <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//             (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//         </div>
//         <div className="card-body">
//             {/* <form className="form-horizontal" method="post" autoComplete="off" onSubmit={handleSubmit}> */}
//             <div>
//                 <div className="card-header custom-card-header py-1 clearfix bg-dark text-light">
//                     <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
//                         <strong>Brand</strong>
//                     </div>
//                     <div className="card-title card-header-color font-weight-bold mb-0 float-right">
//                         <div className="input-group">
//                             <input
//                                 style={{ width: '80px' }}
//                                 type="number"
//                                 min="1"
//                                 className="form-control "
//                                 placeholder="Enter number of forms to add"
//                                 value={numToAdd}
//                                 onChange={(event) => setNumToAdd(event.target.value)}
//                             />
//                             <div className="input-group-append">
//                                 <button
//                                     type="button"
//                                     className="btn btn-info btn-sm py-1 add_more "
//                                     onClick={handleAddMore}
//                                 >
//                                     Add More
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div>
//                     <form className="form-horizontal" onSubmit={handleSubmit}>
//                         <div className="form-group row">

//                             {fields.map((field, index) => (
//                                 <div key={index} className={`brand-item d-lg-flex d-md-flex col-lg-12 mx-auto justify-content-between`}>
//                                     <div className='col-lg-3  border '>

//                                         <label className='font-weight-bold'>Brand Name:</label>
//                                         <input
//                                             type="text"
//                                             required=""
//                                             name="brand_name"
//                                             className="form-control form-control-sm mb-2"
//                                             placeholder="Enter Brand Name"
//                                             value={field.brand_name}
//                                             onChange={(e) => handleChange(index, e)}
//                                         />
//                                     </div>
//                                     <div className='col-lg-3 border'>

//                                         <label className='font-weight-bold'>Status:</label>

//                                         <select
//                                             required=""
//                                             name="status_id"
//                                             className="form-control form-control-sm mb-2"
//                                             value={field.status_id}
//                                             onChange={(e) => handleChange(index, e)}
//                                         >
//                                              <option value="">Select Status</option>
//                                             {
//                                                 status.map(sta => 
//                                                     <>

//                                                     <option value={sta.id}>{sta.status_name}</option>
//                                                     </>

//                                                     )
//                                             }


//                                             {/* <option value="2">Inactive</option> */}
//                                         </select>
//                                     </div>
//                                     {/* <div className='w-lg-25 col-lg-2 border'>
//                                         <label className='font-weight-bold'>File:</label>
//                                         <div>
//                                             <span class="btn btn-success btn-sm mb-2" >
//                                                 <label for="fileInput" className='mb-0' ><FaUpload></FaUpload>Select Image </label>
//                                                 <input
//                                                     className='mb-0'
//                                                     name="file_path"
//                                                     onChange={handleSubmitData}
//                                                     type="file" id="fileInput" style={{ display: "none" }} />
//                                             </span>

//                                         </div>

//                                         {selectedFile ?

//                                             <>
//                                                 <img className="w-100 mb-2"

//                                                     src={URL.createObjectURL(selectedFile)}
//                                                     alt="Uploaded File" />
//                                                 <button
//                                                     onClick={handleRemoveImage}
//                                                     type="button" class="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
//                                             </>
//                                             :
//                                             ''

//                                         }

//                                     </div> */}
//                                      <div className='w-lg-25 col-lg-2 border'>
//                 <label className='font-weight-bold'>File:</label>
//                 <div>
//                     <span className="btn btn-success btn-sm mb-2">
//                         <label htmlFor={`fileInput${index}`} className='mb-0'><FaUpload></FaUpload>Select Image</label>
//                         <input

//                             className='mb-0'

//                             onChange={(e) => handleFileChange(index, e)}
//                             type="file" id={`fileInput${index}`} style={{ display: "none" }}
//                         />
//                     </span>
//                 </div>

//                 {selectedFile[index] ?

//                     <>
//                         <img className="w-100 mb-2 img-thumbnail"

//                            onChange={(e) => handleFileChange(index, e)}
//                             // src={`${`images/${getCurrentDateTime()}/${selectedFile ? selectedFile[0].name : ''}`}`}
//                             src={URL.createObjectURL(selectedFile[index])}
//                             alt="Uploaded File" />
//                             <input type="hidden" name="file_path" value={`${`images/${getCurrentDateTime()}/${selectedFile ? selectedFile[index].name : ''}`}`}/>
//                         <button
//                             onClick={() => handleRemoveImage(index)}
//                             type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
//                     </>
//                     :
//                     ''
//                 }
//             </div>


//                                     <div className='col-lg-3 border'>

//                                         <label className='font-weight-bold'>Description:</label>
//                                         <textarea
//                                             name="description"
//                                             className="form-control form-control-sm mb-2"
//                                             placeholder="Enter description"
//                                             value={field.description}
//                                             onChange={(e) => handleChange(index, e)}
//                                         ></textarea>
//                                     </div>

//                                     <div className='col-lg-1 border'>
//                                         <label className='font-weight-bold'>Action</label>
//                                         <button
//                                             type="button"
//                                             className="btn btn-danger btn-sm form-control form-control-sm mb-2"
//                                             onClick={() => handleRemoveField(index)}
//                                         >
//                                             <i className="fas fa-trash-alt"></i>
//                                         </button>

//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//             <div className="form-group row">
//                     <div className="offset-md-3 col-sm-6">
//                         <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
//                     </div>
//                 </div>
//                     </form>
//                 </div>
//             </div>
//             {/* </form> */}
//         </div>

//     </div>


//     );
// };

// export default BrandCreate;

// 'use client'
// import React, { useState } from 'react';
// import * as XLSX from "xlsx";

// const BrandCreate = () => {

//     const [fileData, setFileData] = useState([]);

//     const handleFileUpload = (e) => {
//         const files = e.target.files;
//         const newData = [];

//         for (let i = 0; i < files.length; i++) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 const data = e.target.result;
//                 const workbook = XLSX.read(data, { type: "binary" });
//                 const sheetName = workbook.SheetNames[0];
//                 const sheet = workbook.Sheets[sheetName];
//                 const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//                 newData.push(rows);
//                 if (newData.length === files.length) {
//                     setFileData([...fileData, ...newData]);
//                 }
//             };
//             reader.readAsBinaryString(files[i]);
//         }
//     };

//     return (
//          <div>
//             <input type="file" multiple accept=".xlsx, .xls" onChange={handleFileUpload} />
//             <div>
//                 {fileData.map((data, fileIndex) => (
//                     <div key={fileIndex}>
//                         {/* <h2>File {fileIndex + 1}</h2> */}
//                         {data.map((row, rowIndex) => (
//                             <div key={rowIndex}>
//                                 {row.map((cell, cellIndex) => (
//                                     <input
//                                         key={cellIndex}
//                                         type="text"
//                                         defaultValue={cell}
//                                         onChange={(e) => {
//                                             const newData = [...fileData];
//                                             newData[fileIndex][rowIndex][cellIndex] = e.target.value;
//                                             setFileData(newData);
//                                         }}
//                                     />
//                                 ))}
//                             </div>
//                         ))}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default BrandCreate;
{/* <div class="card-body ">
{isEditClicked ?

  <form action="" onSubmit={handleEditHome}>

    <div class=" px-0">
      <div class="w-100 clearfix border-bottom pb-1">
        <h5 class="float-left mb-0 ">Menu Edit For {editId.title_en} </h5>
      </div>

      <div class="form-group row">
        <div class="col-md-12 pt-2">
          <label for="exampleInputEmail1" class="font-weight-bold">Item Name: </label>
          <input
            onChange={handleChange}
            type="text" name="title_en" defaultValue={editId ? editId.title_en : ''} class="form-control form-control-sm  menu_en " placeholder="Enter Item Name" />
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-12">
          <label for="exampleInputEmail1" class="font-weight-bold">Menu Icon:</label>
          <div class="input-group input-group-sm">
            <input
              onChange={handleChange}
              type="hidden" name="admin_template_menu_id" value="37" />
            <select
              onChange={handleChange}
              name="icon_align" class="form-control form-control-sm floating_id trim">
              <option value="float-left"> Left Align</option>
              <option value="float-right"> Right Align</option>
            </select>
            <div class="input-group-prepend">
              <button class="btn btn-sm btn-success icon_view" id="icon_view" type="button">
                <a
                  dangerouslySetInnerHTML={{ __html: iconValue[iconValue.length - 1] }}
                ></a>
              </button>
            </div>
            <input type="text"

              readOnly
              name="menu_icon"
              placeholder="Enter Page Group Icon"
              defaultValue={iconValue[iconValue.length - 1]}
           
              onChange={(event) => {
                handleInputChange(index, event)
              }}
              class="form-control form-control-sm icon w-25 page_group_icon" />
            <div class="input-group-append">
              <button class="btn btn-sm btn-danger icon_clear"
                type="button"
                onClick={handleDeleteClick}
                onChange={() => handleInputChange(index)}
                data-input="icon" ><FaTrash ></FaTrash></button>
              <button
                onClick={() => setLgShow(true)}
                className="btn btn-sm btn-secondary icon_modal"
                type="button"
              >
                <FaSearch ></FaSearch> Icon
              </button>

              <span class="input-group-text " data-toggle="popover" title="" data-placement="top" data-content="Leave Blank. if you don't show icon." data-original-title="Info"><FaInfoCircle ></FaInfoCircle></span>
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
                      <div className=''
                        onClick={() => handleAddToCart(icon)} >

                        <div className="icon-el text-center bg-light m-1 p-1 show_fa_icon fs-3"
                          onClick={() => handleAddToCart(icon)}
                        >
                          <a
                            dangerouslySetInnerHTML={{ __html: icon.fa }}
                          ></a>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>


      <div class="form-group row">
        <div class="col-md-12">
          <label for="exampleInputEmail1" class="font-weight-bold">Link:</label>
          <div class="input-group input-group-sm">
            <select
              onChange={handleChange}
              class="form-control form-control-sm  link_type w-25" name="link_path_type" id="select_item">
              <option value="1">External</option>
              <option value="2">Front page</option>
              <option value="3">No Link</option>
              <option value="4">Content Reference</option>
              <option value="5">Custom Content</option>
            </select>
            <input
              onChange={handleChange}
              defaultValue={editId.link_path}
              name="link_path" type="text" class="form-control form-control-sm  select_result w-50" id="select_result" />
            <input class="form-control form-control-sm  input_append_text search_link " id="menu" type="text" readonly="" />
            <div class="input-group-append">
              <span class="input-group-text search_icon" id="modal_call" data-id="menu" ><FaSearch ></FaSearch> </span>
            </div>
          </div>
        </div>

      </div>
      <div class="form-group row">
        <div class="col-md-8">
          <div class="checkbox">
            <label>
              <input

                type="checkbox"
                name="active"
                className="check"
                value={isActive ? 1 : 0}
                checked={isActive}
                // onChange={handleChange}
                onChange={(event) => {
                  handleCheckboxChange(event);
                  handleChange(event);
                }}
              // onChange={handleCheckboxChange}
              /> Active
            </label>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-8">
          <button class="btn btn-success btn-sm btn-primary ok">Create</button>
          {/* <button class="btn btn-sm btn-secondary btn-primary new">New</button> */}
//       </div>
//       <div class="col-md-4">
//       </div>
//     </div>
//   </div>
// </form>


// :


// <form action="" onSubmit={handleSubmit}>

//   <div class=" px-0">
//     <div class="w-100 clearfix border-bottom pb-1">
//       <h5 class="float-left mb-0 ">Menu Create</h5>
//     </div>

//     <div class="form-group row">
//       <div class="col-md-12 pt-2">
//         <label for="exampleInputEmail1" class="font-weight-bold">Item Name:</label>
//         <input type="text" name="title_en" class="form-control form-control-sm  menu_en " placeholder="Enter Item Name" />
//       </div>
//     </div>
//     <div class="form-group row">
//       <div class="col-md-12">
//         <label for="exampleInputEmail1" class="font-weight-bold">Menu Icon:</label>
//         <div class="input-group input-group-sm">
//           <input type="hidden" class="menu_id" name="menu_id" value="37" />
//           <select name="floating_position" class="form-control form-control-sm floating_id trim">
//             <option value="float-left"> Left Align</option>
//             <option value="float-right"> Right Align</option>
//           </select>
//           <div class="input-group-prepend">
//             <button class="btn btn-sm btn-success icon_view" id="icon_view" type="button">
//               <a
//                 dangerouslySetInnerHTML={{ __html: iconValue[iconValue.length - 1] }}
//               ></a>
//             </button>
//           </div>
//           <input type="text"
//             readOnly
//             name="menu_icon"
//             placeholder="Enter Page Group Icon"
//             defaultValue={iconValue[iconValue.length - 1]}
//             onChange={(event) => handleInputChange(index, event)}
//             class="form-control form-control-sm icon w-25 page_group_icon" />
//           <div class="input-group-append">
//             <button class="btn btn-sm btn-danger icon_clear"
//               type="button"
//               onClick={handleDeleteClick}
//               onChange={() => handleInputChange(index)}
//               data-input="icon" ><FaTrash ></FaTrash></button>
//             <button
//               onClick={() => setLgShow(true)}
//               className="btn btn-sm btn-secondary icon_modal"
//               type="button"
//             >
//               <FaSearch ></FaSearch> Icon
//             </button>

//             <span class="input-group-text " data-toggle="popover" title="" data-placement="top" data-content="Leave Blank. if you don't show icon." data-original-title="Info"><FaInfoCircle ></FaInfoCircle></span>
//           </div>
//         </div>
//         <Modal
//           className='text-black'
//           size="lg"
//           show={lgShow}
//           onHide={() => setLgShow(false)}
//           aria-labelledby="example-modal-sizes-title-lg"
//         >
//           <Modal.Header closeButton>
//             <Modal.Title id="example-modal-sizes-title-lg">
//               Large Modal
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body className='mt-5'>
//             <div className='row row-cols-2 row-cols-lg-6 row-cols-md-4 g-4 '>
//               {
//                 icons?.map((icon) =>
//                   <div key={icon.id} className='mt-1' onClick={() => setLgShow(false)} >
//                     <div className=''
//                       onClick={() => handleAddToCart(icon)} >

//                       <div className="icon-el text-center bg-light m-1 p-1 show_fa_icon fs-3"
//                         onClick={() => handleAddToCart(icon)}
//                       >
//                         <a
//                           dangerouslySetInnerHTML={{ __html: icon.fa }}
//                         ></a>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               }
//             </div>
//           </Modal.Body>
//         </Modal>
//       </div>
//     </div>
//     <div class="form-group row">
//       <div class="col-md-12">
//         <label for="exampleInputEmail1" class="font-weight-bold">Link:</label>
//         <div class="input-group input-group-sm">
//           <select class="form-control form-control-sm  link_type w-25" name="link_path_type" id="select_item">
//             <option value="1">External</option>
//             <option value="2">Front page</option>
//             <option value="3">No Link</option>
//             <option value="4">Content Reference</option>
//             <option value="5">Custom Content</option>
//           </select>
//           <input name="link_path" type="text" class="form-control form-control-sm  select_result w-50" id="select_result" />
//           <input class="form-control form-control-sm  input_append_text search_link " id="menu" type="text" readonly="" />
//           <div class="input-group-append">
//             <span class="input-group-text search_icon" id="modal_call" data-id="menu" ><FaSearch ></FaSearch> </span>
//           </div>
//         </div>
//       </div>

//     </div>
//     <div class="form-group row">
//       <div class="col-md-8">
//         <div class="checkbox">
//           <label>
//             <input
//               type="checkbox"
//               name="active"
//               className="check"
//               value={isActive ? 1 : 0}
//               checked={isActive}
//               onChange={handleCheckboxChange}
//             /> Active
//           </label>
//         </div>
//       </div>
//     </div>
//     <div class="form-group row">
//       <div class="col-md-8">
//         <button class="btn btn-success btn-sm btn-primary ok">Create</button>

//       </div>
//       <div class="col-md-4">
//       </div>
//     </div>
//   </div>
// </form>
// }

// </div> */}