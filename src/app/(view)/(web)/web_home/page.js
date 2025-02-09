import React from 'react';

const WebHome = () => {
    return (
        <div>
           <div className="container mt-4">
      {/* Hero Section */}
     {/* <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
        <ol className="carousel-indicators">
          <li
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
          ></li>
          <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></li>
          <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></li>
        </ol>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              style={{ height: "450px" }}
              className="d-block w-100"
              src="https://www.hubspot.com/hubfs/wordpress-slider-plugins.jpeg"
              alt="First slide"
            />
          </div>
          <div className="carousel-item">
            <img
              style={{ height: "450px" }}
              className="d-block w-100"
              src="https://www.hubspot.com/hubfs/Germany/Blog_images/wordpress-slider.jpg"
              alt="Second slide"
            />
          </div>
          <div className="carousel-item">
            <img
              style={{ height: "450px" }}
              className="d-block w-100"
              src="https://53.fs1.hubspotusercontent-na1.net/hubfs/53/wordpress-traffic.jpg"
              alt="Third slide"
            />
          </div>
        </div>
        <a
          className="carousel-control-prev"
          href="#carouselExampleIndicators"
          role="button"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </a>
        <a
          className="carousel-control-next"
          href="#carouselExampleIndicators"
          role="button"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </a>
      </div> */}
      <div className="row align-items-center bg-info p-5 rounded shadow-lg mt-4">
        <div className="col-md-6">
          <h1 className="display-4">Welcome to Our Website</h1>
          <p className="lead">
            Discover the best services and products crafted just for you. Let us
            make your experience unforgettable.
          </p>
          <button className="btn btn-primary btn-lg">Get Started</button>
        </div>
        <div className="col-md-6 text-center">
          <img
            src="https://bootstrapmade.com/content/demo/iLanding/assets/img/illustration-1.webp"
            alt="Hero"
            className="img-fluid rounded"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="row mt-5 text-white">
        <div className="col-md-4 text-center ">
          <div className="p-4 border rounded shadow-sm bg-primary">
            <i className="bi bi-lightning-charge display-4 text-primary"></i>
            <h3 className="mt-3">Fast and Reliable</h3>
            <p>
              Enjoy lightning-fast services designed to keep up with your busy
              lifestyle.
            </p>
          </div>
        </div>
        <div className="col-md-4 text-center">
          <div className="p-4 border rounded shadow-sm bg-success">
            <i className="bi bi-person-heart display-4 text-danger"></i>
            <h3 className="mt-3">Customer Focused</h3>
            <p>
              We value our customers and strive to meet their every need with
              care.
            </p>
          </div>
        </div>
        <div className="col-md-4 text-center">
          <div className="p-4 border rounded shadow-sm bg-info">
            <i className="bi bi-globe display-4 text-success"></i>
            <h3 className="mt-3">Global Reach</h3>
            <p>
              Connect with us from anywhere in the world and enjoy seamless
              experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mt-5 ">
        <h2 className="text-center">What Our Clients Say</h2>
        <div className="row mt-4">
          <div className="col-md-6 ">
            <div className="p-4 border rounded shadow-sm bg-warning">
              <p>
                "This is hands-down the best service I have ever used! Highly
                recommend."
              </p>
              <h5>- Jane Doe</h5>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-4 border rounded shadow-sm bg-danger">
              <p>
                "Amazing experience! Their team is super helpful and
                professional."
              </p>
              <h5>- John Smith</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
     
    </div>
        </div>
    );
};

export default WebHome;