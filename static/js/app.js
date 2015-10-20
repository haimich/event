$(document).ready(function() {

   // Initialize datepicker
   $('.datepicker').datepicker({
     format: 'dd.mm.yyyy',
     weekStart: 1
   });
   $('[data-datepicker-id]').click(function() {
    var id= $(this).attr('data-datepicker-id');
    $('#'+id).datepicker('show');
   });
   
});