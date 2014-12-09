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
    .controller('ShowController', function($http, $routeParams){
      var vm = this;
      var id = $routeParams.id;
      $http.get('https://jsslibrary.firebaseio.com/books/' + id + '.json')
       .success(function(data){
        vm.book = data;
      })
      .error(function(err){
        console.log(err);
      });
    })
    .controller('EditController', function($http, $routeParams, $location){
      var vm = this;
      var id = $routeParams.id;
      var url = 'https://jsslibrary.firebaseio.com/books/' + id + '.json'
      $http.get(url)
        .success(function(data){
          vm.newBook = data;
        })
        .error(function(err){
          console.log(err);
        });
        
        vm.addNewBook = function(){
          $http.put(url, vm.newBook)
            .success(function(data){
               $location.path('/')          
            })
            .error(function(err){
            console.log(err);
            });
        };


        vm.readOptions = {
           all: 'All',
           some: 'Some',
           none: 'None'
        };

     })
    .controller('LibraryController', function($http){
        var vm = this;
    
      $http.get('https://jsslibrary.firebaseio.com/books.json')
       .success(function(data){
        vm.books = data;
      })
      .error(function(err){
        console.log(err);
      });
      
     vm.addNewBook = function(){
      $http.post('https://jsslibrary.firebaseio.com/books.json', vm.newBook)
        .success(function(data){
           vm.books[data.name] = vm.newBook;
          vm.newBook = _freshBook();
        })
        .error(function(err){
          console.log(err);
        });
     };

     vm.removeBook = function(bookId){
      var url = 'https://jsslibrary.firebaseio.com/books/' + bookId + '.json';
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


