;(function(){
  'use strict';

  angular.module('libApp', ['ngRoute', 'mgcrea.ngStrap'])
    .config(function($routeProvider){
      $routeProvider
      .when('/', {
        templateUrl: 'views/table.html',
        controller: 'LibraryController',
        controllerAs: 'library'
      })
      .when('/new', {
        templateUrl: 'views/form.html',
        controller: 'LibraryController',
        controllerAs: 'library'
      })
      .when('/:id', {
        templateUrl: 'views/show.html',
        controller: 'ShowController',
        controllerAs: 'show'
      })
      .when('/:id/edit', {
        templateUrl: 'views/form.html',
        controller: 'EditController',
        controllerAs: 'library'
      })
      .otherwise({redirectTo: '/'});
    })
   .factory('libraryFactory', function($http, $location){
    
     function getLibrary(id, cb){
       var url = 'https://jsslibrary.firebaseio.com/books/' + id + '.json';
     
      $http.get(url)
        .success(function(data){
          cb(data);
        })
        .error(function(err){
          console.log(err);
        });
     }

     function editBook(id, library){
        var url = 'https://jsslibrary.firebaseio.com/books/' + id + '.json';
        $http.put(url, library)
          .success(function(data){
            $location.path('/')
          })
          .error(function(err){
            console.log(err)
          });
        };

      function getAllBooks(cb){
        $http.get('https://jsslibrary.firebaseio.com/books.json')
        .success(function(data){
          cb(data);
        })
        .error(function(err){
          console.log(err);
        });
      }

      function createBook(book, cb){
        $http.post('https://jsslibrary.firebaseio.com/books.json', book)
          .success(function(data){
            cb(data)
          })
          .error(function(err){
            console.log(err);
          });
       }

      function deleteBook(bookId, cb){
        var url = 'https://jsslibrary.firebaseio.com/books/' + bookId + '.json';
        $http.delete(url)
          .success(function(){
            cb()
          })
          .error(function(err){
            console.log(err);
          });
       }

      return {
        getLibrary: getLibrary,
        editBook: editBook,
        getAllBooks: getAllBooks,
        createBook: createBook,
        deleteBook: deleteBook
      };
   })
    .controller('ShowController', function($routeParams, libraryFactory){
      var vm = this;
      var id = $routeParams.id;
      libraryFactory.getLibrary(id, function(data){
        vm.book = data;
      });
    })
    .controller('EditController', function($routeParams, libraryFactory){
      var vm = this;
      var id = $routeParams.id;

      libraryFactory.getLibrary(id, function(data){
        vm.newBook = data;
      });

      vm.addNewBook = function(){
         libraryFactory.editBook(id, vm.newBook)
      };

      vm.readOptions = {
           all: 'All',
           some: 'Some',
           none: 'None'
        };

     })
    .controller('LibraryController', function($http, libraryFactory){
        var vm = this;

     libraryFactory.getAllBooks(function(data){
      vm.books = data;
     });
    
     vm.addNewBook = function(){
        libraryFactory.createBook(vm.newBook, function(data){
          vm.books[data.name] = vm.newBook;
          vm.newBook = _freshBook();
        });
     };
       
     vm.removeBook = function(bookId){
       libraryFactory.deleteBook(bookId, function(){
          delete vm.books[bookId]; 
       })
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


