  // Show Sign Up modal from Login modal
  $(document).on('click', '#showSignUpBtn', function() {
    var loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (loginModal) loginModal.hide();
    var signUpModal = new bootstrap.Modal(document.getElementById('signUpModal'));
    signUpModal.show();
  });

  // Handle sign up form submit (demo only, no backend)
  $(document).on('submit', '#signUpForm', function(e) {
    e.preventDefault();
    var name = $('#signUpName').val().trim();
    var email = $('#signUpEmail').val().trim();
    var pass = $('#signUpPassword').val();
    var cpass = $('#signUpConfirmPassword').val();
    if (!name || !email || !pass || !cpass) {
      alert('Please fill all fields.');
      return;
    }
    if (pass !== cpass) {
      alert('Passwords do not match.');
      return;
    }
    // Here you would send data to backend for real registration
    alert('Account created for ' + name + ' (' + email + '). You can now log in.');
    var signUpModal = bootstrap.Modal.getInstance(document.getElementById('signUpModal'));
    if (signUpModal) signUpModal.hide();
    var loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
  });
(function($) {

  "use strict";

  var initPreloader = function() {
    $(document).ready(function($) {
    var Body = $('body');
        Body.addClass('preloader-site');
    });
    $(window).load(function() {
        $('.preloader-wrapper').fadeOut();
        $('body').removeClass('preloader-site');
    });
  }

  // init Chocolat light box
	var initChocolat = function() {
		Chocolat(document.querySelectorAll('.image-link'), {
		  imageSize: 'contain',
		  loop: true,
		})
	}

  var initSwiper = function() {

    var swiper = new Swiper(".main-swiper", {
      speed: 500,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

    var category_swiper = new Swiper(".category-carousel", {
      slidesPerView: 8,
      spaceBetween: 30,
      speed: 500,
      navigation: {
        nextEl: ".category-carousel-next",
        prevEl: ".category-carousel-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        991: {
          slidesPerView: 5,
        },
        1500: {
          slidesPerView: 8,
        },
      }
    });

    $(".products-carousel").each(function(){
      var $el_id = $(this).attr('id');

      var products_swiper = new Swiper("#"+$el_id+" .swiper", {
        slidesPerView: 5,
        spaceBetween: 30,
        speed: 500,
        navigation: {
          nextEl: "#"+$el_id+" .products-carousel-next",
          prevEl: "#"+$el_id+" .products-carousel-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 3,
          },
          991: {
            slidesPerView: 4,
          },
          1500: {
            slidesPerView: 5,
          },
        }
      });

    });


    // product single page
    var thumb_slider = new Swiper(".product-thumbnail-slider", {
      slidesPerView: 5,
      spaceBetween: 20,
      // autoplay: true,
      direction: "vertical",
      breakpoints: {
        0: {
          direction: "horizontal"
        },
        992: {
          direction: "vertical"
        },
      },
    });

    var large_slider = new Swiper(".product-large-slider", {
      slidesPerView: 1,
      // autoplay: true,
      spaceBetween: 0,
      effect: 'fade',
      thumbs: {
        swiper: thumb_slider,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }

  // input spinner
  var initProductQty = function(){

    $('.product-qty').each(function(){
      
      var $el_product = $(this);
      var quantity = 0;
      
      $el_product.find('.quantity-right-plus').click(function(e){
        e.preventDefault();
        quantity = parseInt($el_product.find('#quantity').val());
        $el_product.find('#quantity').val(quantity + 1);
      });

      $el_product.find('.quantity-left-minus').click(function(e){
        e.preventDefault();
        quantity = parseInt($el_product.find('#quantity').val());
        if(quantity>0){
          $el_product.find('#quantity').val(quantity - 1);
        }
      });

    });

  }

  // init jarallax parallax
  var initJarallax = function() {
    jarallax(document.querySelectorAll(".jarallax"));

    jarallax(document.querySelectorAll(".jarallax-keep-img"), {
      keepImg: true,
    });
  }


  // --- Cart Logic ---
  var cart = [];

  function updateCartDisplay() {
    var $cartItems = $('#cart-items-container');
    var $cartTotalRow = $('#cart-total-row');
    var $cartTotal = $('#cart-total');
    var $cartCheckoutBtn = $('#cart-checkout-btn');
    $cartItems.empty();
    if (cart.length === 0) {
      $cartItems.html('<li class="list-group-item text-center">Cart is empty</li>');
      $cartTotalRow.hide();
      $cartCheckoutBtn.hide();
    } else {
      var total = 0;
      cart.forEach(function(item, idx) {
        var itemTotal = item.price * item.qty;
        total += itemTotal;
        $cartItems.append('<li class="list-group-item d-flex justify-content-between lh-sm align-items-center">'
          + '<div>'
          + '<h6 class="my-0">' + item.name + '</h6>'
          + '<small class="text-body-secondary">Qty: ' + item.qty + '</small>'
          + '</div>'
          + '<span class="text-body-secondary">₹' + itemTotal + '</span>'
          + '<button class="btn btn-sm btn-danger ms-2 btn-remove-cart-item" data-idx="' + idx + '" title="Remove">&times;</button>'
          + '</li>');
      });
      $cartTotal.text('₹' + total);
      $cartTotalRow.show();
      $cartCheckoutBtn.show();
    }
  // Remove item from cart
  $(document).on('click', '.btn-remove-cart-item', function() {
    var idx = $(this).data('idx');
    cart.splice(idx, 1);
    updateCartDisplay();
  });
  }

  // Add to cart button click
  $(document).on('click', '.btn-cart', function(e) {
    e.preventDefault();
    var $product = $(this).closest('.product-item');
    var name = $product.find('h3').text().trim();
    var priceText = $product.find('.text-dark.fw-semibold').first().text().replace(/[^\d.]/g, '');
    var price = parseFloat(priceText);
    var qty = parseInt($product.find('input.quantity').val()) || 1;
    // Check if already in cart
    var found = false;
    cart.forEach(function(item) {
      if (item.name === name) {
        item.qty += qty;
        found = true;
      }
    });
    if (!found) {
      cart.push({ name: name, price: price, qty: qty });
    }
    updateCartDisplay();
    // Open cart offcanvas
    var cartOffcanvas = document.getElementById('offcanvasCart');
    if (cartOffcanvas) {
      var bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(cartOffcanvas);
      bsOffcanvas.show();
    }
  });

  // Login form submit: redirect to index2.html
  $(document).on('submit', '#loginModal form', function(e) {
    e.preventDefault();
    var email = $('#loginEmail').val().trim();
    var pass = $('#loginPassword').val();
    if (!email || !pass) {
      alert('Please enter email and password.');
      return;
    }
    window.location.href = 'index2.html';
  });

  // Show empty cart on load
  $(document).ready(function() {
    initPreloader();
    initSwiper();
    initProductQty();
    initJarallax();
    initChocolat();
    updateCartDisplay();
  });

})(jQuery);