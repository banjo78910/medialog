$( document ).ready( function() {

  var filmData;

  $('.search-params').submit(function(e){
    // e.preventDefault();
    var title   = $('input[name="title"]').val(),
        yearStr = $('input[name="year"]').val(),
        yearInt = parseInt(yearStr, 10);
    console.log('submit called');

    $.get('/search',
    {
      title: title,
      year: yearStr
    },
    function(data){
      filmData = data;
    });
  });
});
