/**
* Template Name: Medicio
* Template URL: https://bootstrapmade.com/medicio-free-bootstrap-theme/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Auto generate the carousel indicators
   */
  $(() => {
    $.ajax({
      url: "/images/carousel/getAllCarouselImages",
      method: "GET",
      success: function (slides) {
        const $wrapper = $("#carousel-wrapper");
        const $indicators = $("#carousel-indicators");

        $wrapper.empty();
        $indicators.empty();

        $.each(slides, function (index, slide) {
          const activeClass = index === 0 ? "active" : "";

          $wrapper.append(`
            <div class="carousel-item ${activeClass}">
              <img src="${slide.url}" class="d-block w-100" alt="${slide.name}" />
              
              <div class="overlay"></div>

              <div class="hero-content">
                <h2>
                  <span class="typewriter-text" data-fulltext="${slide.name || "Welcome to Our Hospital"}"></span>
                  <span class="typing-cursor"></span>
                </h2>
                <p>${slide.description || "Quality care for every patient"}</p>
                <a href="#about" class="btn-get-started">Read More</a>
              </div>
            </div>
          `);
        });

        function startTypingEffect(element) {
          const fullText = element.data("fulltext");
          let index = 0;
          element.text(""); // reset text

          function typeChar() {
            if (index < fullText.length) {
              element.text(element.text() + fullText.charAt(index));
              index++;
              setTimeout(typeChar, 80);
            }
          }

          typeChar();
        }




        // ✅ AFTER slides are injected, generate indicators with your working logic
        generateCarouselIndicators();

        // ✅ Initialize Bootstrap carousel
        const heroCarousel = document.querySelector("#hero-carousel");
        if (heroCarousel) {
          new bootstrap.Carousel(heroCarousel, {
            interval: 5000,
            ride: "carousel"
          });
        }
        // Start typing for the first slide
        const first = $(".carousel-item.active .typewriter-text");
        if (first.length) startTypingEffect(first);

        // Trigger typing on every slide change
        $("#hero-carousel").on("slid.bs.carousel", function () {
          const element = $(".carousel-item.active .typewriter-text");
          if (element.length) startTypingEffect(element);
        });

      },
      error: function (xhr, status, error) {
        console.error("❌ Failed to load carousel images:", error);
      }
    });
  });

  // ✅ Your existing indicator generator
  function generateCarouselIndicators() {
    document.querySelectorAll('.carousel-indicators').forEach((carouselIndicator) => {
      const carousel = carouselIndicator.closest('.carousel');
      const carouselId = carousel.id;

      // Clear old indicators before regenerating
      carouselIndicator.innerHTML = "";

      carousel.querySelectorAll('.carousel-item').forEach((carouselItem, index) => {
        if (index === 0) {
          carouselIndicator.innerHTML += `<li data-bs-target="#${carouselId}" data-bs-slide-to="${index}" class="active"></li>`;
        } else {
          carouselIndicator.innerHTML += `<li data-bs-target="#${carouselId}" data-bs-slide-to="${index}"></li>`;
        }
      });
    });
  }


  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();







  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);








  // Now for the gallery slider
  $(() => {

    function formatDate(dateString) {
      const formatted = new Date(dateString)
        .toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short', // e.g. "May"
          year: 'numeric'
        })
        .replace(/ (\d{4})$/, ', $1'); // adds comma before the year
      return formatted;
    }


    $.getJSON("/images/gallery/getAllGalleryImages", function (images) {
      if (images.length > 0) {
        let slidesHtml = "";

        images.forEach((img) => {
          // Adjust if your API uses a different field for URL
          const imageUrl = img.url || `/gallery/${img.name}`;

          slidesHtml += `
            <div class="swiper-slide">
              <a class="glightbox" data-gallery="images-gallery" href="${imageUrl}">
                <img src="${imageUrl}" class="img-fluid" alt="${img.name || ''}">
              </a>
            </div>`;
        });

        $("#gallery-wrapper").html(slidesHtml);

        // ✅ Init Swiper after content is injected
        const swiper = new Swiper(".gallery-swiper", {
          loop: true,
          speed: 600,
          autoplay: { delay: 5000 },
          slidesPerView: "auto",
          centeredSlides: true,
          pagination: {
            el: ".swiper-pagination",
            type: "bullets",
            clickable: true,
          },
          breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 0 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1200: { slidesPerView: 5, spaceBetween: 20 },
          },
        });

        // ✅ Init Lightbox after injection
        if (typeof GLightbox !== "undefined") {
          GLightbox({ selector: ".glightbox" });
        }
      } else {
        $("#gallery-wrapper").html("<p>No images found.</p>");
      }
    }).fail(function (err) {
      console.error("Failed to load gallery images:", err);
      $("#gallery-wrapper").html("<p>Error loading images.</p>");
    });
  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();












