(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of student class id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=student_class_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getStudentClass(record_id){
    return $.get("http://localhost:1337/student_class/" + record_id, function(data){
      console.log("got student");
    })
  }

  $(function(){

    //initialize variables for items in the DOM we will work with
    let manageStudentClassForm = $("#manageStudentClassForm");
    let addStudentClassButton = $("#addStudentClassButton");

    $('#studentclassTable').DataTable({

      colReorder: true,
     "scrollX": true,
      dom: 'Bfrtip',
      buttons: [
          'copy', 'csv', 'excel', 'pdf', 'print'
      ]
    });

    //this section is for jvalidation rules and warning messages
    var validator = $("#manageStudentClassForm").validate({
      rules: {
        student_id: {
          number: true
        },
        class_id: {
          number: true
        }
      },
      messages: {
        student_id: {
          number: "Not a number"
        },
        class_id: {
          number: "Not a number"
        }
      }
    });

    //add student button functionality
    addStudentClassButton.click(function(){
       $("input").val('');
      validator.resetForm();
      manageStudentClassForm.attr("action", "/create_studentclass");
      manageStudentClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            manageStudentClassForm.submit()
          }
        }
      });
    })

  	$("#studentclassTable").on("click", "#editButton", function(e){
      validator.resetForm();
      let recordId = $(this).data("studentclassid")
      manageStudentClassForm.find("input[name=student_class_id]").val(recordId);
      manageStudentClassForm.attr("action", "/update_studentclass");
      let studentclass = getStudentClass(recordId);

      //populate form when api call is done (after we get student to edit)
      studentclass.done(function(data){
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

      manageStudentClassForm.dialog({
        title: "Update Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageStudentClassForm.submit()
          }
        }
      });
    })


    $("#studentclassTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("studentclassid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Student Class": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
