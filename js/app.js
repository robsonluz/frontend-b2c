var app = angular.module('app', ['ngResource', 'ngRoute']);

/**
 * Configuração das Rotas (páginas do sistema)
 */
app.config(['$routeProvider', function($routerProvider){
	$routerProvider
		.when('/', {
			templateUrl: 'home.html'
		})

		.when('/produtos', {
			templateUrl: 'produtos-list.html',
			controller: 'ProdutoController',
			method: 'list'
		})

    .when('/pedidos', {
			templateUrl: 'pedidos-list.html',
			controller: 'PedidoController',
			method: 'list'
		})

	;
}]);


//ProdutoService
app.factory('ProdutoService', function($resource) {
	return $resource('http://gateway-b2c-myproject.192.168.99.100.nip.io/produtos/:id', {}, {});
});

//ProdutoController
app.controller('ProdutoController', function($scope, $routeParams, $route, $location, ProdutoService, PedidoService) {

	//Lista
	$scope.list = function() {
		$scope.produtos = ProdutoService.query();
	}


	$scope.abrirNovoProduto = function(produto) {
		$scope.produtoAtual = {};
		$("#modal-novo-produto").modal();
	}

	$scope.salvarProduto = function() {
		ProdutoService.save($scope.produtoAtual, function(produto){
			if(produto) {
				alert('Produto Inserido!');
				$("#modal-novo-produto").modal('hide');
				$scope.produtos = ProdutoService.query();
			}
		});
	}


	$scope.abrirComprar = function(produto) {
		$scope.pedidoAtual = {
			cliente: {},
			produtos: [
				produto
			]
		};
		$scope.pedidoAtual.produtos[0].quantidade = 1;
		$("#modal-comprar").modal();
	}

	$scope.confirmarCompra = function() {
		PedidoService.save($scope.pedidoAtual, function(pedido){
			if(pedido) {
				alert('Pedido Confirmado!');
				$("#modal-comprar").modal('hide');
				$location.path('/pedidos');
			}
		});
	}

	$scope.excluir = function(produto) {
		if(confirm('Confirma a Exclusão?')) {
			ProdutoService.remove($scope.noticia, function(){
				alert('Produto Excluído!');
				$scope.produtos = ProdutoService.query();
		  });
		}
	}

	//Chama o método definido na rota
	if($route.current.method){
		$scope[$route.current.method]();
	}
});



//PedidoService
app.factory('PedidoService', function($resource) {
	return $resource('http://gateway-b2c-myproject.192.168.99.100.nip.io/pedidos/:id', {}, {});
});

//PedidoController
app.controller('PedidoController', function($scope, $routeParams, $route, $location, PedidoService) {
	//Lista
	$scope.list = function() {
		$scope.pedidos = PedidoService.query();
	}

	//Chama o método definido na rota
	if($route.current.method){
		$scope[$route.current.method]();
	}
});