// For highlighting active header links
$(document).ready(function () {
  const currentURL = window.location.href;
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;

  // Remove any existing active state
  $('#navmenu a').removeClass('active');

  $('#navmenu a').each(function () {
    const linkHref = $(this).attr('href');

    // Case 1: Exact page match (e.g. /about)
    if (linkHref === currentPath || linkHref === currentPath + '/') {
      $(this).addClass('active');
    }

    // Case 2: Homepage sections (e.g. /#contact, /#gallery)
    else if (linkHref.includes('#') && currentURL.includes(linkHref)) {
      $(this).addClass('active');
    }

    // Case 3: Root path highlight (home)
    else if (currentPath === '/' && linkHref === '/') {
      $(this).addClass('active');
    }
  });

  // When a user clicks a link
  $('#navmenu a').on('click', function () {
    $('#navmenu a').removeClass('active');
    $(this).addClass('active');
  });
});











// Home page JavaScript codes
$(() => {
  // Fetch Services
  if(window.location.pathname === '/' || window.location.pathname === '/index') {
    $.ajax({
      url: '/services/getAllServices?limit=6&page=1', // fetch just 6
      method: 'GET',
      success: function (res) {
        const services = res.data;
        const container = $('#servicesContainer');
        container.empty();

        services.forEach((service, index) => {
          const delay = (index + 1) * 100;

          // truncate description (e.g., 100 characters max)
          const shortDesc = service.description.length > 100 
            ? service.description.substring(0, 100) + "..." 
            : service.description;

          const card = `
            <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${delay}">
              <div class="service-card">
                <img src="${service.image}" alt="${service.title}" class="img-fluid">
                <div class="service-content">
                  <h3>${service.title}</h3>
                  <p>${shortDesc}</p>
                  <a href="/service-details?id=${service._id}" 
                    class="btn btn-sm"
                    style="background-color: #7F00FF; color: #fff; width: 150px; display: inline-block;">
                    Learn more →
                  </a>                
                </div>
              </div>
            </div>
          `;
          container.append(card);
        });
      },
      error: function (err) {
        console.error('Services fetch error:', err);
        $('#servicesContainer').html('<div class="text-danger text-center">Error loading services.</div>');
      }
    });

}





  // Fetch all services for the services page
  if (window.location.pathname === '/service') {
    $(document).ready(function () {
      $.ajax({
        url: '/services/getAllServices', // no ?page or ?limit
        method: 'GET',
        success: function (res) {
          const services = res.data || [];
          renderServices(services);
        },
        error: function (err) {
          console.error('❌ Services fetch error:', err);
          $('#services .row').html('<div class="col-12 text-center text-danger">Error loading services.</div>');
        }
      });

      function renderServices(services) {
        const container = $('#services .row');
        container.empty();

        if (services.length === 0) {
          container.html(`
            <div class="col-12">
              <div class="alert alert-info text-center">No services available yet.</div>
            </div>
          `);
          return;
        }

        services.forEach((service, index) => {
          const delay = (index + 1) * 100;
          
          // truncate description (e.g., 100 characters max)
          const shortDesc = service.description.length > 100 
            ? service.description.substring(0, 100) + "..." 
            : service.description;

          const card = `
            <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${delay}">
              <div class="service-card">
                <img src="${service.image || 'assets/img/default-service.jpg'}" alt="${service.title}" class="img-fluid">
                <div class="service-content">
                  <h3>${service.title}</h3>
                  <p>${shortDesc || ''}</p>
                  <a href="/service-details?id=${service._id}" class="btn btn-sm" style="background-color: #7F00FF; color: #fff; width: 150px">Learn more →</a>
                </div>
              </div>
            </div>
          `;
          container.append(card);
        });
      }
    });
  }




  if (window.location.pathname === '/service-details') {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get('id');
    console.log('Service ID from URL:', serviceId);

    $.ajax({
      url: `/services/getSingleService/${serviceId}`,
      method: 'GET',
      success: function (service) {
        if (!service) {
          $('#serviceContentWrapper').html('<div class="alert alert-warning text-center">Service not found.</div>');
          return;
        }
        renderServiceDetails(service);
      },
      error: function (err) {
        console.error('❌ Service fetch error:', err);
        $('#serviceContentWrapper').html('<div class="text-danger text-center">Error loading service details.</div>');
      }
    });

    function renderServiceDetails(service) {
      const container = $('#serviceContentWrapper');
      container.empty();

      const content = `
        <div class="animate__animated animate__fadeIn">
          <!-- Image -->
          <div class="service-details-image-container">
            <img 
              src="${service.image || '/assets/img/default-service.jpg'}" 
              alt="${service.title}" 
              class="img-fluid rounded-top"
              style="width: 100%; height: 100%; object-fit: fill;">
          </div>
          <br/>

          <div class="card-body">
            <h2 class="gradient-header entry-title mb-3 fw-bold">${service.title}</h2>
            <br/>
            <!-- Description -->
            <p class="card-text mt-3" style="line-height:1.7;">
              ${service.description}
            </p>
            <br/>

            <!-- Action Button -->
            <div class="mt-4">
              <a href="/service" class="btn btn-lg text-white" id="book-consultation-btn">
                <i class="bi bi-arrow-left-circle me-2"></i> Back to Services
              </a>
            </div>
          </div>
        </div>
      `;


      container.html(content);
    }
  }





  // Services list for footer and navbar
   $.ajax({
    url: '/services/getAllServices', // fetch all services
    method: 'GET',
    success: function (res) {

      const services = res.data || [];
      renderOtherServices(services);
      renderNavBarServices(services); // ✅ pass full service objects instead of only titles
      renderFooterServices(services); // ✅ pass full service objects instead of only titles
    },
    error: function (err) {
      console.error('❌ Services fetch error:', err);
    }
  });


  // ✅ Function to render Other Services
  function renderOtherServices(services) {
    const container = $('.other-services');
    container.empty();

    if (services.length === 0) {
      container.html('<div class="text-muted">No other services available yet.</div>');
      return;
    }

    services.forEach((service) => {
      const serviceItem = `
        <div class="d-flex align-items-center mb-3" style="cursor: pointer;" onclick="window.location.href='/service-details?id=${service._id}'">
          <img src="${service.image || 'assets/img/default-service.jpg'}" 
               alt="${service.title}" 
               class="me-3 rounded" 
               width="60" 
               height="60" 
               style="object-fit: cover;">
          <div>
            <h6 class="mb-1">
              <a href="/service-details?id=${service._id}" 
                 class="text-decoration-none text-white">
                ${service.title.length > 35 ? service.title.substring(0, 35) + '...' : service.title}
              </a>
            </h6>
          </div>
        </div>
      `;

      container.append(serviceItem);
    });
  }


  // Navbar services dropdown
  function renderNavBarServices(services) {
    const navbarList = $('#navbarServicesDropdownList'); // <ul id="navbarServicesDropdownList"></ul>
    navbarList.empty();

    if (services.length === 0) {
      navbarList.append('<li>No services available yet.</li>');
      return;
    }

    services.forEach(service => {
      navbarList.append(`
        <li>
          <a href="/service-details?id=${service._id}">
            ${service.title}
          </a>
        </li>
      `);
    });
  }

  // ✅ Footer rendering (titles + links with ID)
  function renderFooterServices(services) {
    const footerList = $('#footerServices'); // <ul id="footerServices"></ul>
    footerList.empty();

    if (services.length === 0) {
      footerList.append('<li>No services available yet.</li>');
      return;
    }

    services.forEach(service => {
      footerList.append(`
        <li>
          <a href="/service-details?id=${service._id}">
            ${service.title}
          </a>
        </li>
      `);
    });
  }









  // Get all doctors for home page but first check if the element is in the page needed by id.
  if ($('#homeDoctorList').length) {
    fetchDoctorsHome();
  }

  function fetchDoctorsHome() {
    $.get('/departments/doctors/getAllDoctors').done((data) => {
      const { departments } = data;
      const container = $('#homeDoctorList');
      container.empty();

      departments.forEach(cat => {
        cat.doctors.forEach(doc => {
          const html = `
            <div class="doctor-card team-member doctor-clickable" 
                data-aos="fade-up"
                data-id="${doc._id}"
                data-department="${cat._id}"
                data-department-name="${cat.name}">
                
              <div class="member-img">
                <img src="${doc.profilePic || '/dashboard-assets/images/profile/user-3.jpg'}" alt="${doc.name}">
                <div class="social">
                  <a href="#"><i class="bi bi-twitter-x"></i></a>
                  <a href="#"><i class="bi bi-facebook"></i></a>
                  <a href="#"><i class="bi bi-instagram"></i></a>
                  <a href="#"><i class="bi bi-linkedin"></i></a>
                </div>
              </div>
              
              <div class="member-info">
                <h4>${doc.name}</h4>
                <span>${cat.name}</span>
              </div>
            </div>
          `;
          container.append(html);
        });
      });

      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    }).fail(() => {
      $('#homeDoctorList').html('<p class="text-danger">Failed to load doctors.</p>');
    });

    // ✅ Scroll behavior
    const sliderWrapper = document.querySelector('.doctor-slider-wrapper');
    const sliderContainer = document.querySelector('#homeDoctorList');

    // Dynamically calculate card width (including gap)
    function getCardStep() {
      const firstCard = document.querySelector('.doctor-card');
      if (!firstCard) return 300;
      const style = getComputedStyle(firstCard);
      return firstCard.offsetWidth + parseInt(style.marginRight || 20);
    }

    document.getElementById('nextDoctor').addEventListener('click', () => {
      sliderWrapper.scrollBy({ left: getCardStep(), behavior: 'smooth' });
    });

    document.getElementById('prevDoctor').addEventListener('click', () => {
      sliderWrapper.scrollBy({ left: -getCardStep(), behavior: 'smooth' });
    });

  }



  // Navigate to a doctor's profile page
  $(document).on('click', '.doctor-clickable', function (e) {
    // Ignore clicks on social icons
    if ($(e.target).closest('.social a').length > 0) return;

    const doctorId = $(this).data('id');
    const departmentId = $(this).data('department');

    // Redirect to doctor profile page
    window.location.href = `/doctor-profile?dept=${encodeURIComponent(departmentId)}&doc=${encodeURIComponent(doctorId)}`;
  });





  // Fetch doctors from the returned departments in the ejs
  $('#department').on('change', function () {
    const selectedOption = $(this).find('option:selected');
    const doctors = selectedOption.data('doctors') || [];

    const $doctorSelect = $('#doctor');
    $doctorSelect.empty();
    $doctorSelect.append('<option value="">Select Doctor</option>');

    doctors.forEach(doc => {
      $doctorSelect.append(`<option value="${doc.name}">${doc.name}</option>`);
    });
  });






  
  // Book an appointment form submission
  $('#appointmentForm').submit(function (e) {
    e.preventDefault();
    const $form = $(this);

    const formData = {
      name: $form.find('[name="name"]').val().trim(),
      email: $form.find('[name="email"]').val().trim(),
      phone: $form.find('[name="phone"]').val().trim(),
      dateAndTimeBooked: $form.find('[name="date"]').val(),
      department: $form.find('[name="department"]').val(),
      doctor: $form.find('[name="doctor"]').val(),
      subject: `Appointment with Dr. ${$form.find('[name="doctor"]').val()} in ${$form.find('[name="department"]').val()}`,
      message: $form.find('[name="message"]').val().trim()
    };

    $form.find('.loading').show();
    $form.find('.error-message, .sent-message').hide();

    // ✅ Show loading spinner before AJAX request
    Swal.fire({
      title: 'Booking Appointment...',
      text: 'Please wait ...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // shows spinner
      }
    });

    $.ajax({
      url: '/appointments/book',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success: function (res) {
        $form.find('.loading').hide();
        Swal.fire('Success!', 'Appointment booked successfully.', 'success');
        $form[0].reset();
      },
      error: function (xhr) {
        $form.find('.loading').hide();
        const message = xhr.responseJSON?.message || 'Something went wrong!';
        Swal.fire('Error', message, 'error');
      }
    });
  });








  // Dynamically display departments from the backend JavaScript codes
  $.ajax({
    url: '/departments/getAllDepartments',
    method: 'GET',
    success: function (departments) {
      // First handle the navbar department dropdown
      const dropdownList = $('#departmentsDropdownList');
      dropdownList.empty(); // clear any existing <li> items
      departments.forEach((dept, index) => {
        dropdownList.append(`
          <li><a href="/#departments">${dept.name}</a></li>
        `);
      });

      const tabList = $('.nav-tabs');
      const tabContent = $('.tab-content');

      tabList.empty();
      tabContent.empty();

      if (!departments.length) {
        tabList.append('<li class="nav-item"><span class="nav-link disabled">No departments available</span></li>');
        return;
      }

      departments.forEach(function (dept, index) {
        const tabId = `tabs-tab-${index + 1}`;
        const isActive = index === 0 ? 'active show' : '';
        const image = dept.imageUrl || '/dashboard-assets/images/products/s1.jpg'; // fallback

        // Tabs on the left
        tabList.append(`
          <li class="nav-item">
            <a class="nav-link ${isActive}" data-bs-toggle="tab" href="#${tabId}">${dept.name}</a>
          </li>
        `);

        // Content on the right
        tabContent.append(`
          <div class="tab-pane ${isActive}" id="${tabId}">
            <div class="row">
              <div class="col-lg-8 details order-2 order-lg-1">
                <h3>${dept.name}</h3>
                <p class="fst-italic"> Details - </p>
                <p>${dept.description || 'No description provided.'}</p>
              </div>
              <div class="col-lg-4 text-center order-1 order-lg-2">
                <img src="${image}" alt="${dept.name}" class="img-fluid rounded shadow-sm" style="max-height: 280px; min-height: 280px; object-fit: fit;">
              </div>
            </div>
          </div>
        `);
      });
    },
    error: function (xhr, status, error) {
      console.error('Error loading departments:', error);
    }
  });









  // Doctors profile page JavaScript codes
  if (window.location.pathname === '/doctor-profile') {

    function getQueryParam(param) {
      return new URLSearchParams(window.location.search).get(param);
    }

    const deptId = getQueryParam('dept');
    const docId = getQueryParam('doc');

    function fetchDoctorProfile(deptId, docId) {
      // Show loading spinner/text
      $('#doctorName').text('Loading...');
      $('#doctorRole').text('Loading...');
      $('#doctorDepartment').text('Loading...');
      $('#doctorEmail').text('Loading...');
      $('#doctorPhone').text('Loading...');
      $('#doctorWriteup').text('Loading doctor profile...');
      $('#doctorImage').attr('src', '/dashboard-assets/images/profile/user-3.jpg');

      $.get(`/departments/${deptId}/doctors/${docId}`)
        .done((doctor) => {
          console.log(doctor)
          $('#doctorImage').attr('src', doctor.profilePic || '/dashboard-assets/images/profile/user-3.jpg');
          $('#doctorName').text(`Dr ${doctor.name}`);
          $('#doctorRole').text(`Role: ${doctor.role}` || 'N/A');
          $('#doctorDepartment').text(`Department: ${doctor.departmentName}` || 'N/A');
          $('#doctorEmail').text(doctor.email || 'N/A');
          $('#doctorPhone').text(doctor.phone || 'N/A');
          $('#doctorWriteup').html(doctor.description || 'No description available.');
        })
        .fail((xhr) => {
          $('#doctorDetailsContainer').html(
            `<p class="text-danger text-center">
              ${xhr.responseJSON?.message || 'Failed to load doctor details.'}
            </p>`
          );
        });
    }

    $(document).ready(() => {
      if (deptId && docId) {
        fetchDoctorProfile(deptId, docId);
      } else {
        $('#doctorDetailsContainer').html('<p class="text-danger text-center">Invalid doctor details</p>');
      }
    });
}










  // The Blog/Latest news section
  let currentSlide = 0;

  function renderNews(blogs) {
    const newsContainer = document.getElementById('newsContainer');
    if (!blogs.length) {
      newsContainer.innerHTML = '<div class="text-muted text-center">No news available.</div>';
      return;
    }

    function formatDate(dateString) {
      const formatted = new Date(dateString)
        .toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short', // e.g. "May"
          year: 'numeric'
        })
        .replace(/ (\d{4})$/, ', $1'); // adds comma before the year
      return formatted;
    }

    newsContainer.innerHTML = blogs.map((blog, index) => {
      const date = new Date(blog.createdAt || Date.now()).toLocaleDateString();
      return `
        <div class="news-item" data-aos="fade-up" data-aos-delay="${100 + index * 100}">
          <div class="news-box p-3 h-100">
            <img src="${blog.image || '/assets/img/news/default.jpg'}" alt="News Image">
            <h6 class="mt-4 fw-bold text-white">${blog.title.length > 40 ? blog.title.substring(0, 40) + '...' : blog.title}</h6>
            <small class="text-white">${formatDate(date)}</small>
            <p class="mt-2">${blog.message.substring(0, 50)}...</p>
            <a href="/blog-details?id=${blog._id}" style="background-color: #7F00FF; color: #fff;" class="btn btn-sm mt-2" data-id="${blog._id}">Read More</a>
          </div>
        </div>
      `;
    }).join('');

    // Reset slide on render
    currentSlide = 0;
    $('#newsContainer').css('transform', 'translateX(0)');
  }

  function slideNews(direction) {
    const container = document.getElementById('newsContainer');
    const items = container.children;
    const totalItems = items.length;
    const visibleItems = window.innerWidth < 576 ? 1 : window.innerWidth < 992 ? 2 : 4;

    // Protect against overflow
    currentSlide = Math.min(
      Math.max(currentSlide + direction, 0),
      Math.max(totalItems - visibleItems, 0)
    );

    const slideWidth = items[0]?.offsetWidth + 20; // include gap
    container.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  }

  // Attach buttons globally (you can put this outside if not re-rendered often)
  window.slideNews = slideNews;

  // AJAX load blogs
  $.ajax({
    url: '/blog/latestNews',
    method: 'GET',
    success: function (blogs) {
      renderNews(blogs);
    },
    error: function (err) {
      console.error('News fetch error:', err);
      $('#newsContainer').html('<div class="text-danger text-center">Error loading news.</div>');
    }
  });






  // Fetch and view single blog's details
  if (window.location.pathname === '/blog-details') {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    if (!blogId) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Access',
        text: 'No blog ID provided.',
      });
      return;
    }

    // 🔁 Fetch and Render Blog
    function loadBlogDetails(blogId) {
      $.ajax({
        url: '/blog/getSingleBlog/' + blogId,
        method: 'GET',
        success: function (blog) {
          const createdAt = new Date(blog.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          });

          let commentsHtml = '';
          if (blog.comments?.length) {
            commentsHtml = `<h5 class="comments-count p-4">${blog.comments.length} Comment${blog.comments.length > 1 ? 's' : ''}</h5>`;
            blog.comments.forEach((c, i) => {
              const date = new Date(c.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              });
              commentsHtml += `
                <div id="comment-${i}" class="comment mb-5 p-4 rounded shadow">
                  <div class="d-flex align-items-start gap-3">
                    <div class="comment-img">
                      <img src="/assets/img/user-1.jpg" alt="User" class="rounded-circle" width="50" height="50">
                    </div>
                    <div class="flex-grow-1">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <h6 class="mb-0 fw-semibold text-white">${c.name}</h6>
                        <small class="text-white-50"><i class="bi bi-clock me-1"></i>${date}</small>
                      </div>
                      <p class="text-white mb-2" style="font-size: 0.95rem;">${c.comment}</p>
                    </div>
                  </div>
                </div>
              `;
            });
          }

          const html = `
            <div class="blog-details-article rounded col-12 mx-auto mb-5">
              <article class="entry entry-single rounded shadow p-4">
                <div class="entry-img mb-4 text-center">
                  <img src="${blog.image || '/assets/img/blog/blog-1.jpg'}" alt="Blog Image" class="img-fluid rounded w-100" style="max-height: 400px; object-fit: cover;">
                </div>

                <h2 class="gradient-header entry-title mb-3 fw-bold">${blog.title}</h2>

                <div class="entry-meta mb-3 text-white-50 small">
                  <ul class="list-inline mb-0">
                    <li class="list-inline-item me-3"><i class="bi bi-person me-1"></i> Admin</li>
                    <li class="list-inline-item me-3"><i class="bi bi-clock me-1"></i><time datetime="${blog.createdAt}">${createdAt}</time></li>
                    <li class="list-inline-item"><i class="bi bi-chat-dots me-1"></i> ${blog.comments?.length || 0} Comments</li>
                  </ul>
                </div>
                <br/>

                <div class="entry-content" 
                    style="line-height: 1.7; font-size: 15px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; max-width: 100%;">
                  <p>${blog.message}</p>
                </div>
              </article>

              <div class="blog-comments mt-5">
                ${commentsHtml || '<p class="p-4 text-white-50">No comments yet.</p>'}

                <div class="reply-form mt-4 p-4">
                  <h4>Leave a Comment</h4>
                  <form id="commentForm">
                    <div class="row">
                      <div class="col-md-6 form-group">
                        <input name="name" type="text" class="form-control" placeholder="Your Name">
                      </div>
                      <div class="col-md-6 form-group mt-3 mt-md-0">
                        <input name="email" type="email" class="form-control" placeholder="Your Email">
                      </div>
                    </div>
                    <div class="form-group mt-3">
                      <textarea name="comment" class="form-control" rows="5" placeholder="Comment"></textarea>
                    </div>
                    <button type="submit" class="comment-btn btn mt-3">Post Comment</button>
                  </form>
                </div>
              </div>
            </div>
          `;

          $('#blogContentWrapper').html(html);
          $('html, body').animate({ scrollTop: $('#blogContentWrapper').offset().top }, 300);
        },
        error: function () {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Unable to load blog details.',
          });
        }
      });
    }

    // Load blog when page loads
    loadBlogDetails(blogId);




    // Handle comment submission
    $(document).on('submit', '#commentForm', function (e) {
      e.preventDefault();

      const name = $(this).find('input[name="name"]').val().trim();
      const email = $(this).find('input[name="email"]').val().trim();
      const comment = $(this).find('textarea[name="comment"]').val().trim();

      if (!name || !email || !comment) {
        Swal.fire({
          icon: 'warning',
          title: 'Incomplete Form',
          text: 'Please fill in all fields before submitting.',
        });
        return;
      }

      // ✅ Show loading spinner before AJAX request
      Swal.fire({
        title: 'Adding Comment...',
        text: 'Please wait...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // shows spinner
        }
      });

      $.ajax({
        url: `/blog/${blogId}/addComment`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name, email, comment }),
        success: function () {
          Swal.fire({
            icon: 'success',
            title: 'Comment Posted',
            text: 'Your comment has been successfully added.',
          }).then(() => {
            loadBlogDetails(blogId); // 👈 Refresh content dynamically
          });
        },
        error: function (err) {
          console.error('Error posting comment:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Unable to post comment. Please try again later.',
          });
        }
      });
    });

    // The sidebar for blog details page. It is supposed to be below but I am using it here to avoid duplication
    function renderLatestNews(blogs) {
      const container = $('.latest-news');
      container.empty();

      if (blogs.length === 0) {
        container.html('<div class="text-muted">No other blog posts available yet.</div>');
        return;
      }

      blogs.forEach((blog) => {
        const blogItem = `
          <div class="d-flex align-items-center mb-3" style="cursor: pointer;" onclick="window.location.href='/blog-details?id=${blog._id}'">
            <img src="${blog.image || 'assets/img/default-blog.jpg'}" 
                alt="${blog.title}" 
                class="me-3 rounded" 
                width="60" 
                height="60" 
                style="object-fit: cover;">
            <div>
              <h6 class="mb-1">
                <a href="/blog-details?id=${blog._id}" 
                  class="text-decoration-none text-white">
                  ${blog.title.length > 35 ? blog.title.substring(0, 35) + '...' : blog.title}
                </a>
              </h6>
            </div>
          </div>
        `;

        container.append(blogItem);
      });
    }

    // AJAX load blogs
    $.ajax({
      url: '/blog/latestNews',
      method: 'GET',
      success: function (blogs) {
        renderLatestNews(blogs);
      },
      error: function (err) {
        console.error('News fetch error:', err);
        $('#newsContainer').html('<div class="text-danger text-center">Error loading news.</div>');
      }
    });

  }















  // Contact company via email JavaScript codes
  $('#contactForm').submit(function (e) {
    e.preventDefault();
    const $form = $(this);

    const formData = {
      name: $form.find('[name="name"]').val().trim(),
      email: $form.find('[name="email"]').val().trim(),
      subject: $form.find('[name="subject"]').val().trim(),
      message: $form.find('[name="message"]').val().trim()
    };

    $form.find('.loading').show();
    $form.find('.error-message, .sent-message').hide();

    // ✅ Show loading spinner before AJAX request
    Swal.fire({
      title: 'Sending Email...',
      text: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // shows spinner
      }
    });

    $.ajax({
      url: '/contact/sendEmailAndSave',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success: function () {
        $form.find('.loading').hide();
        Swal.fire('Sent!', 'Message delivered successfully.', 'success');
        $form[0].reset();
      },
      error: function (xhr) {
        $form.find('.loading').hide();
        const message = xhr.responseJSON?.message || 'Failed to send message.';
        Swal.fire('Error', message, 'error');
      }
    });
  });










   const phoneNumber = "2348033204866";

  $("#whatsapp-btn").on("click", function () {
    const message = encodeURIComponent("Hello, I’d like to make an inquiry.");
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);

    if (isMobile) {
      // Mobile opens directly via wa.me
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    } else {
      const desktopUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
      const webUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

      // Create a hidden iframe to trigger desktop WhatsApp
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = desktopUrl;
      document.body.appendChild(iframe);

      // Set fallback in case nothing happens (likely app not installed or user cancels)
      const fallback = setTimeout(() => {
        window.open(webUrl, "_blank");
        document.body.removeChild(iframe);
      }, 3000); // 2 seconds is safe to avoid double trigger if app opens

      // Optionally: cancel fallback if window loses focus (user accepted the desktop prompt)
      const handleFocus = () => {
        clearTimeout(fallback);
        window.removeEventListener("focus", handleFocus);
        document.body.removeChild(iframe);
      };

      window.addEventListener("focus", handleFocus);
    }
  });













  // Services JavaScript codes. Attach click listener to service links
  // const isServicesPage = window.location.pathname === "/services";
  // // const displayCount = isServicesPage ? services.length : 6;

  // const container = $("#services .row");
  // container.empty(); // Clear the static items

  // services.slice(0, displayCount).forEach((service, index) => {
  //   const delay = 100 * (index + 1);
  //   const card = `
  //     <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${delay}">
  //       <div class="service-item position-relative">
  //         <div class="icon">
  //           <i class="${service.icon}"></i>
  //         </div>
  //         <a href="#" class="stretched-link">
  //           <h3>${service.title}</h3>
  //         </a>
  //         <p>${service.short}</p>
  //       </div>
  //     </div>
  //   `;
  //   container.append(card);
  // });

  // // Optional: Show "See all services" button on homepage
  // if (!isServicesPage) {
  //   container.append(`
  //     <div class="col-12 text-center mt-5">
  //       <a href="/services" class="cta-btn">See More Services</a>
  //     </div>
  //   `);
  // }



  // $(document).on("click", ".service-item", function (e) {
  //   e.preventDefault();

  //   const clickedTitle = $(this).find("h3").text().trim(); // Corrected to h3
  //   const service = services.find(s => s.title === clickedTitle);

  //   if (service) {
  //     $("#modalTitle").text(service.title);
  //     $("#modalContent").text(service.long);
  //     $("#modalIcon").attr("class", service.icon + " me-2");

  //     const modal = new bootstrap.Modal(document.getElementById("serviceModal"));
  //     modal.show();
  //   }
  // });

});
