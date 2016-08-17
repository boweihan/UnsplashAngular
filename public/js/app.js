// initialize root module with routeProvider
var App = angular.module('root', ['ngRoute']);

// provide angular routes, for this app we'll just use the one /sloogle
App.config(function($routeProvider) {
  $routeProvider
    .when('/sloogle', {
          templateUrl: "/public/views/list.html",
          controller: "ListController",
    })
    .otherwise({
      redirectTo: '/sloogle'
    })
});

// define factory methods, used a factory instead of a service here because we don't need constructors, factories only INVOKE while services call new on the function, these are both singletons
App.factory('pictures', ['$http', function($http) {
  return {
    getPictures: function() {
      return $http.get("/api/curated")
        .then(
          function(response) {
            return response.data.data;
          },
          function(errResponse) {
            console.log("error while fetching all pictures from app.js");
          }
        )
    },
    searchPictures: function(searchString) {
      return $http.get("/api/pictures?search="+searchString)
        .then(
          function(response) {
            return response.data.data;
          },
          function(errResponse) {
            console.log("error while fetching searched pictures from app.js");
          }
        )
    },
    likePicture: function(id) {
      return $http.get("/api/pictures/like?id="+id)
        .then(
          function(response) {
            return 'liked';
          },
          function(errResponse) {
            console.log("error while liking image from app.js");
          }
        )
    },
    unLikePicture: function(id) {
      return $http.get("/api/pictures/unlike?id="+id)
        .then(
          function(response) {
            return 'unliked';
          },
          function(errResponse) {
            console.log("error while unliking image from app.js");
          }
        )
    },
    favoritePicture: function(url) {
      return $http.get("/api/pictures/favorite?image="+url)
        .then(
          function(response) {
            return 'favorited';
          },
          function(errResponse) {
            console.log("error while favoriting image from app.js")
          }
        )
    },
    showFavoritedPictures: function() {
      return $http.get("/api/favorited")
        .then(
          function(response) {
            return response.data.data
          },
          function(errResponse) {
            console.log("error while showing favorite pictures from app.js")
          }
        )
    }
  }
}]);

App.controller("ListController", function(pictures, $scope) {
  // set initial scopes
  $scope.search = "";
  $scope.title = "Curated Pictures";

  // get all pictures on page load
  pictures.getPictures()
    .then(function(pictures) {
      pics = JSON.parse(pictures);
      for(i=0;i<pics.length;i++) {
        if (pics[i] === undefined) {
          pictures.splice(i, 1);
        }
      }
      $scope.pics = pics
    })

  // call updateSearch on enter keypress to call searchPictures in factory 'pictures'
  $scope.updateSearch = function() {
    pictures.searchPictures($scope.search)
      .then(function(pictures) {
        $scope.pics = JSON.parse(pictures);
        $scope.title = "Searched for: " + $scope.search
      })
  }

  // call favorite picture on link click
  $scope.showFavorites = function() {
    pictures.showFavoritedPictures()
      .then(function(pictures) {
        $scope.pics = JSON.parse(pictures);
        $scope.title = "Showing: Favorites"
      })
  }

  // call like picture on link click
  $scope.favorite = function(url) {
    pictures.favoritePicture(url)
      .then(function(pictures) {
        $scope.title = $scope.title + "thanks for favoriting a picture"
      })
  }

  // call unlike picture on link click

  // call show favorited pictures on link click



  // this function allows searching with keyup (NOT USING IT TO AVOID EXCESS API CALLS)
  // $scope.$watch("search", function(newValue, oldValue) {
  //   if ($scope.search.length > 3) {
  //     pictures.searchPictures($scope.search)
  //       .then(function(pictures) {
  //         $scope.pics = JSON.parse(pictures);
  //       })
  //   }
  // })
})

// directive to handle enter event
App.directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if(event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.ngEnter, {'event':event});
        })
      event.preventDefault();
      }
    })
  }
})
