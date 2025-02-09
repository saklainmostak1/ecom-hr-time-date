"use client"
import Link from 'next/link';
import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState } from 'react';

import Offcanvas from 'react-bootstrap/Offcanvas';
import WebHome from '../../web_home/page';

const WebHeader = () => {

    const [usersId, setUsersId] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setUsersId(storedUserId);
        }
    }, []);



    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);




    return (
        <div >

            <Navbar expand="lg" className="bg-secondary">
                <Container>
                    <Navbar.Brand className='mb-2 mt-2' >React-Bootstrap</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto  mt-1 gap-lg-5 gap-2 gap-md-2">
                            <Link href="/">Home</Link>
                            <Link href="/">Blogs</Link>
                            <Link href="/">About</Link>
                            {/* <Link href="/Admin/dashboard" >Dashboard</Link> */}

                            {usersId ? (
                                <Link href="/Admin/dashboard">Dashboard</Link>
                            ) : (
                                <Link href="/admin/login">Dashboard</Link>
                            )}

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <>
                <Offcanvas show={show} onHide={handleClose}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        Some text as placeholder. In real life you can have the elements you
                        have chosen. Like, text, images, lists, etc.
                    </Offcanvas.Body>
                </Offcanvas>
            </>

        </div>
    );
};

export default WebHeader;