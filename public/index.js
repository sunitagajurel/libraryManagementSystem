

function onPageLoad(){
    searchBooks()
}
//keeps track of clicked bookId 
bookId = null

//opens the popup for borrowing 
function openBrrForm(bookId) {
  document.getElementById("borrow-form").style.display = "block"; 
}

//close the popup for borrowing 
function closeBrrForm() {
  document.getElementById("borrow-form").style.display = "none";
}

//open  the popup for returning 
function openForm() {
document.getElementById("return-form").style.display = "block";
}

//close the popup for returning
function closeForm() {
  document.getElementById("return-form").style.display = "none";
}

//jquery starts here
$(document).ready(() => {
    window.onload = searchBooks();
  //handles search function 
  $('#searchBtn').click(() => {
    console.log('Button clicked');
    const bookName = $('#bookname').val();
    const author = $('#author').val();
    const genre = $('#genre').val();
    searchBooks(bookName, author, genre);
  });

  //called when burrow button is called on popup
  $('#brrBtn').click(() => {
    const uId = parseInt($('#uid').val());
    Authorise(bookId,uId)
  });

  //called when burrow button is called from bookList
  $('#resultContainer').on('click', '.brw', function() {
   
    bookId = $(this).closest('div.book').data('book-id');
    openBrrForm()
  });

  function searchBooks(bookName, author, genre) {
    console.log('Search book with name:' + bookName + author + genre);
    $('#resultContainer').empty();
    $.ajax({
      url: `/search`,
      method: 'GET',
      data: { 
        "bookName": bookName, 
        "author": author, 
        "genre": genre
      },
      success: function(response) {
        //handles empty search 
        if(response ==="book not found"){
          var bookHtml =  " <h1> Sorry No books found </h1>"
        }
        else{
          var books = response;
          var bookHtml = '<h2>Book Details:</h2>';
          for (let i = 0; i < books.length; i++) {
              bookHtml += '<div class="book" data-book-id="' + books[i].bookid + '">';
              bookHtml += '<h3>Title: ' + books[i].bookName + '</h3>';
              bookHtml += '<p>Author: ' + books[i].author + '</p>';
              bookHtml += '<p>Genre: ' + books[i].genre + '</p>';
              bookHtml += '<p>Rating: ' + books[i].rating + '</p>';
              bookHtml += `<button  class="brw">Borrow </button> </div> `;
          }
        }
        
        $('#resultContainer').html(bookHtml);
      },
      error: function(xhr, status, error) {
        console.error('Error:', error);
      }
    });
  }

  function Authorise(bookId,uId){
    console.log(bookId,uId)
    closeBrrForm()

       $.ajax({
      url: `/borrow`,
      method: 'GET',
      data: { 
        "uId": uId, 
        "bookId":bookId
      },
      success: function(response) {

        alert(response)
      }
    
  })
  }
})


