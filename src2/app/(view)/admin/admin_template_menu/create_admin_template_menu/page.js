'use client' 
 //ismile
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
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';



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

  const admin_template_menu_input_change = (index, event) => {
    const { name, value } = event.target;
    const newInputValues = [...inputValues];
    newInputValues[index][name] = value;
    setInputValues(newInputValues);
  };
  console.log(inputValues, admin_template_menu_input_change)



  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/faIcons`)
      .then(res => res.json())
      .then(data => {
        setIcons(data)
      })
  }, [])

  const [cart, setCart] = useState([])
  const admin_template_menu_icon = data => {

    const newCart = [...cart, data]
    setCart(newCart)

  }

  const iconValue = (cart?.map(c => c?.fa))

  const admin_template_menu_delete_click = () => {
    setCart([])
  };

  useEffect(() => {
    admin_template_menu_delete_click()
  }, [])
  console.log(iconValue[iconValue.length - 1])

  const admin_template_menu_delete = id => {

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


  useEffect(() => {
    setEditProfile(editId)
  }, [editId])


  console.log(editProfile)


  const admin_template_menu_update = event => {
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
            'Update Success Fully',
            'success'
          )
        }
        else {
          Swal.fire(
            'Error!',
            'Nothing Updated',
            'error'
          )
        }

      })
  }

  const admin_template_menu_change = (event) => {
    const field = event.target.name
    const value = event.target.value
    const review = { ...editId }
    review[field] = value
    seteditId(review)
  }
  console.log(editId)




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
          onClick={() => admin_template_menu_delete(item.id)}
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


  const admin_template_menu_create = async (event) => {
    event.preventDefault();
    const form = event.target;
    const title_en = form?.title_en?.value;
    const menu_id = form?.menu_id?.value;
    const floating_position = form?.floating_position?.value;
    const menu_icon = form?.menu_icon?.value;
    const link_path_type = form?.link_path_type?.value;
    const link_path = form?.link_path?.value;
    const active = form?.active?.value;



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



  const admin_template_menu_re_render = async () => {

    try {
      // Step 1: Delete all data
      const deleteResponse = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin_template_table/delete_all`);
      console.log('Data deleted:', deleteResponse.data);

      // Step 2: Insert data
      const dataArray = Array.isArray(menuData) ? menuData : items;
      // const dataArray = Array.isArray(menuData) ? menuData : [];
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

  const [open, setOpen] = useState(false);

  return (

    <div class="bg-light border-primary shadow-sm border-0 overflow-hidden">

      <div id="example-collapse-text">
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
                  onClick={admin_template_menu_re_render}
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

                <form action="" onSubmit={admin_template_menu_update}>
                  <div class=" px-0">
                    <div class="w-100 clearfix border-bottom pb-1">
                      <h5 class="float-left mb-0 ">Menu Edit {editProfile.title_en}</h5>
                    </div>

                    <div class="form-group row">
                      <div class="col-md-12 pt-2">
                        <label for="exampleInputEmail1" class="font-weight-bold">Item Name:</label>
                        <input
                          name="title_en"
                          defaultValue={editProfile.title_en}
                          onChange={admin_template_menu_change}
                          type="text" class="form-control form-control-sm  menu_en " placeholder="Enter Item Name" />
                      </div>
                    </div>
                    <div class="form-group row">
                      <div class="col-md-12">
                        <label for="exampleInputEmail1" class="font-weight-bold">Menu Icon:</label>
                        <div class="input-group input-group-sm">
                          <input

                            type="hidden" class="menu_id" name="menu_id" value="37" />
                          <select
                            name="icon_align"
                            defaultValue={editProfile.icon_align}
                            onChange={admin_template_menu_change}
                            class="form-control form-control-sm floating_id trim">
                            <option value="float-left"> Left Align</option>
                            <option value="float-right"> Right Align</option>

                          </select>

                          <div class="input-group-prepend">
                            <button class="btn btn-sm btn-success icon_view" id="icon_view" type="button">
                              <a
                                dangerouslySetInnerHTML={{ __html: iconValue[iconValue.length - 1] ? iconValue[iconValue.length - 1] : editProfile.menu_icon }}
                              ></a>
                            </button>
                          </div>
                          <input
                            name="menu_icon"
                            readOnly
                            placeholder="Enter Page Group Icon"
                            value={iconValue[iconValue.length - 1] ? iconValue[iconValue.length - 1] : editProfile.menu_icon}
                            className="form-control form-control-sm icon w-25 page_group_icon"

                            // onChange={admin_template_menu_change}
                            onChange={(event) => {
                              admin_template_menu_input_change(index, event); admin_template_menu_change(event);
                            }}
                            class="form-control form-control-sm icon w-25 page_group_icon" />
                          <div class="input-group-append">
                            <button class="btn btn-sm btn-danger icon_clear"
                              type="button"
                              onClick={admin_template_menu_delete_click}
                              onChange={() => admin_template_menu_input_change(index)}
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
                                      onClick={() => admin_template_menu_icon(icon)} >

                                      <div className="icon-el text-center bg-light m-1 p-1 show_fa_icon fs-3"
                                        onClick={() => admin_template_menu_icon(icon)}
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
                            onChange={admin_template_menu_change}
                            class="form-control form-control-sm  link_type w-25" name="link_path_type" id="select_item">
                            <option value="1">External</option>
                            <option value="2">Front page</option>
                            <option value="3">No Link</option>
                            <option value="4">Content Reference</option>
                            <option value="5">Custom Content</option>
                          </select>
                          <input
                            onChange={admin_template_menu_change}
                            name="link_path" defaultValue={editProfile.link_path} type="text" class="form-control form-control-sm  select_result w-50" id="select_result" />
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
                              onChange={(e) => {
                                admin_template_menu_change(e);
                                handleCheckboxChange(e);
                              }}
                            // onChange={handleCheckboxChange}
                            /> Active
                          </label>
                        </div>
                      </div>
                    </div>
                    <input
                      onClick={admin_template_menu_update}

                      type="button" disabled="" class="btn btn-sm btn-success submit" value="Update" />
                    {/* <div class="form-group row">
                      <div class="col-md-8">
                        <button class="btn btn-success btn-sm btn-primary ">Update</button>
                      </div>
                    </div> */}
                  </div>
                </form>


                :


                <form action="" onSubmit={admin_template_menu_create}>
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
                            name="menu_icon"
                            readOnly
                            placeholder="Enter Page Group Icon"
                            defaultValue={iconValue[iconValue.length - 1]}
                            onChange={(event) => admin_template_menu_input_change(index, event)}

                            className="form-control form-control-sm icon w-25 page_group_icon" />
                          <div class="input-group-append">
                            <button
                              className="btn btn-sm btn-danger icon_clear"

                              type="button"
                              onClick={admin_template_menu_delete_click}
                              onChange={() => admin_template_menu_input_change(index)}
                            >
                              <FaTrash ></FaTrash>
                            </button>
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
                                      onClick={() => admin_template_menu_icon(icon)} >

                                      <div className="icon-el text-center bg-light m-1 p-1 show_fa_icon fs-3"
                                        onClick={() => admin_template_menu_icon(icon)}
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
                    <input
                      onClick={admin_template_menu_create}

                      type="button" disabled="" class="btn btn-sm btn-success submit" value="Submit" />
                    {/* <div class="form-group row">
                      <div class="col-md-8">
                        <button class="btn btn-success btn-sm btn-primary ok">Create</button>
                      </div>
                    </div> */}
                  </div>
                </form>
              }

            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AdminTemplateMenu
