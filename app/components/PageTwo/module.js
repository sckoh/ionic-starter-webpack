import angular from 'angular';
import PageTwoService from './PageTwoService';
import PageTwoCtrl from './PageTwoCtrl';

export default angular.module('PageTwoComponent', [])
  .factory('PageTwoService', PageTwoService)
  .controller('PageTwoCtrl', PageTwoCtrl)
  .name;
