
(function ($) {
	// nav - scroll to section on click
	$('#qm-navbar a').click( function () {
		var target = $(this).attr('data-target');
		
		// close nav in mobile
		$('#qm-navbar').removeClass('in');

    $("html, body").animate({scrollTop: $('.'+target).offset().top - 60 }, 2000);
	})

	// forms
  $("#formContact").submit(function(e) {

  // blocking submit
  // e.preventDefault();

    // getting all input elemets in array
    var inputs = $('#formContact :input');
    // getting all values of elemets in array
    var values = {};
    inputs.each(function() {
        values[this.name] = $(this).val();
    });
    // console.log(values);

    // validate phone number field
    if (isNaN(values['phone'])) {values.phone = "";}

    $.each(values, function (key, value) {
      var inVal = ".l-c-"+key;
      var err = '#'+key+'Fe';

      if (value == "") {
        e.preventDefault();
        $(inVal).addClass('v-fail');
        $(err).removeClass('hide');
        if (key == "message") { 
          $(".col-sm-6 textarea").addClass('v-fail');
          $(err).removeClass('hide');
        }
      }
      else {
        $(inVal).removeClass('v-fail');
        $(err).addClass('hide');

        if (key == "message") { 
          $(".col-sm-6 textarea").removeClass('v-fail');
          $(err).addClass('hide');
        }
      }
    })

    if($('.v-fail').length === 0) {
      var URL = 'https://hcnmfikqrg.execute-api.eu-west-1.amazonaws.com/dev/contact';
       var data = {
         name: $('#name'),
         email: $('#email'),
         phone: $('#phone'),
         message: $('#message')
       };
       
       $.ajax({
         type: 'POST',
         url: URL,
         dataType: 'json',
         contentType: 'application/json',
         data: JSON.stringify(data),
         success: function () {
           // clear form and show a success message
           alert('yay');
         },
         error: function () {
           // show an error message
           alert('boo');
         }
       });
    }
  });


  //label animation
  function activeLabel(that) {
    //if input empty
    if ($(that).val() == "") {
      var target = $(that).attr('data-target');
      target = $('#'+target);

      $(target).addClass('lab-active');
      $(target).parent().addClass('lab-cont-active');
    }

  }
  function deactiveLabel(that) {
    if ($(that).val() == "") {
      var target = $(that).attr('data-target');
      target = $('#'+target);

      $(target).removeClass('lab-active');
      $(target).parent().removeClass('lab-cont-active');
    }
  }

  $('.input-field').on('autocompletechange change', function () {

      if ($(this).val() != "") {
        var target = $(this).attr('data-target');
        target = $('#'+target);

        $(target).addClass('lab-active');
        $(target).parent().addClass('lab-cont-active');
      }

    }).change();

  $('.input-field').click(function () {
    var that = this;
    activeLabel(that);
  })
  $('.input-field').focus(function () {
    var that = this;
    activeLabel(that);
  })
  $('.input-field').focusout(function () {
    var that = this;
    deactiveLabel(that);
  })

// header animation
$( document ).ready(function() {

  $('.img2.item img').addClass('imgScale');

  $('.h-1').addClass('h-1-ani');
});

}(jQuery));