// // NestableComponent.js
// 'use client' 
 //ismile
// import React, { useState } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

// const ItemType = 'NestableItem';

// const DraggableItem = ({ id, text, index, moveItem }) => {
//   const [, ref] = useDrag({
//     type: ItemType,
//     item: { id, index },
//   });

//   const [, drop] = useDrop({
//     accept: ItemType,
//     hover: (draggedItem) => {
//       if (draggedItem.index !== index) {
//         moveItem(draggedItem.index, index);
//         draggedItem.index = index;
//       }
//     },
//   });

//   return (
//     <div ref={(node) => ref(drop(node))} style={{ padding: '8px', border: '1px solid #ccc', marginBottom: '4px' }}>
//       {text}
//     </div>
//   );
// };

// const Nestable = ({ items, setItems }) => {
//   const moveItem = (fromIndex, toIndex) => {
//     const newItems = [...items];
//     const [movedItem] = newItems.splice(fromIndex, 1);
//     newItems.splice(toIndex, 0, movedItem);
//     setItems(newItems);
//   };

//   return (
//     <div>
//       {items.map((item, index) => (
//         <DraggableItem key={item.id} id={item.id} text={item.text} index={index} moveItem={moveItem} />
//       ))}
//     </div>
//   );
// };

// const NestableComponent = () => {
//   const [items, setItems] = useState([
//     { id: 1, text: 'Item 1' },
//     { id: 2, text: 'Item 2', children: [{ id: 3, text: 'Item 3' }, { id: 4, text: 'Item 4' }] },
//     { id: 5, text: 'Item 5', children: [{ id: 6, text: 'Item 6' }, { id: 7, text: 'Item 7' }] },
//   ]);

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div>
//         <h1>Nestable</h1>
//         <p>Drag &amp; drop hierarchical list with mouse and touch compatibility (React component)</p>

//         <Nestable items={items} setItems={setItems} />
//       </div>
//     </DndProvider>
//   );
// };

// export default NestableComponent;

'use client' 
 //ismile
import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = 'NestableItem';

