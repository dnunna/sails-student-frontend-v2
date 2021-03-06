(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of student id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=student_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getStudent(record_id){
    return $.get("http://localhost:1337/student/" + record_id, function(data){
      console.log("got student");
    })
  }

  $(function(){

    //initialize variables for items in the DOM we will work with
    let manageStudentForm = $("#manageStudentForm");
    let addStudentButton = $("#addStudentButton");

    $('#studentTable').DataTable({

      colReorder: true,
     "scrollX": true,
      columnDefs: [
            { width: '20%', targets: 7}
        ],
      dom: 'Bfrtip',
      buttons: [
          'copy', 'csv', 'excel', 'pdf', 'print'
      ]
    });

    //this section is for jvalidation rules and warning messages
    var validator = $("#manageStudentForm").validate({
      rules: {
        first_name: {
          required: true,
          minlength: 2
        },
        last_name: {
          required: true,
          minlength: 2
        },
        start_date: {
          pattern: /^\d{4}-((0\d)|(1[012]))-(([012]\d)|3[01])$/
        },
        gpa: {
          min: 2,
          max: 4.0
        },
        sat: {
          min: 500,
          max: 2000
        }
      },
      messages: {
        first_name: {
          required: "First name is required",
          minlength: "At least 2 characters required!"
        },
        last_name: {
          required: "Last name is required",
          minlength: "At least 2 characters required!"
        },
        start_date: {
           pattern: "The format should be yyyy-mm-dd"
         },
        gpa: {
          min: "The min gpa should be 2",
          max: "The max gpa is 4"
        },
        sat: {
          min: "The min sat should be 500",
          max: "The max sat is 2000"
        }
      }
    });

    //add student button functionality
    addStudentButton.click(function(){
       $("input").val('');
      validator.resetForm();
      manageStudentForm.attr("action", "/create_student");
      manageStudentForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageStudentForm.submit()
          }
        }
      });
    })

  	$("#studentTable").on("click", "#editButton", function(e){
      validator.resetForm();
      let recordId = $(this).data("studentid")
      manageStudentForm.find("input[name=student_id]").val(recordId);
      manageStudentForm.attr("action", "/update_student");
      let student = getStudent(recordId);

      //populate form when api call is done (after we get student to edit)
      student.done(function(data){
        $.each(data, function(name, val){
            var $el = $('[name="'+name+'"]'),
                type = $el.attr('type');

            switch(type){
                case 'checkbox':
                    $el.attr('checked', 'checked');
                    break;
                case 'radio':
                    $el.filter('[value="'+val+'"]').attr('checked', 'checked');
                    break;
                default:
                    $el.val(val);
            }
        });
      })

      manageStudentForm.dialog({
        title: "Update Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageStudentForm.submit()
          }
        }
      });
    })


    $("#studentTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("studentid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Student": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
