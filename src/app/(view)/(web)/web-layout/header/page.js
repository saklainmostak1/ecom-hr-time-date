"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const WebHeader = () => {
  const [usersId, setUsersId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId") || "";
    }
    return "";
  });

  const [isNavbarOpen, setIsNavbarOpen] = useState(false); // State to handle navbar toggle

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setUsersId(storedUserId);
    }
  }, []);

  const toggleNavbar = () => {
    setIsNavbarOpen((prevState) => !prevState);
  };

  return (
    <div className="navbar navbar-expand-lg navbar-light bg-secondary">
      <nav className=" container">
        <a className="navbar-brand" href="#">
          Navbar
        </a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar} // Handle click to toggle navbar
          aria-controls="navbarSupportedContent"
          aria-expanded={isNavbarOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${
            isNavbarOpen ? "show" : ""
          }`} // Conditionally apply the "show" class
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" href="/">
                Home <span className="sr-only">(current)</span>
              </Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link" href="#">
                Link
              </Link>
            </li>
            {/* <li className="nav-item active">
              {usersId ? (
                <Link className="nav-link" href="/Admin/dashboard">
                  Dashboard
                </Link>
              ) : (
                <Link className="nav-link" href="/admin/login">
                  Dashboard
                </Link>
              )}
            </li> */}
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <button className="btn btn-sm btn-success my-2 my-sm-0" type="button">
              {usersId ? (
                <Link style={{ textDecoration: "none" }} href="/Admin/dashboard">
                  Login
                </Link>
              ) : (
                <Link style={{ textDecoration: "none" }} href="/admin/login">
                  Login
                </Link>
              )}
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
};

export default WebHeader;


















// <Navbar expand="lg" className="bg-secondary">
// <Container>
//     <Navbar.Brand className='mb-2 mt-2' >React-Bootstrap</Navbar.Brand>
//     <Navbar.Toggle aria-controls="basic-navbar-nav" />
//     <Navbar.Collapse id="basic-navbar-nav">
//         <Nav className="me-auto  mt-1 gap-lg-5 gap-2 gap-md-2">
//             <Link href="/">Home</Link>
//             <Link href="/">Blogs</Link>
//             <Link href="/">About</Link>
//             {/* <Link href="/Admin/dashboard" >Dashboard</Link> */}

//             {usersId ? (
//                 <Link href="/Admin/dashboard">Dashboard</Link>
//             ) : (
//                 <Link href="/admin/login">Dashboard</Link>
//             )}

//         </Nav>
//     </Navbar.Collapse>
// </Container>
// </Navbar>
// <>
// <Offcanvas show={show} onHide={handleClose}>
//     <Offcanvas.Header closeButton>
//         <Offcanvas.Title>Offcanvas</Offcanvas.Title>
//     </Offcanvas.Header>
//     <Offcanvas.Body>
//         Some text as placeholder. In real life you can have the elements you
//         have chosen. Like, text, images, lists, etc.
//     </Offcanvas.Body>
// </Offcanvas>
// </>