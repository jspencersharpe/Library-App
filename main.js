;(function(){
  "use strict";

  angular.module('libApp', [])
    .controller('LibraryController', function($http){
      var vm = this;
    
      $http.get('https://jsslibrary.firebaseio.com/list.json')
      .success(function(data){
        vm.books = data;
      })
      .error(function(err){
        console.log(err);
      })
    vm.addNewBook = function(){
      $http.post('https://jsslibrary.firebaseio.com/list.json', vm.newBook)
        .success(function(data){
          vm.books[data.title] = vm.newBook;
          vm.newBook = _freshBook();
        })
        .error(function(err){
          console.log(err);
        });
    };

    vm.removeToDo = function(bookId){
      var url = 'https://jsslibrary.firebaseio.com/' + bookId + '.json';
      $http.delete(url)
        .success(function(){
          delete vm.books[bookId];
        })
        .error(function(err){
          console.log(err);
        });
    };

    vm.newBook = _freshBook();

    vm.readOptions = {
      all: 'All',
      some: 'Some',
      none: 'None'
    };

      function _freshBook(){
        return {
          read: 'none'
        }
      }
    });
}());

//addNew Task = addNewBook
//newTask = newBook
//todoCtrl = libCtrl
//name = title
//taskId = bookId
//task = book
//books = tasks
//priorityOptions = readOptions
//removeToDo = removeBook
//_freshTask = _freshBook
