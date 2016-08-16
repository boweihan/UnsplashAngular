// var unsplashCred = {
//   applicationId: "78cd46cc136d378fcd53b6f3a7754591387e38d78dccfa52bf3563999447df99",
//   secret: "0aa60887488aa8264bb73f0b75a5f0a41cc3cd28da67ed36e15363f7047b6f76",
//   bearer: "",
//   callbackUrl: "http://localhost:8080/sloogle"
// }
//
//
// angular.module("unsplashApp", ['ngRoute'])
//     // render the appropriate view
//     .config(function($routeProvider) {
//         $routeProvider
//             .when("/", {
//                 templateUrl: "./public/views/list.html",
//                 controller: "ListController",
//                 resolve: {
//                     pictures: function(pictures) {
//                         return pictures.getPictures();
//                     }
//                 }
//             })
//             .when("/new/contact", {
//                 controller: "NewContactController",
//                 templateUrl: "contact-form.html"
//             })
//             .when("/contact/:contactId", {
//                 controller: "EditContactController",
//                 templateUrl: "contact.html"
//             })
//             .otherwise({
//                 redirectTo: "/"
//             })
//     })
//     // fetch information from api
//     .service("pictures", function($http) {
//         this.getPictures = function() {
//           console.log('hello1');
//           return $http.get("./api/pictures").
//               then(function(response) {
//                 console.log(response);
//                 console.log('hello');
//                   return response;
//               }, function(response) {
//                   alert("Error finding Pictures.");
//               });
//         }
//         this.createContact = function(contact) {
//             return $http.post("/Pictures", contact).
//                 then(function(response) {
//                     return response;
//                 }, function(response) {
//                     alert("Error creating contact.");
//                 });
//         }
//         this.getContact = function(contactId) {
//             var url = "/Pictures/" + contactId;
//             return $http.get(url).
//                 then(function(response) {
//                     return response;
//                 }, function(response) {
//                     alert("Error finding this contact.");
//                 });
//         }
//         this.editContact = function(contact) {
//             var url = "/Pictures/" + contact._id;
//             console.log(contact._id);
//             return $http.put(url, contact).
//                 then(function(response) {
//                     return response;
//                 }, function(response) {
//                     alert("Error editing this contact.");
//                     console.log(response);
//                 });
//         }
//         this.deleteContact = function(contactId) {
//             var url = "/Pictures/" + contactId;
//             return $http.delete(url).
//                 then(function(response) {
//                     return response;
//                 }, function(response) {
//                     alert("Error deleting this contact.");
//                     console.log(response);
//                 });
//         }
//     })
//     // pass the data to the angular js view
//     .controller("ListController", function(pictures, $scope) {
//         $scope.pictures = pictures.data;
//     })
//     .controller("NewContactController", function($scope, $location, Pictures) {
//         $scope.back = function() {
//             $location.path("#/");
//         }
//
//         $scope.saveContact = function(contact) {
//             Pictures.createContact(contact).then(function(doc) {
//                 var contactUrl = "/contact/" + doc.data._id;
//                 $location.path(contactUrl);
//             }, function(response) {
//                 alert(response);
//             });
//         }
//     })
//     .controller("EditContactController", function($scope, $routeParams, Pictures) {
//         Pictures.getContact($routeParams.contactId).then(function(doc) {
//             $scope.contact = doc.data;
//         }, function(response) {
//             alert(response);
//         });
//
//         $scope.toggleEdit = function() {
//             $scope.editMode = true;
//             $scope.contactFormUrl = "contact-form.html";
//         }
//
//         $scope.back = function() {
//             $scope.editMode = false;
//             $scope.contactFormUrl = "";
//         }
//
//         $scope.saveContact = function(contact) {
//             Pictures.editContact(contact);
//             $scope.editMode = false;
//             $scope.contactFormUrl = "";
//         }
//
//         $scope.deleteContact = function(contactId) {
//             Pictures.deleteContact(contactId);
//         }
//     });