const CustomDropdown = ({ options, onSelect }) => {
  return (
    <div>
      {/* Your custom dropdown implementation */}
      {/* For simplicity, you can use a simple select element as a placeholder */}
      <select onChange={(e) => onSelect(e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const DraggableItem = ({ id, text, index, moveItem }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [isSectionOpen, setSectionOpen] = useState(false);

  const handleDropdownSelect = (selectedOption) => {
    // Handle the selected option here
    console.log('Selected Option:', selectedOption);
  };

  return (
    <div ref={(node) => drag(drop(node))} style={{ padding: '8px', border: '1px solid #ccc', marginBottom: '4px', opacity: isDragging ? 0.5 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setSectionOpen(!isSectionOpen)}>
        <div>{text}</div>
        <div>{isSectionOpen ? '[-]' : '[+]'}</div>
      </div>
      {isSectionOpen && (
        <div style={{ marginLeft: '20px', marginTop: '8px' }}>
          <label>Dropdown 1:</label>
          <CustomDropdown options={['Option 1', 'Option 2', 'Option 3']} onSelect={handleDropdownSelect} />

          <label>Dropdown 2:</label>
          <CustomDropdown options={['Option A', 'Option B', 'Option C']} onSelect={handleDropdownSelect} />
        </div>
      )}
    </div>
  );
};

const Nestable = ({ items, setItems }) => {
  const moveItem = (fromIndex, toIndex) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
  };

  return (
    <div>
      {items.map((item, index) => (
        <DraggableItem key={item.id} id={item.id} text={item.text} index={index} moveItem={moveItem} />
      ))}
    </div>
  );
};

const NestableComponent = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2', children: [{ id: 3, text: 'Item 3' }, { id: 4, text: 'Item 4' }] },
    { id: 5, text: 'Item 5', children: [{ id: 6, text: 'Item 6' }, { id: 7, text: 'Item 7' }] },
  ]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h1>Nestable</h1>
        <p>Drag &amp; drop hierarchical list with mouse and touch compatibility (React component)</p>

        <Nestable items={items} setItems={setItems} />
      </div>
    </DndProvider>
  );
};

export default NestableComponent;


// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';

// const VerificationOTP = ({ id }) => {
//     const [error, setError] = useState('');

//     function generateOTP() {

//         const otp = Math.floor(100000 + Math.random() * 900000);
//         return otp.toString();
//     }
//     const otp = generateOTP();
//     const router = useRouter();



//     const { data: singleUser = [], isLoading, refetch } = useQuery({
//         queryKey: ['singleUser'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/allUser/${id}`);
//             const data = await res.json();

//             return data;
//         },
//     });

//     console.log(singleUser[0]?.OTP)
//     const verifyCode = singleUser[0]?.verifiy_codes


//     const handleLogout = async () => {

//         const InputValue = document.getElementById('input').value;
//         const InputValue1 = document.getElementById('input1').value;
//         const InputValue2 = document.getElementById('input2').value;
//         const InputValue3 = document.getElementById('input3').value;
//         const InputValue4 = document.getElementById('input4').value;
//         const InputValue5 = document.getElementById('input5').value;



//         const AllValue = InputValue + InputValue1 + InputValue2 + InputValue3 + InputValue4 + InputValue5;


//         if (verifyCode === AllValue) {
//             try {
//                 // Clear the verifyCode by making a PUT request
//                 const responseVerifyOTP = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}:5002/update/verification_code/${id}`, {
//                     verifiy_codes: null,
//                     OTP: null
//                 });

//                 console.log(responseVerifyOTP);

//                 // Check if the update was successful
//                 if (responseVerifyOTP.status === 200) {
//                     console.log("Verification successful. verifyCode cleared.");
//                     // Perform additional actions if needed


//                     localStorage.removeItem('userEmail');
//                     localStorage.removeItem('userId');
//                     localStorage.removeItem('userName');
//                     localStorage.removeItem('userRoleName');
//                     localStorage.removeItem('pageGroup');
//                     sessionStorage.removeItem('controllerName')
//                     router.push('/admin/login/login')


//                     // Example: Redirect to a new page
//                     // router.push('/some-page');
//                 } else {

//                     console.log("Failed to clear verifyCode. Server returned an error.");
//                     // Handle the error accordingly
//                 }
//             } catch (error) {

//                 console.error("Error updating verification code:", error);
//                 // Handle the error accordingly
//             }
//         } else {
//             // Codes don't match, handle accordingly
//             console.log("Verification failed");
//             setError('Number Not Found')
//         }



//         console.log("Api Call end")

//         // console.log(AllValue);

//         // router.push('/admin/login/login');
//     };


//     return (

//         <div className="col">
//             <div className="bg-light mt-3">
//                 <div className="card-header h5 text-dark text-center">Verification code</div>
//                 <div className="card-body">
//                     <p className="card-text py-2">Enter Your 6 Digit Verification Code</p>
//                     <div className="my-3 d-flex justify-content-center">
//                         <div className="d-lg-flex d-md-flex  ">
//                             <div className="d-flex mt-2">
//                                 <div className="input mx-2">
//                                     <input
//                                         max="1"
//                                         id="input"
//                                         style={{
//                                             width: '60px',
//                                             height: '60px',
//                                             fontSize: '35px',
//                                             fontWeight: 'bold',
//                                             textAlign: 'center',
//                                             color: '#333',
//                                         }}
//                                         type="number"
//                                     />
//                                 </div>
//                                 <div className="input mx-2">
//                                     <input
//                                         max="1"
//                                         id="input1"
//                                         style={{
//                                             width: '60px',
//                                             height: '60px',
//                                             fontSize: '35px',
//                                             fontWeight: 'bold',
//                                             textAlign: 'center',
//                                             color: '#333',
//                                         }}
//                                         type="number"
//                                     />
//                                 </div>
//                                 <div className="input mx-2">
//                                     <input
//                                         max="1"
//                                         id="input2"
//                                         style={{
//                                             width: '60px',
//                                             height: '60px',
//                                             fontSize: '35px',
//                                             fontWeight: 'bold',
//                                             textAlign: 'center',
//                                             color: '#333',
//                                         }}
//                                         type="number"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="d-flex mt-2">
//                                 <div className="input mx-2">
//                                     <input
//                                         max="1"
//                                         id="input3"
//                                         style={{
//                                             width: '60px',
//                                             height: '60px',
//                                             fontSize: '35px',
//                                             fontWeight: 'bold',
//                                             textAlign: 'center',
//                                             color: '#333',
//                                         }}
//                                         type="number"
//                                     />
//                                 </div>
//                                 <div className="input mx-2">
//                                     <input
//                                         max="1"
//                                         id="input4"
//                                         style={{
//                                             width: '60px',
//                                             height: '60px',
//                                             fontSize: '35px',
//                                             fontWeight: 'bold',
//                                             textAlign: 'center',
//                                             color: '#333',
//                                         }}
//                                         type="number"
//                                     />
//                                 </div>
//                                 <div className="input mx-2">
//                                     <input
//                                         max="1"
//                                         id="input5"
//                                         style={{
//                                             width: '60px',
//                                             height: '60px',
//                                             fontSize: '35px',
//                                             fontWeight: 'bold',
//                                             textAlign: 'center',
//                                             color: '#333',
//                                         }}
//                                         type="number"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {error && <p style={{ color: 'red' }}>{error}</p>}
//                     <div className="d-grid gap-2 my-3">
//                         <button
//                             onClick={handleLogout}
//                             type="button"
//                             className="btn text-white btn btn-primary"
//                             style={{ backgroundColor: 'rgb(43, 52, 103)' }}
//                         >
//                             Next <i className="fa-solid fa-angle-right"></i>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default VerificationOTP;