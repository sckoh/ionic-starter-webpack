export default function AppConfig($urlRouterProvider) {
  'ngInject';

  // 当 url 不匹配任何state 时就会进入这个方法
  $urlRouterProvider.otherwise(function($injector, $location) {
    var $state = $injector.get('$state');
    $state.go('Page');
  });

  // $mdGestureProvider.skipClickHijack();

}
