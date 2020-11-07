//REGISTRATION


$(function() {
  
  // It has the name attribute "registration"
  $("form[name='registration']").validate({
    // Specify validation rules
    rules: {
     
     
     name: "required",
      email: {
        required: true,
       
        email: true
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    // Specify validation error messages
    messages: {
     name: "Please enter Name",
     
      password: {
        required: "Please provide a password of min length 6",
        minlength: "Your password must be at least 6 characters long"
      },
      email: "Please enter a valid email address"
    },
    
    submitHandler: function(form) {
      form.submit();
    }
  });


// Login Validation

$("form[name='login_form']").validate({
  // Specify validation rules
  rules: {
  
   
   name: "required",
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      minlength: 6
    }
  },
  // Specify validation error messages
  messages: {
   name: "Please enter Name",
   
    password: {
      required: "Please provide a password of min length 6",
      minlength: "Your password must be at least 6 characters long"
    },
    email: "Please enter a valid email address"
  },
  // Make sure the form is submitted to the destination defined
  // in the "action" attribute of the form when valid
  submitHandler: function(form) {
    form.submit();
  }
});

$("form[name='profile_change_passwd']").submit(function(e){

 
  var password   = $('input[name=password]');
  var repassword = $('input[name=password1]');
  if(password.val().length<6){
    console.log(password.val().length)
   // alert("password should be atleast 6 characters long"); 
    e.preventDefault();
    document.getElementsByClassName("err_msg")[0].style.display="block";
    return false;

  } 

  if (password.val() != repassword.val()) {
   // alert("password and confirm password should be match")
   document.getElementsByClassName("err_msg")[0].style.display="block";
    return false;
}
else{
  document.getElementsByClassName("err_msg")[0].style.display="none";
 return true;
}

});


});


