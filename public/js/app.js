$(document).ready(function () {

  // Constructors
  function LoginValidator(){
    this.showLoginError = function(t, c) {
      $.msgBox({
        title: t,
        content: c,
        type: "error"
      });
    };
  };

  LoginValidator.prototype.validateForm = function() {
    if ($('#username').val() == ''){
      this.showLoginError('Hiba!', 'Kérlek érvényes felhasználónevet adj meg');
      return false;
    } else if ($('#password').val() == ''){
      this.showLoginError('Hiba!', 'Kérlek érvényes jelszót adj meg');
      return false;
    } else{
      return true;
    }
  };


  // Ajax Login
  var lv = new LoginValidator();
  $('#login-modal').delegate('button', 'click', function(e) {
    e.preventDefault();
    $(this).closest('form').ajaxSubmit({
      beforeSubmit : function(formData, jqForm, options){
        if (lv.validateForm() === false){
          return false;
        } else {
          return true;
        }
      },
      complete : function(res){
        console.log(res);
        if (res.status === 403) {
          $('#login-modal .login').html(res.responseText);
        } else {
          window.location = '/';
        }
      },
      error : function(e){
      }
    });
    return false;
  });

  //Ajax Register
  $('#register-modal').delegate('button', 'click', function(e) {
    e.preventDefault();
    $(this).closest('form').ajaxSubmit({
      complete : function(res){
        if (res.status === 403) {
          $('#register-modal .register').html(res.responseText);
        } else {
          window.location = '/dashboard';
        }
      },
      error : function(e){
      }
    });
    return false;
  });

  $('#new-workout-modal').delegate('button', 'click', function(e) {
    e.preventDefault();
    $(this).closest('form').ajaxSubmit({
      complete : function(res){
        if (res.status === 403) {
          $('#new-workout-modal .workout-container').html(res.responseText);
        } else {
          $('#new-workout-modal').modal('hide').data('modal', null);
          window.location = '/dashboard';
        }
      },
      error : function(e){
      }
    });
    return false;
  });

  var firstRun = true;
  $('#new-workout-modal').on('shown', function() {
    if(firstRun) {
      $('#tags').tagsInput({
        'height':'44px',
        'width':'100%',
        'defaultText':'címkék'
      });
    }
    firstRun = false;
  });

  $('#tags').tagsInput({
        'height':'44px',
        'width':'100%',
        'defaultText':'címkék'
  });

});


