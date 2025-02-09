// import React, { useEffect, useState } from 'react';

// const CountDown = ({otpTimeLimite}) => {



//     const times = otpTimeLimite

//     const email ='saklainmostak2135@gmail.com'

//     const generateOTP = () => {
//         const otp = Math.floor(100000 + Math.random() * 900000);
//         return otp.toString();
//     };

//     // Function to resend OTP
//     const resendOTP = async () => {
//         const email = 'saklainmostak2135@gmail.com';
//         const otp = generateOTP();

//         try {
//             const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/send-otp/email`, {
//                 email,
//                 otp
//             });
//             console.log(response)
//             // Reset countdown state
//             setTime({ minutes: times, seconds: 0 });
//             setCountdownEnded(false);
//         } catch (error) {
//             console.error('Error resending OTP:', error);
//         }
//     };

//     const [time, setTime] = useState({ minutes: times, seconds: 0 });
//     const [countdownEnded, setCountdownEnded] = useState(false);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             // Calculate new time based on current time
//             let newMinutes = time.minutes;
//             let newSeconds = time.seconds - 1;

//             // Adjust minutes if seconds reach negative
//             if (newSeconds < 0) {
//                 newSeconds = 59;
//                 newMinutes -= 1;
//             }

//             // If the countdown has ended, clear the interval
//             if (newMinutes === 0 && newSeconds === 0) {
//                 clearInterval(interval);
//                 setCountdownEnded(true);
//             }

//             // Update the time state
//             setTime({
//                 minutes: newMinutes,
//                 seconds: newSeconds
//             });
//         }, 1000);

//         // Clean up the interval
//         return () => clearInterval(interval);
//     }, [time]);


//     return (
//         <div>
//             {countdownEnded ? (
//                 <button onClick={() => {
//                     resendOTP()
//                     // Handle the action when the button is clicked (e.g., resend)
//                     // Reset the countdown state
//                     setTime({ minutes: times, seconds: 0 });
//                     setCountdownEnded(false);
//                 }}>
//                     Resend
//                 </button>
//             ) : (
//                 <div>
//                     {`${time?.minutes?.toString().padStart(2, '0')}:${time?.seconds?.toString().padStart(2, '0')}`}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CountDown;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios'; // Import axios

// const CountDown = ({ otpTimeLimite, userEmail, id }) => {


//     // const times = otpTimeLimite;
//     const email = userEmail

//     const generateOTP = () => {
//         const otp = Math.floor(100000 + Math.random() * 900000);
//         return otp.toString();
//     };

//     // Function to resend OTP
//     const resendOTP = async () => {
//         const otp = generateOTP();

//         try {
//             const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/send-otp/email`, {
//                 email,
//                 otp
//             });
//             console.log(response);

//             const responseVerifyOTP = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}:5002/update/verification_code_email/${id}`, {
//                 email_verifiy_code: otp,
//                 OTP: 2,
//                 emailCodeTimeOut: otpTimeLimite
//             });
//             console.log(responseVerifyOTP.data);
//             // if (response.status === 200) {

//             //     setTime({ minutes: otpTimeLimite, seconds: 0 });
//             //     setCountdownEnded(false);
//             // }
//             // Reset countdown state
//         } catch (error) {
//             console.error('Error resending OTP:', error);
//         }
//     };

//     const [time, setTime] = useState({ minutes: otpTimeLimite, seconds: 0 });

//     const [countdownEnded, setCountdownEnded] = useState(false);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             // Calculate new time based on current time
//             let newMinutes = time.minutes;
//             let newSeconds = time.seconds - 1;

//             // Adjust minutes if seconds reach negative
//             if (newSeconds < 0) {
//                 newSeconds = 59;
//                 newMinutes -= 1;
//             }

//             // If the countdown has ended, clear the interval
//             if (newMinutes === 0 && newSeconds === 0) {
//                 clearInterval(interval);
//                 setCountdownEnded(true);
//             }

//             // Update the time state
//             setTime({
//                 minutes: newMinutes,
//                 seconds: newSeconds
//             });
//         }, 1000);

