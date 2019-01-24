$(document).ready(function () {

  var ajaxResults = {};
  var clickedEmployee = {};
  var searched = false;
  var filteredResults = [];

  function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
  }

  function updateEmployeeDirectory(data) {
    var employeeHTML = '';
    $.each(data, function (i, employee) {
      employeeHTML += '<div class="employee">';
      employeeHTML += '<div class="employee-image"><img src="' + employee.picture.medium + '" alt=""></div>';
      employeeHTML += '<div class="employee-info">';
      employeeHTML += '<h2 class="employee-name">' + employee.name.first + ' ' + employee.name.last + '</h2>';
      employeeHTML += '<div class="employee-email">' + employee.email + '</div>';
      employeeHTML += '<div class="employee-city">' + employee.location.city + '</div>';
      employeeHTML += '</div></div>';
    });
    $('#employee-directory').html(employeeHTML);
  }

  function updateEmployeeModal(data) {
    var birthday;
    if (searched === false) {
      birthday = new Date(ajaxResults[clickedEmployee].dob.date);
      $("#modal .employee-image img").attr("src", ajaxResults[clickedEmployee].picture.large);
      $("#modal .employee-name").text(ajaxResults[clickedEmployee].name.first + ' ' + ajaxResults[clickedEmployee].name.last);
      $("#modal .employee-email").text(ajaxResults[clickedEmployee].email);
      $("#modal .employee-city").text(ajaxResults[clickedEmployee].location.city);
      $("#modal .employee-phone").text(ajaxResults[clickedEmployee].phone);
      $("#modal .employee-address").text(ajaxResults[clickedEmployee].location.street + ', ' + ajaxResults[clickedEmployee].location.state + ' ' + ajaxResults[clickedEmployee].location.postcode);
      $("#modal .employee-birthday").text('Birthday: ' + getFormattedDate(birthday));
    } else {
      birthday = new Date(filteredResults[clickedEmployee].dob.date);
      $("#modal .employee-image img").attr("src", filteredResults[clickedEmployee].picture.large);
      $("#modal .employee-name").text(filteredResults[clickedEmployee].name.first + ' ' + filteredResults[clickedEmployee].name.last);
      $("#modal .employee-email").text(filteredResults[clickedEmployee].email);
      $("#modal .employee-city").text(filteredResults[clickedEmployee].location.city);
      $("#modal .employee-phone").text(filteredResults[clickedEmployee].phone);
      $("#modal .employee-address").text(filteredResults[clickedEmployee].location.street + ', ' + filteredResults[clickedEmployee].location.state + ' ' + filteredResults[clickedEmployee].location.postcode);
      $("#modal .employee-birthday").text('Birthday: ' + getFormattedDate(birthday));
    }
  }

  //   search the array for input value and display them only
  $("#filters-search-input").on('keyup', function () {
    filteredResults = [];
    searched = false;
    var filter = $(this)[0].value.toLowerCase().replace(/\s+/g, '');

    ajaxResults.forEach(result => {
      if (result.name.first.includes(filter)) {
        searched = true;
        filteredResults.push(result);
      }
    });

    if (filteredResults === undefined || filteredResults.length == 0) {
      $('#employee-directory').html('<div>No Results Found</div>');
    } else {
      updateEmployeeDirectory(filteredResults);
    }

  });

  //   get the data from api
  $.ajax({
    url: 'https://randomuser.me/api/?results=12',
    dataType: 'json',
    success: function (data) {
      ajaxResults = data.results;
      updateEmployeeDirectory(ajaxResults);
    }
  });

  // open model on click
  $("#employee-directory").on('click', '.employee', function () {
    $("#modal").toggleClass('show');

    clickedEmployee = $(this).index();

    // hide and show model navigation
    if (searched === false && clickedEmployee === 0 && ajaxResults.length >= 2 || searched === true && clickedEmployee === 0 && filteredResults.length >= 2) {
      $("#previousModal").hide();
      $("#nextModal").show();
    } else if (searched === false && clickedEmployee === 0 && ajaxResults.length === 1 || searched === true && clickedEmployee === 0 && filteredResults.length === 1) {
      $("#nextModal").hide();
      $("#previousModal").hide();
    } else if (searched === false && clickedEmployee === ajaxResults.length - 1 || searched === true && clickedEmployee === filteredResults.length - 1) {
      $("#nextModal").hide();
      $("#previousModal").show();
    } else {
      $("#nextModal").show();
      $("#previousModal").show();
    }

    updateEmployeeModal(clickedEmployee);

  });

  //   show previous employee
  $("#modal").on('click', '#previousModal', function () {

    // hide and show model navigation previous
    if (searched === false && clickedEmployee === 1 && ajaxResults.length >= 2 || searched === true && clickedEmployee === 1 && filteredResults.length > 2) {
      $("#previousModal").hide();

    } else if (searched === true && clickedEmployee === 1 && filteredResults.length <= 2) {
      $("#previousModal").hide();
      $("#nextModal").show();
    } else {
      $("#previousModal").show();
      $("#nextModal").show();
    }

    if (clickedEmployee != 0) {
      clickedEmployee -= 1;
    }

    if (clickedEmployee >= 0) {
      updateEmployeeModal(clickedEmployee);
    }
  });

  //   show next employee
  $("#modal").on('click', '#nextModal', function () {

    // hide and show model navigation next
    if (searched === false && clickedEmployee === ajaxResults.length - 2 || searched === true && clickedEmployee === filteredResults.length - 2 && filteredResults.length > 2) {
      $("#nextModal").hide();
    } else if (searched === true && clickedEmployee === 0 && filteredResults.length === 2) {
      $("#nextModal").hide();
      $("#previousModal").show();
    } else {
      $("#nextModal").show();
      $("#previousModal").show();
    }

    if (searched === false && clickedEmployee != ajaxResults.length - 1 || searched === true && clickedEmployee != filteredResults.length - 1) {
      clickedEmployee += 1;
      updateEmployeeModal(clickedEmployee);
    }
  });

  //   close modal on click
  $("#modal").on('click', '.close-modal', function () {
    $("#modal").toggleClass('show');
  });

});
