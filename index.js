'use strict';

//  создание контейнеров и полей
$(function() {
    var $studentListingContainer = $('.student-listing-container').parent();
    var $studentDataContainer = $('.student-data-container').parent();
    var $studentFormContainer = $('.student-form-container').parent();
    var $studentDataGroup = $('.student-data-group');
    var $studentTableBody = $('tbody');
    
    var $firstName = $('.first-name');
    var $lastName = $('.last-name');
    var $ageSelector = $('.student-age');
    var MIN_AGE = 1, MAX_AGE = 99;

    var studentSequence = JSON.parse(localStorage.getItem('studentSequence'));
    var $alertsList = $('.alert-danger');

//  задание дефолтного стиля отображения
    for (var i = MIN_AGE; i < MAX_AGE; i++) {
        $ageSelector.append($('<option>').val(i).text(i));
    }

    $studentDataContainer.hide();
    $studentFormContainer.hide();
    
//  формирование таблицы с именами и кнопками
    function studentRowView(student) {
        var $firstNameTd = $('<td>').html(student.first_name);
        var $lastNameTd = $('<td>').html(student.last_name);
        var $studentShowAnchor = $('<a>').html('Show').addClass('btn btn-default')
                                                                .attr('href', '#');
        var $studentEditAnchor = $('<a>').html('Edit').addClass('btn btn-primary')
                                                                .attr('href', '#');
        var $studentDeleteAnchor = $('<a>').html('Delete').addClass('btn btn-danger')
                                                                .attr('href', '#');
        var $actionsTd = $('<td>').data('id', student.id)
                        .append($studentShowAnchor, $studentEditAnchor, $studentDeleteAnchor);
        return $('<tr>').append($firstNameTd, $lastNameTd, $actionsTd);
    }

    $studentTableBody.empty();

// запрос на сервер для получения массива студентов
    $.get({
        url: 'https://spalah-js-students.herokuapp.com/students',
        contentType: "application/json",
        dataType: 'json',
        success: function (students) {
            $.each(students.data, function (index, student) {
                $studentTableBody.append(studentRowView(student));
            });
        }
    });

//  'Show' button
    function fillStudentData(student) {
        var $studentFullName = $('.student-full-name').html(student.first_name + ' ' + student.last_name);
        var $studentAge = $('.student-age').html(student.age);
        var $studentAtUniversity = $('.student-at-university').html(student.at_university ? 'yes' : 'no');
        if (student.courses) {
            var studentCourses = [];
            student.courses.forEach(function (course, i) {
                var courseElem = $('<div>').addClass('course-group');
                $('<b>').html('Course' + ++i + ': ').appendTo(courseElem);
                $('<span>').addClass('student-course').html(course).appendTo(courseElem);
                studentCourses.push(courseElem);
            });
            $('.student-data-group').last().html('').append(studentCourses);
        }
    }

    $(document).on('click', '.student-listing-container .btn-default', function (event) {
        var studentId = $(this).parent().data('id');
        $studentListingContainer.fadeOut(500, function () {
            $studentDataContainer.fadeIn(500);
        });

        event.preventDefault();

        $.get({
            url: 'https://spalah-js-students.herokuapp.com/students/' + studentId,
            contentType: "application/json",
            dataType: 'json',
            success: function (student) {
                fillStudentData(student.data)
            }
        });
    })
//  'Show' button end

//  'Edit' button
    function fillStudentForm(student) {
        var $studentFirstName = $('.first-name').val(student.first_name);
        var $studentLastName = $('.last-name').val(student.last_name);
        var ageOptions = [];
        for (var i = 1; i <= 99; i++) {
            ageOptions.push($('<option>').val(i).text(i));
        }
        var $studentAge = $('.student-age').append(ageOptions).val(student.age);
        var $studentAtUniversity = $('.student-at-university').attr('checked', student.at_university);
        if (student.courses) {
            var studentCourses = [];
            student.courses.forEach(function (courses, i) {
                var courseElem = $('<div>').addClass('form-group');
                $('<label>').html('Course ' + ++i + ' :').appendTo(courseElem);
                $('<input>').addClass('form-control student-course').val(student.courses).appendTo(courseElem);
                $('form').append(courseElem);
            });
        }
    }

    $(document).on('click', '.student-listing-container .btn-primary', function (event) {
        var studentId = $(this).parent().data('id');
        $studentListingContainer.fadeOut(500, function () {
            $studentFormContainer.fadeIn(500);
        });

        $.get({
            url: 'https://spalah-js-students.herokuapp.com/students/' + studentId,
            contentType: "application/json",
            dataType: 'json',
            success: function (student) {
                fillStudentForm(student.data);
            }
        });

        event.preventDefault();

    });
//  'Edit' button end

//  'Delete' button
        $.delete = function(url, data, callback, type){
            if ( $.isFunction(data) ){
                type = type || callback,
                callback = data,
                data = {}
            }
    
            return $.ajax({
                url: url,
                type: 'DELETE',
                success: callback,
                data: data,
                contentType: type
              });
            }
//  'Delete' button end


//  'Add' button
//  'Add' button end


//  сортировка и ее сохранение в local storage
    $studentTableBody.sortable({
        deactivate: function (event, ui) {
            var studentSequence = [];
            $.each($('tbody tr td:last-child'), function (index, row) {
                alert($(row).data('id'));
            });
            localStorage.setItem('studentSequence', JSON.stringify(studentSequence));
        }
    });

});