//         // Clean up the interval
//         return () => clearInterval(interval);
//     }, [time]);

// // console.log(typeof(otpTimeLimite))
// // console.log(typeof(time.minutes))




//     return (
//         <div>
//             {countdownEnded ? (
//                 <p>
//                     To Resend Code Click Here
//                     <button className='btn  text-primary' style={{ marginTop: '-5px', textDecoration: 'underline' }} onClick={() => {
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
//                     <p>  Resend Your Code After

//                         <span> {`${time?.minutes?.toString().padStart(2, '0')}:${time?.seconds?.toString().padStart(2, '0')}`}</span>



//                     </p>


//                 </div>
//             )}
//         </div>
//     );
// };

// export default CountDown;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios'; // Import axios

// const CountDown = ({ otpTimeLimite, userEmail, id }) => {
//     const email = userEmail;

//     const generateOTP = () => {
//         const otp = Math.floor(100000 + Math.random() * 900000);
//         return otp.toString();
//     };

//     const resendOTP = async () => {
//         const otp = generateOTP();

//         try {
//             const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/send-otp/email`, {
//                 email,
//                 otp
//             });
//             console.log(response);

//             const responseVerifyOTP = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}:5002/update/verification_code_email/${id}`, {
//                 email_verifiy_code: otp,
//                 OTP: 2,
//                 emailCodeTimeOut: otpTimeLimite
//             });
//             console.log(responseVerifyOTP.data);

//             // Save countdown state to localStorage
//             localStorage.setItem('countdown', JSON.stringify({ minutes: otpTimeLimite, seconds: 0 }));
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

//     // useEffect(() => {
//     //     const interval = setInterval(() => {
//     //         let newMinutes = time.minutes;
//     //         let newSeconds = time.seconds - 1;
    
//     //         if (newSeconds < 0) {
//     //             newSeconds = 59;
//     //             newMinutes -= 1;
//     //         }
    
//     //         if (newMinutes === 0 && newSeconds === 0) {
//     //             clearInterval(interval);
//     //             setCountdownEnded(true);
//     //         } else {
//     //             setTime({
//     //                 minutes: newMinutes,
//     //                 seconds: newSeconds
//     //             });
    
//     //             // Update localStorage with the new countdown state
//     //             localStorage.setItem('countdown', JSON.stringify({ minutes: newMinutes, seconds: newSeconds }));
//     //         }
//     //     }, 1000);
    
//     //     return () => clearInterval(interval);
//     // }, [time, otpTimeLimite]);

    

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
//     }, [time, otpTimeLimite]);
    
    

//     return (
//         <div>
//             {countdownEnded ? (
//                 <p>
//                     Did Not Get A Code
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
//                     <p>Resend Code After <span>{`${time?.minutes?.toString().padStart(2, '0')}:${time?.seconds?.toString().padStart(2, '0')}`}</span></p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CountDown;

import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios

const CountDown = ({ otpTimeLimite, userEmail, id }) => {
    const email = userEmail;

    const generateOTP = () => {
        const otp = Math.floor(100000 + Math.random() * 900000);
        return otp.toString();
    };

    const resendOTP = async () => {
        const otp = generateOTP();

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/send-otp/email`, {
                email,
                otp
            });
            console.log(response);

            const responseVerifyOTP = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}:5002/update/verification_code_email/${id}`, {
                email_verifiy_code: otp,
                OTP: 2,
                emailCodeTimeOut: otpTimeLimite
            });
            console.log(responseVerifyOTP.data);

            // Save countdown state to localStorage
            localStorage.setItem('countdown', JSON.stringify({ minutes: otpTimeLimite, seconds: 0 }));
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
                    Did Not Get A Code
                    <button className='btn text-primary' style={{ marginTop: '-5px', textDecoration: 'underline' }} onClick={() => {
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
                    <p>Resend Code After <span>{`${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`}</span></p>
                </div>
            )}
        </div>
    );
};

export default CountDown;
