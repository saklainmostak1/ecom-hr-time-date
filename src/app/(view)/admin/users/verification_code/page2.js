import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios

const CountDownNumber = ({ otpTimeLimite, userNumber, id }) => {


    // const times = otpTimeLimite;
    const mobile = userNumber
    // console.log(mobile)

    const generateOTP = () => {
        const otp = Math.floor(100000 + Math.random() * 900000);
        return otp.toString();
    };

    // Function to resend OTP
    const resendOTP = async () => {
        const otp = generateOTP();
        const quickApi = '622bfee8efc9aff53';

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/send-otp`, {
                quick_api: quickApi,
                mobile,
                msg: `Your OTP is ${otp}`,
            });
            const responseVerifyOTP = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}:5002/update/verification_code/${id}`, {
                verifiy_codes: otp,
                OTP: 1,
                emailCodeTimeOut: otpTimeLimite
            });
            console.log(responseVerifyOTP.data);
            console.log(response.data); 
            // if (response.status === 200) {

            //     setTime({ minutes: otpTimeLimite, seconds: 0 });
            //     setCountdownEnded(false);
            // }
            // Reset countdown state
        } catch (error) {
            console.error('Error resending OTP:', error);
        }
    };

    const [time, setTime] = useState(() => {
        // Initialize countdown state from localStorage if available
        const storedCountdown = JSON.parse(localStorage.getItem('countdown'));
        return storedCountdown || { minutes: otpTimeLimite, seconds: 0 };
    });

    const [countdownEnded, setCountdownEnded] = useState(false);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         let newMinutes = time.minutes;
    //         let newSeconds = time.seconds - 1;
    
    //         if (newSeconds < 0) {
    //             newSeconds = 59;
    //             newMinutes -= 1;
    //         }
    
    //         if (newMinutes === 0 && newSeconds === 0) {
    //             clearInterval(interval);
    //             setCountdownEnded(true);
    //         } else {
    //             setTime({
    //                 minutes: newMinutes,
    //                 seconds: newSeconds
    //             });
    
    //             // Update localStorage with the new countdown state
    //             localStorage.setItem('countdown', JSON.stringify({ minutes: newMinutes, seconds: newSeconds }));
    //         }
    //     }, 1000);
    
    //     return () => clearInterval(interval);
    // }, [time, otpTimeLimite]);

    
    useEffect(() => {
        const interval = setInterval(() => {
            if (time.minutes === 0 && time.seconds === 0) {
                clearInterval(interval);
                setCountdownEnded(true);
            } else {
                let newMinutes = time.minutes;
                let newSeconds = time.seconds - 1;

                if (newSeconds < 0) {
                    newSeconds = 59;
                    newMinutes -= 1;
                }

                setTime({
                    minutes: newMinutes,
                    seconds: newSeconds
                });

                // Update localStorage with the new countdown state
                localStorage.setItem('countdown', JSON.stringify({ minutes: newMinutes, seconds: newSeconds }));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [time]);

    useEffect(() => {
        // Initialize state if `otpTimeLimite` changes
        if (!countdownEnded && otpTimeLimite) {
            setTime({ minutes: otpTimeLimite, seconds: 0 });
        }
    }, [otpTimeLimite, countdownEnded]);
    

    return (
        <div>
            {countdownEnded ? (
                <p>
                    Did not get a code
                <button className='btn  text-primary' style={{marginTop:'-5px', textDecoration: 'underline'}} onClick={() => {
                    resendOTP();
                    // Reset the countdown state
                    setTime({ minutes: otpTimeLimite, seconds: 0 });
                    setCountdownEnded(false);
                }}>
                    Resend
                </button>
                </p>
            ) : (
                <div>
                    <p>  Resend Your Code After

                       <span> {`${time?.minutes?.toString().padStart(2, '0')}:${time?.seconds?.toString().padStart(2, '0')}`}</span>
                        
                        </p>

                </div>
            )}
        </div>
    );
};

export default CountDownNumber;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios'; // Import axios

// const CountDownNumber = ({ otpTimeLimite, userNumber, id }) => {
//     const mobile = userNumber;

//     const generateOTP = () => {
//         const otp = Math.floor(100000 + Math.random() * 900000);
//         return otp.toString();
//     };

//     const resendOTP = async () => {
//         const otp = generateOTP();
//         const quickApi = '622bfee8efc9aff53';

//         try {
//             const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/send-otp`, {
//                 quick_api: quickApi,
//                 mobile,
//                 msg: `Your OTP is ${otp}`,
//             });
//             const responseVerifyOTP = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}:5002/update/verification_code/${id}`, {
//                 verifiy_codes: otp,
//                 OTP: 1,
//                 emailCodeTimeOut: otpTimeLimite
//             });
//             console.log(responseVerifyOTP.data);
//             console.log(response.data); 
//             // if (response.status === 200) {

//             //     setTime({ minutes: otpTimeLimite, seconds: 0 });
//             //     setCountdownEnded(false);
//             // }
//             // Reset countdown state
//         } catch (error) {
//             console.error('Error resending OTP:', error);
//         }
//     };


//     const [time, setTime] = useState(() => {
//         // Initialize countdown state from localStorage if available
//         const storedCountdown = JSON.parse(localStorage.getItem('countdown'));
//         return storedCountdown || { minutes: otpTimeLimite, seconds: 0 };
//     });

//     const [countdownEnded, setCountdownEnded] = useState(false);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (time.minutes === 0 && time.seconds === 0) {
//                 clearInterval(interval);
//                 setCountdownEnded(true);
//             } else {
//                 let newMinutes = time.minutes;
//                 let newSeconds = time.seconds - 1;

//                 if (newSeconds < 0) {
//                     newSeconds = 59;
//                     newMinutes -= 1;
//                 }

//                 setTime({
//                     minutes: newMinutes,
//                     seconds: newSeconds
//                 });

//                 // Update localStorage with the new countdown state
//                 localStorage.setItem('countdown', JSON.stringify({ minutes: newMinutes, seconds: newSeconds }));
//             }
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [time]);

//     useEffect(() => {
//         // Initialize state if `otpTimeLimite` changes
//         if (!countdownEnded && otpTimeLimite) {
//             setTime({ minutes: otpTimeLimite, seconds: 0 });
//         }
//     }, [otpTimeLimite, countdownEnded]);

//     return (
//         <div>
//             {countdownEnded ? (
//                 <p>
//                     Did not get a code
//                     <button className='btn text-primary' style={{ marginTop: '-5px', textDecoration: 'underline' }} onClick={() => {
//                         resendOTP();
//                         // Reset the countdown state
//                         setTime({ minutes: otpTimeLimite, seconds: 0 });
//                         setCountdownEnded(false);
//                     }}>
//                         Resend
//                     </button>
//                 </p>
//             ) : (
//                 <div>
//                 <p>Resend Code After <span>{`${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`}</span></p>
//             </div>
//             )}
//         </div>
//     );
// };

// export default CountDownNumber;
