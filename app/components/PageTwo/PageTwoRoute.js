export default function PageTwoRoute($stateProvider) {
  'ngInject';

  $stateProvider
    .state('PageTwo', {
      url: '/pageTwo',
      resolve: {
        pageTwoModule: function($q, $ocLazyLoad) {
          'ngInject';

          return $q(resolve => {
            require.ensure(['./module'], function() {
              let module = require('./module');

              $ocLazyLoad.load([{
                name: module.default,
              }]);
              resolve();
            });
          });
        }
      },
      templateProvider: function($q) {
        'ngInject';

        return $q(resolve => {
          require.ensure(['./PageTwoLazy.html'], function() {
            let template = require('./PageTwoLazy.html');
            resolve(template);
          });
        });
      },
      controller: 'PageTwoCtrl',
      controllerAs: 'vm'
    });
}
