import routes from '@routes';
import { Route } from './interfaces';
import createRenderer from 'svelte-state-renderer';
import createStateRouter from 'abstract-state-router';
import NotFound from './components/not-found.svelte';
import ErrorComponent from './components/error.svelte';
import { stateRouter as stateRouterStore, router as routerStore, error } from './store';

// @ts-ignore
import sausage from 'sausage-router';
// @ts-ignore
import makeRouter from 'hash-brown-router';

const router = sausage();
// @ts-ignore
const renderer = createRenderer();
const stateRouter = createStateRouter(renderer, document.body, {
	pathPrefix: '',
	router: makeRouter(router),
});

// Errors
error.subscribe(err => {
	const error = new ErrorComponent({
		target: document.body,
		props: { error: err },
	});

	stateRouter.once('stateChangeStart', () => error.$destroy());
});
stateRouter.on('stateChangeError', err => error.set({ message: err.message, code: err.code }));
stateRouter.on('routeNotFound', (route, paramaters) => {
	const notFound = new NotFound({
		target: document.body,
		props: { route, paramaters },
	});

	stateRouter.once('stateChangeStart', () => notFound.$destroy());
});

// Add the routes
(routes as { route: Route }[])
	.sort((a, b) => a.route.name.split('.').length - b.route.name.split('.').length)
	.forEach(file => {
		const route = file.route;

		stateRouter.addState({
			name: route.name,
			route: route.route,
			defaultChild: route.defaultChild,
			data: route.data,
			// @ts-ignore
			template: file.default,
			resolve: route.resolve,
			activate: route.activate,
			querystringParameters: route.querystringParameters,
			defaultParameters: route.defaultParameters,
		});
	});

// Store the router
stateRouterStore.set(stateRouter);
routerStore.set(router);

// Evaluate the current route
stateRouter.evaluateCurrentRoute(`app`);
