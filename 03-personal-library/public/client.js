$( document ).ready(function() {
  var items = [];
  var itemsRaw = [];
  
  refreshBooks();

  $('#display').on('click','li.bookItem',function() {
    $("#detailTitle").html('<b>'+itemsRaw[this.id].title+'</b> (id: '+itemsRaw[this.id]._id+')');
    $.getJSON('/api/books/'+itemsRaw[this.id]._id, function(data) {
      let bookDetails = '';

      _refreshComments(data);
      bookDetails =
        `<br>
          <form id="newCommentForm">
            <input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment">
            <br><button class="btn btn-info addComment" type="submit" id="${data._id}">Add Comment</button>
            <button class="btn btn-danger deleteBook" type="button" id="${data._id}">Delete Book</button>
          </form>`;
      $('#commentsControls').html(bookDetails);
    });
  });
  
  $('#bookDetail').on('click','button.deleteBook',function() {
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'delete',
      success: function(data) {
        $('#comments').html('<p style="color: red;">'+data+'<p><p>Refresh the page</p>');
      }
    });
  });  
  
  $('#bookDetail').on('click','button.addComment', function(event) {
    event.preventDefault();

    $.ajax({
      url: `/api/books/${this.id}`,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: _refreshComments
    });
  });
  
  $('#newBook').click(function(event) {
    event.preventDefault();

    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: refreshBooks
    });
  });
  
  $('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'text',
      success: refreshBooks
    });
  });

  function refreshBooks() {
    $.getJSON('/api/books', function(data) {
      _resetView();

      if(!data.length) {
        return;
      }

      itemsRaw = data;
      $.each(data, function(i, val) {
        items.push('<li class="bookItem" id="' + i + '">' + val.title + ' - ' + val.commentcount + ' comments</li>');
        return ( i !== 14 );
      });
      if (items.length >= 15) {
        items.push('<p>...and '+ (data.length - 15)+' more!</p>');
      }
      $('<ul/>', {
        'class': 'listWrapper',
        html: items.join('')
        }).appendTo('#display');
    });

    function _resetView() {
      items = [];

      $('#display').empty();
      $('#bookTitleToAdd').val('');
    }
  }

  function _refreshComments({comments}) {
    const commentsList = [];

    $.each(comments, function(_, val) {
      commentsList.push('<li>' +val+ '</li>');
    });
    $('#commentToAdd').val('');
    $('#commentsList').empty().html(commentsList.join(''));
  }
});